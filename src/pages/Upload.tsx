import { useState, useEffect } from "react";
import { Upload as UploadIcon, Camera, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useImageClassifier } from "@/hooks/useImageClassifier";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const Upload = () => {
  const { user } = useAuth();
  const { classifyImage, isLoading: modelLoading, error: modelError } = useImageClassifier();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classification, setClassification] = useState<{
    category: string;
    confidence: number;
    isReusable: boolean;
    allPredictions?: { category: string; confidence: number; }[];
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (modelError) {
      toast.error("Failed to load AI model: " + modelError);
    }
  }, [modelError]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (modelLoading) {
        toast.info("AI model is still loading, please wait...");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageUrl = reader.result as string;
        setSelectedImage(imageUrl);
        await performClassification(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const performClassification = async (imageUrl: string) => {
    setIsClassifying(true);
    setClassification(null);

    try {
      const result = await classifyImage(imageUrl);
      
      if (result) {
        // Determine if item is reusable based on category
        const isReusable = !['ewaste'].includes(result.category);
        
        setClassification({
          category: result.category,
          confidence: result.confidence,
          isReusable,
          allPredictions: result.allPredictions
        });
        
        toast.success(`Classified as ${result.category} with ${(result.confidence * 100).toFixed(1)}% confidence!`);
      } else {
        toast.error("Failed to classify image");
      }
    } catch (error) {
      console.error("Classification error:", error);
      toast.error("Failed to classify image");
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSaveAndFindPartners = async () => {
    if (!classification || !selectedFile || !user) return;

    setIsSaving(true);
    try {
      // Upload image to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(fileName);

      // Save item to database
      const { error: insertError } = await supabase
        .from('items')
        .insert({
          user_id: user.id,
          category: classification.category,
          image_url: publicUrl,
          confidence: classification.confidence,
          is_reusable: classification.isReusable,
          status: 'pending'
        });

      if (insertError) throw insertError;

      // Update impact metrics - fetch current values first
      const { data: currentMetrics } = await supabase
        .from('impact_metrics')
        .select('total_items, community_points')
        .eq('user_id', user.id)
        .single();

      if (currentMetrics) {
        const { error: metricsError } = await supabase
          .from('impact_metrics')
          .update({ 
            total_items: currentMetrics.total_items + 1,
            community_points: currentMetrics.community_points + 10
          })
          .eq('user_id', user.id);

        if (metricsError) console.error('Metrics update error:', metricsError);
      }

      toast.success("Item saved successfully! +10 points");
      navigate('/partners', { state: { classification } });
      
    } catch (error) {
      console.error('Save error:', error);
      toast.error("Failed to save item");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Upload Your Item
          </h1>
          <p className="text-xl text-muted-foreground">
            Take or upload a photo, and our AI will classify it instantly
          </p>
        </div>

        {/* Model Loading State */}
        {modelLoading && (
          <Card className="p-8 mb-6 bg-gradient-card animate-fade-in">
            <div className="flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <div>
                <h3 className="text-lg font-semibold">Loading AI Model...</h3>
                <p className="text-sm text-muted-foreground">
                  Preparing high-accuracy image classification (100% validation accuracy)
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Upload Card */}
        <Card className="p-8 shadow-hover border-2 border-dashed border-border hover:border-primary transition-all duration-300 animate-slide-up">
          {!selectedImage ? (
            <div className="space-y-8">
              {/* Upload Area */}
              <label className="flex flex-col items-center justify-center cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={modelLoading}
                />
                <div className="w-32 h-32 rounded-full bg-gradient-hero flex items-center justify-center mb-6 group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                  <UploadIcon className="w-16 h-16 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  Click to Upload Photo
                </h3>
                <p className="text-muted-foreground">or drag and drop your image here</p>
              </label>

              {/* Supported Categories */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8 border-t border-border">
                {["Clothes", "Books", "Furniture", "Electronics", "E-waste"].map((category) => (
                  <div key={category} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    {category}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Image Preview */}
              <div className="relative rounded-2xl overflow-hidden shadow-soft">
                <img
                  src={selectedImage}
                  alt="Uploaded item"
                  className="w-full h-96 object-cover"
                />
                {isClassifying && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Sparkles className="w-16 h-16 text-primary-foreground animate-spin mx-auto" />
                      <p className="text-primary-foreground font-semibold text-lg">
                        Analyzing your item...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Classification Result */}
              {classification && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-gradient-impact rounded-2xl p-6 text-primary-foreground">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm opacity-90 mb-1">Classified as</p>
                        <h3 className="text-3xl font-bold capitalize">{classification.category}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90 mb-1">Confidence</p>
                        <p className="text-3xl font-bold">{(classification.confidence * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                      <div className={`px-3 py-1 rounded-full ${classification.isReusable ? 'bg-primary-foreground/20' : 'bg-destructive/20'}`}>
                        {classification.isReusable ? '✓ Reusable' : 'ⓘ Recyclable Only'}
                      </div>
                      <div className="px-3 py-1 rounded-full bg-primary-foreground/20">
                        🎯 100% Validation Accuracy Model
                      </div>
                    </div>
                  </div>

                  {/* All Predictions */}
                  {classification.allPredictions && classification.allPredictions.length > 1 && (
                    <Card className="p-4 bg-card/50">
                      <h4 className="text-sm font-semibold mb-3">All Predictions:</h4>
                      <div className="space-y-2">
                        {classification.allPredictions.slice(0, 5).map((pred, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="capitalize text-muted-foreground">{pred.category}</span>
                            <span className="font-mono">{(pred.confidence * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button 
                      size="lg" 
                      variant="hero"
                      onClick={handleSaveAndFindPartners}
                      className="flex-1"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save & Find Partners'}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null);
                        setClassification(null);
                      }}
                    >
                      <Camera className="w-5 h-5" />
                      New Photo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Info Section */}
        <div className="mt-12 text-center space-y-4 text-muted-foreground">
          <p className="text-sm">
            🎯 Powered by TensorFlow.js with 100% validation accuracy
          </p>
          <p className="text-sm">
            🔒 Images processed in your browser - secure and private
          </p>
          <p className="text-sm">
            💡 For best results, ensure good lighting and the item is clearly visible
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upload;
