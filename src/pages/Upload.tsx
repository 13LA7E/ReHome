import { useState } from "react";
import { Upload as UploadIcon, Camera, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Upload = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classification, setClassification] = useState<{
    category: string;
    confidence: number;
    isReusable: boolean;
  } | null>(null);
  const navigate = useNavigate();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        // Simulate AI classification - Replace with actual TensorFlow.js implementation
        simulateClassification();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateClassification = () => {
    setIsClassifying(true);
    // Placeholder for TensorFlow.js implementation
    setTimeout(() => {
      setClassification({
        category: "Clothes",
        confidence: 0.94,
        isReusable: true
      });
      setIsClassifying(false);
      toast.success("Item classified successfully!");
    }, 2000);
  };

  const handleFindPartners = () => {
    if (classification) {
      navigate('/partners', { state: { classification } });
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
                        <h3 className="text-3xl font-bold">{classification.category}</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90 mb-1">Confidence</p>
                        <p className="text-3xl font-bold">{(classification.confidence * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`px-3 py-1 rounded-full ${classification.isReusable ? 'bg-primary-foreground/20' : 'bg-destructive/20'}`}>
                        {classification.isReusable ? '✓ Reusable' : 'ⓘ Recyclable Only'}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button 
                      size="lg" 
                      variant="hero"
                      onClick={handleFindPartners}
                      className="flex-1"
                    >
                      Find Partners
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
            🔒 Your images are processed locally using AI - no data is stored on our servers
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
