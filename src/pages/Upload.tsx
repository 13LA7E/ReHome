import { useState, useEffect } from "react";
import { Upload as UploadIcon, Camera, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useImageClassifier } from "@/hooks/useImageClassifier";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Navigation } from "@/components/Navigation";

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
    reasoning?: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (modelError) {
      toast.error("AI classification error: " + modelError);
    }
  }, [modelError]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
        const isReusable = !['ewaste'].includes(result.category);
        
        setClassification({
          category: result.category,
          confidence: result.confidence,
          isReusable,
          reasoning: result.reasoning
        });
        
        toast.success(`Classified as ${result.category} with ${(result.confidence * 100).toFixed(0)}% confidence!`);
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

      // Use secure server-side function to add item and points
      const { data, error } = await (supabase.rpc as any)('add_item_points', {
        item_category: classification.category,
        item_confidence: classification.confidence,
        item_image_url: publicUrl,
        item_is_reusable: classification.isReusable
      });

      if (error) throw error;

      if (data && data[0]?.success) {
        toast.success(`Item saved successfully! +${data[0].points_earned} points`);
        navigate('/partners', { state: { classification } });
      } else {
        throw new Error(data?.[0]?.message || "Failed to save item");
      }
      
    } catch (error) {
      console.error('Save error:', error);
      toast.error("Failed to save item");
    } finally {
      setIsSaving(false);
    }
  };

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
            Take or upload a photo, and our AI will classify it instantly
          </p>
        </div>


        {/* Upload Card */}
        <Card className="p-5 md:p-8 shadow-hover border-2 border-dashed border-border hover:border-primary transition-all duration-300 animate-slide-up">
          {!selectedImage ? (
            <div className="space-y-6 md:space-y-8">
              {/* Upload Area */}
              <div className="space-y-4">
                {/* Camera Capture Button */}
                <label className="flex flex-col items-center justify-center cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="camera-input"
                  />
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-hero flex items-center justify-center mb-4 md:mb-6 group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                    <Camera className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Take a Photo
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">Use your camera to capture the item</p>
                </label>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="text-sm text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>

                {/* Gallery Upload Button */}
                <label className="flex flex-col items-center justify-center cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="gallery-input"
                  />
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-secondary flex items-center justify-center mb-3 md:mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                    <UploadIcon className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    Upload from Gallery
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">Choose an existing photo</p>
                </label>
              </div>

              {/* Supported Categories */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 pt-6 md:pt-8 border-t border-border">
                {["Clothes", "Books", "Furniture", "Electronics", "E-waste"].map((category) => (
                  <div key={category} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    {category}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8">
              {/* Image Preview */}
              <div className="relative rounded-2xl overflow-hidden shadow-soft">
                <img
                  src={selectedImage}
                  alt="Uploaded item"
                  className="w-full h-64 md:h-96 object-cover"
                />
                {isClassifying && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center space-y-3 md:space-y-4">
                      <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground animate-spin mx-auto" />
                      <p className="text-primary-foreground font-semibold text-base md:text-lg">
                        Analyzing your item...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Classification Result */}
              {classification && (
                <div className="space-y-4 md:space-y-6 animate-fade-in">
                  <div className="bg-gradient-impact rounded-2xl p-5 md:p-6 text-primary-foreground">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-0 mb-4">
                      <div>
                        <p className="text-xs md:text-sm opacity-90 mb-1">Classified as</p>
                        <h3 className="text-2xl md:text-3xl font-bold capitalize">{classification.category}</h3>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-xs md:text-sm opacity-90 mb-1">Confidence</p>
                        <p className="text-2xl md:text-3xl font-bold">{(classification.confidence * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm flex-wrap">
                      <div className={`px-2.5 md:px-3 py-1 rounded-full ${classification.isReusable ? 'bg-primary-foreground/20' : 'bg-destructive/20'}`}>
                        {classification.isReusable ? '✓ Reusable' : 'ⓘ Recyclable Only'}
                      </div>
                      <div className="px-2.5 md:px-3 py-1 rounded-full bg-primary-foreground/20">
                        🤖 AI-Powered Classification
                      </div>
                    </div>
                    {classification.reasoning && (
                      <p className="text-xs md:text-sm opacity-80 mt-2">{classification.reasoning}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <Button 
                      size="lg" 
                      variant="hero"
                      onClick={handleSaveAndFindPartners}
                      className="flex-1 w-full sm:w-auto"
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
                      className="w-full sm:w-auto"
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
        <div className="mt-8 md:mt-12 text-center space-y-3 md:space-y-4 text-muted-foreground">
          <p className="text-xs md:text-sm">
            🤖 Powered by ReHome AI with Google Gemini
          </p>
          <p className="text-xs md:text-sm">
            🔒 Secure and accurate image classification
          </p>
          <p className="text-xs md:text-sm">
            💡 For best results, ensure good lighting and the item is clearly visible
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Upload;
