import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ClassificationResult {
  category: string;
  confidence: number;
  reasoning?: string;
}

export const useImageClassifier = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classifyImage = async (imageUrl: string): Promise<ClassificationResult | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke('classify-image', {
        body: { imageBase64: imageUrl }
      });

      if (functionError) {
        console.error('Function invocation error:', functionError);
        throw new Error(functionError.message || 'Failed to classify image');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return {
        category: data.category,
        confidence: data.confidence,
        reasoning: data.reasoning
      };
      
    } catch (err) {
      console.error('Classification error:', err);
      setError(err instanceof Error ? err.message : 'Failed to classify image');
      return null;
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
