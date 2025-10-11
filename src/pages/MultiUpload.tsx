import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Camera, Loader2, Upload, X, CheckCircle, Trash2, ArrowRight } from "lucide-react";
import { useImageClassifier } from "@/hooks/useImageClassifier";
import { z } from "zod";

const itemSchema = z.object({
  category: z.enum(['books', 'clothes', 'electronics', 'ewaste', 'furniture']),
  confidence: z.number().min(0).max(1),
  image_url: z.string().max(2048),
  is_reusable: z.boolean(),
  user_id: z.string().uuid(),
});

interface ImageData {
  id: string;
  file: File;
  preview: string;
  classification?: {
    category: string;
    confidence: number;
    isReusable: boolean;
  };
  classifying: boolean;
}

const MultiUpload = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<ImageData[]>([]);
  const [uploading, setUploading] = useState(false);
  const { classifyImage } = useImageClassifier();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    const newImages: ImageData[] = files.map(file => ({
      id: Math.random().toString(36),
      file,
      preview: URL.createObjectURL(file),
      classifying: true,
    }));

    setImages(prev => [...prev, ...newImages]);

    // Classify each image
    for (const imageData of newImages) {
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          const classification = await classifyImage(base64);
          
          setImages(prev => prev.map(img => 
            img.id === imageData.id 
              ? { ...img, classification, classifying: false }
              : img
          ));
        };
        reader.readAsDataURL(imageData.file);
      } catch (error) {
        console.error("Classification error:", error);
        setImages(prev => prev.map(img => 
          img.id === imageData.id 
            ? { ...img, classifying: false }
            : img
        ));
        toast.error(`Failed to classify ${imageData.file.name}`);
      }
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleSaveAll = async () => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const unclassified = images.filter(img => img.classifying || !img.classification);
    if (unclassified.length > 0) {
      toast.error("Please wait for all images to be classified");
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      let totalPointsEarned = 0;

      // Process each image
      for (const imageData of images) {
        const { file, classification } = imageData;
        
        if (!classification) continue;

        // Validate file size
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds 10MB limit`);
        }

        // Upload image to storage
        const fileExt = file.name.split(".").pop();
        const sanitizedExt = fileExt?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 10) || 'jpg';
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${sanitizedExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("item-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("item-images")
          .getPublicUrl(fileName);

        // Validate item data before insertion
        const itemData = {
          user_id: user.id,
          image_url: publicUrl,
          category: classification.category,
          confidence: classification.confidence,
          is_reusable: classification.isReusable,
        };

        itemSchema.parse(itemData);

        // Save item to database
        const { error: itemError } = await supabase
          .from("items")
          .insert({
            ...itemData,
            status: "pending",
          });

        if (itemError) throw itemError;

        // Each item earns 10 points
        totalPointsEarned += 10;
      }

      // Update impact metrics
      const { data: currentMetrics } = await supabase
        .from("impact_metrics")
        .select("total_items, community_points")
        .eq("user_id", user.id)
        .maybeSingle();

      const { error: metricsError } = await supabase
        .from("impact_metrics")
        .update({
          total_items: (currentMetrics?.total_items || 0) + images.length,
          community_points: (currentMetrics?.community_points || 0) + totalPointsEarned,
        })
        .eq("user_id", user.id);

      if (metricsError) throw metricsError;

      toast.success(`Successfully uploaded ${images.length} items! Earned ${totalPointsEarned} points!`);
      navigate("/partners");
    } catch (error) {
      console.error("Error saving items:", error);
      toast.error("Failed to save items");
    } finally {
      setUploading(false);
    }
  };

  const totalValue = images.filter(img => img.classification).length * 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12 max-w-6xl">
        <div className="mb-6 md:mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2 md:mb-3">
            Donate Multiple Items
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Upload photos of items you want to donate. Each item earns you 10 points!
          </p>
        </div>

        {/* Upload Card */}
        <Card className="mb-6 md:mb-8 border-2 border-dashed border-primary/30 hover:border-primary transition-colors duration-300 animate-fade-in">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl font-display flex items-center gap-2">
              <Camera className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              Upload Photos
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Select multiple images at once for faster processing
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <label htmlFor="multi-file-upload" className="block">
              <div className="relative group cursor-pointer">
                <Input
                  id="multi-file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="p-8 md:p-12 border-2 border-dashed border-primary/30 rounded-xl hover:border-primary transition-all duration-300 bg-gradient-to-br from-card to-primary/5 group-hover:shadow-lg">
                  <div className="flex flex-col items-center gap-3 md:gap-4">
                    <div className="p-3 md:p-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-base md:text-lg font-display font-semibold text-foreground mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        PNG, JPG, WEBP up to 10MB each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </label>
          </CardContent>
        </Card>

        {/* Points Summary */}
        {images.length > 0 && (
          <Card className="mb-6 md:mb-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 animate-fade-in">
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div className="text-center md:text-left">
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Items</p>
                  <p className="text-2xl md:text-3xl font-display font-bold text-primary">
                    {images.length}
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Points to Earn</p>
                  <p className="text-2xl md:text-3xl font-display font-bold text-accent">
                    {totalValue} pts
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Equivalent Value</p>
                  <p className="text-2xl md:text-3xl font-display font-bold text-primary">
                    {(totalValue / 100).toFixed(2)} QAR
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="space-y-4 md:space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {images.map((imageData, index) => (
                <Card 
                  key={imageData.id} 
                  className="group relative overflow-hidden hover:shadow-elegant transition-all duration-300"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="aspect-square relative">
                    <img
                      src={imageData.preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    
                    {imageData.classifying && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center text-white space-y-2">
                          <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin mx-auto" />
                          <p className="text-xs md:text-sm font-medium">Analyzing...</p>
                        </div>
                      </div>
                    )}

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => removeImage(imageData.id)}
                      className="absolute top-2 right-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 md:h-10 md:w-10"
                    >
                      <X className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  </div>

                  <CardContent className="p-3 md:p-4 space-y-1.5 md:space-y-2">
                    {imageData.classification && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-xs md:text-sm font-medium text-muted-foreground">Category</span>
                          <span className="text-sm md:text-base font-display font-semibold text-foreground">
                            {imageData.classification.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs md:text-sm font-medium text-muted-foreground">Confidence</span>
                          <span className="text-xs md:text-sm text-accent font-semibold">
                            {(imageData.classification.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pt-1 md:pt-2">
                          <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500" />
                          <span className="text-xs md:text-sm text-green-600 dark:text-green-400 font-medium">
                            {imageData.classification.isReusable ? "Reusable" : "Recyclable"}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-end pt-2 md:pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setImages([])}
                disabled={uploading}
                className="font-display w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
              <Button
                size="lg"
                onClick={handleSaveAll}
                disabled={uploading || images.some(img => img.classifying)}
                className="font-display font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-glow px-6 md:px-8 w-full sm:w-auto"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Find Partners
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {images.length === 0 && (
          <Card className="p-8 md:p-12 text-center animate-fade-in">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <Camera className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <CardTitle className="text-xl md:text-2xl font-display mb-2 md:mb-3">No items uploaded yet</CardTitle>
            <CardDescription className="text-base md:text-lg">
              Start by uploading photos of items you want to donate
            </CardDescription>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MultiUpload;
