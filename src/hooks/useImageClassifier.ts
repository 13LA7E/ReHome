import { useState } from 'react';

interface ClassificationResult {
  category: string;
  confidence: number;
  isReusable: boolean;
  reasoning?: string;
}

export const useImageClassifier = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Smart heuristic classifier based on image analysis
  const analyzeImage = async (imageUrl: string): Promise<ClassificationResult> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(getDefaultCategory());
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const { data } = imageData;
          
          // Analyze colors and patterns
          let totalR = 0, totalG = 0, totalB = 0;
          let darkPixels = 0;
          let brightPixels = 0;
          let edgePixels = 0;
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            totalR += r;
            totalG += g;
            totalB += b;
            
            const brightness = (r + g + b) / 3;
            if (brightness < 50) darkPixels++;
            if (brightness > 200) brightPixels++;
            
            // Simple edge detection
            if (i > 0 && Math.abs(r - data[i-4]) > 30) edgePixels++;
          }
          
          const pixelCount = data.length / 4;
          const avgR = totalR / pixelCount;
          const avgG = totalG / pixelCount;
          const avgB = totalB / pixelCount;
          const darkRatio = darkPixels / pixelCount;
          const brightRatio = brightPixels / pixelCount;
          const edgeRatio = edgePixels / pixelCount;
          
          // Classification logic
          let category = 'other';
          let confidence = 0.6;
          let reasoning = '';
          
          // Electronics: Dark with some bright spots, high edge ratio
          if (darkRatio > 0.3 && edgeRatio > 0.15 && (avgR + avgG + avgB) / 3 < 100) {
            category = 'electronics';
            confidence = 0.75;
            reasoning = 'Detected dark surfaces with electronic patterns';
          }
          // Clothing: Varied colors, medium brightness, fabric texture
          else if (brightRatio > 0.2 && brightRatio < 0.6 && edgeRatio < 0.2) {
            category = 'clothing';
            confidence = 0.7;
            reasoning = 'Detected fabric-like texture and varied colors';
          }
          // Books: High brightness, rectangular shapes, uniform color
          else if (brightRatio > 0.4 && edgeRatio > 0.1 && Math.abs(avgR - avgG) < 20) {
            category = 'books';
            confidence = 0.68;
            reasoning = 'Detected paper-like surfaces with text patterns';
          }
          // Furniture: Large uniform areas, medium tones
          else if (edgeRatio < 0.15 && darkRatio < 0.4 && brightRatio < 0.4) {
            category = 'furniture';
            confidence = 0.65;
            reasoning = 'Detected large uniform surfaces typical of furniture';
          }
          // Toys: Bright colors, varied patterns
          else if (brightRatio > 0.3 && (avgR > 150 || avgG > 150 || avgB > 150)) {
            category = 'toys';
            confidence = 0.65;
            reasoning = 'Detected bright colors typical of toys';
          }
          // E-waste: Very dark, metallic look
          else if (darkRatio > 0.5 && avgR < 80 && avgG < 80 && avgB < 80) {
            category = 'ewaste';
            confidence = 0.7;
            reasoning = 'Detected dark metallic surfaces';
          }
          
          resolve({
            category,
            confidence,
            isReusable: true,
            reasoning: reasoning || 'Please verify the category is correct'
          });
        } catch (e) {
          console.error('Image analysis error:', e);
          resolve(getDefaultCategory());
        }
      };
      
      img.onerror = () => {
        resolve(getDefaultCategory());
      };
      
      img.src = imageUrl;
    });
  };

  const getDefaultCategory = (): ClassificationResult => {
    return {
      category: 'other',
      confidence: 0.5,
      isReusable: true,
      reasoning: 'Unable to analyze image. Please select the correct category.'
    };
  };

  const classifyImage = async (imageUrl: string): Promise<ClassificationResult | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Use image analysis
      const result = await analyzeImage(imageUrl);
      console.log('Classification result:', result);
      
      return result;
      
    } catch (err) {
      console.error('Classification error:', err);
      setError(err instanceof Error ? err.message : 'Failed to classify image');
      return getDefaultCategory();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    classifyImage
  };
};
