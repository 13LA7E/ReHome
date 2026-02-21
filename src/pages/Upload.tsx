import { useState, useEffect, useCallback, useRef } from "react";
import { Upload as UploadIcon, Camera, Sparkles, ArrowRight, Zap, ZapOff, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useImageClassifier, ClassificationResult } from "@/hooks/useImageClassifier";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Navigation } from "@/components/Navigation";
import { calcItemPoints, calcStreakBonus, FIRST_CATEGORY_BONUS } from "@/lib/points";

const CATEGORIES = ["books", "clothes", "electronics", "ewaste", "furniture"] as const;
type Category = typeof CATEGORIES[number];

const Upload = () => {
  const { user } = useAuth();
  const { classifyImage, error: modelError } = useImageClassifier();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage]   = useState<string | null>(null);
  const [selectedFile, setSelectedFile]     = useState<File | null>(null);
  const [isClassifying, setIsClassifying]   = useState(false);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [manualCategory, setManualCategory] = useState<Category | null>(null);
  const [isFunctional, setIsFunctional]     = useState<boolean | null>(null);
  const [isDragging, setIsDragging]         = useState(false);
  const [isSaving, setIsSaving]             = useState(false);
  const fileInputRef                        = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (modelError) toast.error("AI classification error: " + modelError);
  }, [modelError]);

  const effectiveCategory: Category = (manualCategory ?? classification?.category as Category) ?? "clothes";
  const needsFunctionalCheck = effectiveCategory === "electronics" && isFunctional === null && classification !== null;

  const processFile = useCallback(async (file: File) => {
    setSelectedFile(file);
    setClassification(null);
    setManualCategory(null);
    setIsFunctional(null);
    setIsClassifying(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageUrl = reader.result as string;
      setSelectedImage(imageUrl);
      try {
        const result = await classifyImage(imageUrl);
        if (result) {
          setClassification(result);
          if (result.category !== "electronics") {
            setIsFunctional(result.category !== "ewaste");
          }
          toast.success(
            `Classified as ${result.category}` +
            (result.count > 1 ? ` · ${result.count} items detected` : "") +
            ` (${(result.confidence * 100).toFixed(0)}% confidence)`
          );
        } else {
          toast.error("Failed to classify image");
        }
      } catch {
        toast.error("Failed to classify image");
      } finally {
        setIsClassifying(false);
      }
    };
    reader.readAsDataURL(file);
  }, [classifyImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop      = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) processFile(file);
    else if (file) toast.error("Please drop an image file");
  };

  const handleSaveAndFindPartners = async () => {
    if (!classification || !selectedFile || !user) return;
    if (needsFunctionalCheck) { toast.error("Please tell us if the item is still functional"); return; }

    setIsSaving(true);
    try {
      const finalCategory = manualCategory ?? (classification.category as Category);
      const finalReusable = finalCategory === "ewaste" ? false
                          : finalCategory === "electronics" ? (isFunctional ?? true)
                          : true;

      // Upload image
      const fileExt  = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("item-images").upload(fileName, selectedFile);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("item-images").getPublicUrl(fileName);

      // Save item
      const { error: insertError } = await supabase.from("items").insert({
        user_id: user.id, category: finalCategory, image_url: publicUrl,
        confidence: classification.confidence, is_reusable: finalReusable, status: "pending",
      });
      if (insertError) throw insertError;

      // Points: base
      const count      = classification.count ?? 1;
      const basePoints = calcItemPoints(finalCategory, finalReusable) * count;

      // Points: streak
      let streakPts = 0, streakLabel = "";
      try {
        const { data: recentItems } = await supabase
          .from("items").select("created_at").eq("user_id", user.id)
          .order("created_at", { ascending: false }).limit(30);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const daySet = new Set(
          (recentItems || []).map(r => { const d = new Date(r.created_at); d.setHours(0,0,0,0); return d.getTime(); })
        );
        let days = 1, check = today.getTime() - 86400000;
        while (daySet.has(check)) { days++; check -= 86400000; }
        const sb = calcStreakBonus(days);
        streakPts = sb.pts; streakLabel = sb.label;
      } catch { /* ignore */ }

      // Points: first-time category
      let firstCatPts = 0;
      try {
        const { data: existing } = await supabase.from("items").select("category").eq("user_id", user.id);
        const donated = new Set((existing || []).map(i => i.category));
        if (!donated.has(finalCategory)) firstCatPts = FIRST_CATEGORY_BONUS;
      } catch { /* ignore */ }

      const totalPts = basePoints + streakPts + firstCatPts;

      // Update metrics
      const { data: m } = await supabase.from("impact_metrics")
        .select("total_items, community_points").eq("user_id", user.id).maybeSingle();
      await supabase.from("impact_metrics").update({
        total_items: (m?.total_items || 0) + count,
        community_points: (m?.community_points || 0) + totalPts,
      }).eq("user_id", user.id);

      const bonusParts = [
        streakPts   > 0 ? `${streakLabel} +${streakPts}` : "",
        firstCatPts > 0 ? `New category +${firstCatPts}` : "",
      ].filter(Boolean);

      toast.success(
        `Saved! +${totalPts} pts` + (bonusParts.length ? ` (${bonusParts.join(", ")})` : "")
      );
      navigate("/partners", { state: { classification: { ...classification, category: finalCategory, isReusable: finalReusable } } });

    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save item");
    } finally {
      setIsSaving(false);
    }
  };

  const previewPts = classification
    ? calcItemPoints(effectiveCategory, effectiveCategory === "electronics" ? (isFunctional ?? true) : effectiveCategory !== "ewaste") * (classification.count ?? 1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Navigation />
      <div className="py-6 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Header */}
          <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground px-2">
              Upload Your Item
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-4">
              Take or upload a photo — our AI classifies it and counts items instantly
            </p>
          </div>

          {/* Upload Card */}
          <Card
            className={`p-5 md:p-8 shadow-hover border-2 border-dashed transition-all duration-300 animate-slide-up ${
              isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!selectedImage ? (
              <div className="space-y-6 md:space-y-8">
                {/* Upload Area */}
                <label className="flex flex-col items-center justify-center cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-hero flex items-center justify-center mb-4 md:mb-6 transition-all duration-300 ${
                    isDragging ? "shadow-glow scale-110" : "group-hover:shadow-glow group-hover:scale-110"
                  }`}>
                    <UploadIcon className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {isDragging ? "Drop to analyze" : "Click or drag & drop"}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">PNG, JPG, WEBP up to 10 MB</p>
                </label>

                {/* Categories & Points Guide */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 pt-6 border-t border-border">
                  {[
                    { label: "Clothes / Books", pts: "15–23 pts" },
                    { label: "Electronics",     pts: "25–38 pts" },
                    { label: "Furniture",       pts: "30–45 pts" },
                    { label: "E-waste",         pts: "5 pts" },
                    { label: "+20% bulk bonus", pts: "5+ items" },
                    { label: "Streak bonus",    pts: "+10–50 pts" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      <span>{item.label}</span>
                      <span className="ml-auto text-primary font-medium">{item.pts}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 md:space-y-8">
                {/* Image Preview */}
                <div className="relative rounded-2xl overflow-hidden shadow-soft">
                  <img src={selectedImage} alt="Uploaded item" className="w-full h-64 md:h-96 object-cover" />
                  {isClassifying && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center space-y-3 md:space-y-4">
                        <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground animate-spin mx-auto" />
                        <p className="text-primary-foreground font-semibold text-base md:text-lg">Analyzing your item...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Classification Result */}
                {classification && (
                  <div className="space-y-4 md:space-y-5 animate-fade-in">

                    {/* Result Banner */}
                    <div className="bg-gradient-impact rounded-2xl p-5 md:p-6 text-primary-foreground">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <div>
                          <p className="text-xs md:text-sm opacity-90 mb-1">Classified as</p>
                          <h3 className="text-2xl md:text-3xl font-bold capitalize">{effectiveCategory}</h3>
                          {classification.count > 1 && (
                            <p className="text-sm opacity-90 mt-0.5">{classification.count} items detected</p>
                          )}
                          {classification.detections.length > 0 && (
                            <p className="text-xs opacity-75 mt-0.5">
                              {classification.detections.map(d => `${d.count}× ${d.label}`).join(", ")}
                            </p>
                          )}
                        </div>
                        <div className="sm:text-right">
                          <p className="text-xs md:text-sm opacity-90 mb-1">Confidence</p>
                          <p className="text-2xl md:text-3xl font-bold">{(classification.confidence * 100).toFixed(0)}%</p>
                          <p className="text-sm opacity-90 mt-0.5 font-semibold">+{previewPts} pts</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm flex-wrap">
                        <div className={`px-2.5 py-1 rounded-full ${(effectiveCategory !== "ewaste" && isFunctional !== false) ? "bg-primary-foreground/20" : "bg-destructive/20"}`}>
                          {(effectiveCategory !== "ewaste" && isFunctional !== false) ? "✓ Reusable" : "⟳ Recyclable Only"}
                        </div>
                        <div className="px-2.5 py-1 rounded-full bg-primary-foreground/20">🤖 On-device AI</div>
                      </div>
                      {classification.reasoning && (
                        <p className="text-xs opacity-80 mt-2">{classification.reasoning}</p>
                      )}
                    </div>

                    {/* Manual Category Override */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-sm text-muted-foreground font-medium">AI wrong? Override:</p>
                      <Select
                        value={manualCategory ?? effectiveCategory}
                        onValueChange={(val) => {
                          setManualCategory(val as Category);
                          if (val !== "electronics") setIsFunctional(val !== "ewaste");
                          else setIsFunctional(null);
                        }}
                      >
                        <SelectTrigger className="w-40 h-9 text-sm">
                          <SelectValue />
                          <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Functional check for electronics */}
                    {effectiveCategory === "electronics" && isFunctional === null && (
                      <div className="rounded-xl border border-border p-4 space-y-3 animate-fade-in">
                        <p className="text-sm font-semibold text-foreground">Is this item still functional?</p>
                        <div className="flex gap-3">
                          <Button size="sm" variant="outline"
                            className="flex-1 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                            onClick={() => setIsFunctional(true)}
                          >
                            <Zap className="w-4 h-4 mr-2" /> Yes — it works
                          </Button>
                          <Button size="sm" variant="outline"
                            className="flex-1 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => { setIsFunctional(false); setManualCategory("ewaste"); }}
                          >
                            <ZapOff className="w-4 h-4 mr-2" /> No — broken
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                      <Button size="lg" variant="hero" onClick={handleSaveAndFindPartners}
                        className="flex-1 w-full sm:w-auto" disabled={isSaving || needsFunctionalCheck}
                      >
                        {isSaving ? "Saving..." : `Save & Find Partners (+${previewPts} pts)`}
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                      <Button size="lg" variant="outline"
                        onClick={() => { setSelectedImage(null); setClassification(null); setManualCategory(null); setIsFunctional(null); }}
                        className="w-full sm:w-auto"
                      >
                        <Camera className="w-5 h-5 mr-2" /> New Photo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Info Footer */}
          <div className="mt-8 md:mt-12 text-center space-y-2 text-muted-foreground">
            <p className="text-xs md:text-sm">🤖 Powered by on-device AI — no data leaves your browser</p>
            <p className="text-xs md:text-sm">💡 For best results, ensure good lighting and a clear view of the item</p>
            <p className="text-xs md:text-sm">🏆 Earn more for furniture & electronics, reusable condition, and donation streaks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
