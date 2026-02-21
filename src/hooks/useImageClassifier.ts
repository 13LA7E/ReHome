import { useState, useRef, useCallback } from 'react';

interface ClassificationResult {
  category: string;
  confidence: number;
  isReusable: boolean;
  reasoning?: string;
}

// Dynamically imported so TF.js (~3 MB) is never bundled into the initial page load.
// It downloads once on first classification, then the browser caches it forever.
type MobileNetModule = typeof import('@tensorflow-models/mobilenet');
type MobileNetModel = Awaited<ReturnType<MobileNetModule['load']>>;

// ---------------------------------------------------------------
// Keyword map: ImageNet class names (lowercase) → our 5 DB categories
// DB constraint: 'books' | 'clothes' | 'electronics' | 'ewaste' | 'furniture'
// ---------------------------------------------------------------
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  clothes: [
    'jersey', 't-shirt', 'tee shirt', 'cardigan', 'sweatshirt', 'suit',
    'bow tie', 'brassiere', 'gown', 'gown', 'lab coat', 'cloak',
    'trench coat', 'kimono', 'sarong', 'bikini', 'swimming trunk',
    'maillot', 'miniskirt', 'jean', 'mitten', 'sock', 'stocking',
    'apron', 'academic gown', 'abaya', 'overskirt', 'hoopskirt',
    'fur coat', 'raincoat', 'overcoat', 'wool', 'lace', 'shirt',
    'blouse', 'dress', 'skirt', 'pants', 'jacket', 'coat', 'sweater',
    'hoodie', 'uniform', 'tie', 'scarf', 'hat', 'cap', 'glove',
    'shoe', 'boot', 'sandal', 'sneaker', 'handbag', 'backpack',
    'sunglasses', 'purse', 'wallet', 'bib', 'vestment', 'stole',
    'diaper', 'sunglass', 'panty', 'underwear', 'brief',
  ],
  books: [
    'book jacket', 'comic book', 'menu', 'newspaper', 'crossword',
    'envelope', 'library', 'magazine', 'atlas', 'journal',
    'notebook', 'binder', 'puzzle',
  ],
  electronics: [
    'laptop', 'computer', 'keyboard', 'mouse', 'television', 'remote',
    'cellular', 'phone', 'camera', 'speaker', 'loudspeaker', 'headphone',
    'microphone', 'printer', 'modem', 'router', 'radio', 'cd player',
    'cassette player', 'telephone', 'calculator', 'ipod', 'tablet',
    'joystick', 'projector', 'amplifier', 'screen', 'display',
    'drone', 'smartwatch', 'wristwatch', 'earphone', 'console',
    'monitor', 'hard drive', 'usb', 'charger', 'adapter',
  ],
  ewaste: [
    'crt', 'hard disc', 'tape player', 'vcr', 'dial telephone',
    'pay-phone', 'typewriter', 'pager', 'fax', 'circuit', 'floppy',
    'diskette', 'film camera', 'cassette deck',
  ],
  furniture: [
    'chair', 'couch', 'sofa', 'table', 'desk', 'bookcase', 'wardrobe',
    'chest', 'cabinet', 'bench', 'stool', 'ottoman', 'shelf', 'rack',
    'drawer', 'bed', 'mattress', 'dresser', 'armchair', 'recliner',
    'throne', 'toilet', 'bathtub', 'sink', 'nightstand', 'lamp',
    'dining table', 'park bench', 'rocking chair', 'barber chair',
    'studio couch', 'china cabinet', 'file cabinet', 'bookshelf',
    'cradle',
  ],
};

// Score top predictions against keyword map to pick the best DB category
function mapToCategory(predictions: Array<{ className: string; probability: number }>): {
  category: string;
  confidence: number;
  reasoning: string;
} {
  const scores: Record<string, number> = {
    books: 0, clothes: 0, electronics: 0, ewaste: 0, furniture: 0,
  };

  for (const pred of predictions) {
    const label = pred.className.toLowerCase();
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      for (const kw of keywords) {
        if (label.includes(kw)) {
          scores[category] += pred.probability;
        }
      }
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topCategory, topScore] = sorted[0];
  const topPred = predictions[0];

  if (topScore === 0) {
    // No keyword matched — use the raw MobileNet label to give useful feedback
    return {
      category: 'clothes',
      confidence: 0.35,
      reasoning: `Could not confidently categorize "${topPred.className}" — defaulted to clothes. Please adjust if needed.`,
    };
  }

  // Scale confidence: clamp to [0.50, 0.99]
  const confidence = Math.min(Math.max(topScore * 1.5, 0.5), 0.99);

  return {
    category: topCategory,
    confidence,
    reasoning: `Identified as "${topPred.className}" (${(topPred.probability * 100).toFixed(0)}% match)`,
  };
}

export const useImageClassifier = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Persist the model across calls — loads once, cached by the browser
  const modelRef = useRef<MobileNetModel | null>(null);
  const modelLoadingRef = useRef<Promise<MobileNetModel> | null>(null);

  const loadModel = useCallback(async (): Promise<MobileNetModel> => {
    if (modelRef.current) return modelRef.current;
    // Guard against multiple concurrent load calls
    if (!modelLoadingRef.current) {
      modelLoadingRef.current = (async () => {
        // Dynamic imports — TF.js only downloads when first classification runs
        const [tf, mobilenet] = await Promise.all([
          import('@tensorflow/tfjs'),
          import('@tensorflow-models/mobilenet'),
        ]);
        await tf.ready();
        const model = await mobilenet.load({ version: 2, alpha: 1.0 });
        modelRef.current = model;
        return model;
      })();
    }
    return modelLoadingRef.current;
  }, []);

  const classifyImage = useCallback(async (imageUrl: string): Promise<ClassificationResult | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const model = await loadModel();

      // Build an HTMLImageElement from the data URL / blob URL
      const imgEl = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Get top-5 ImageNet predictions (all run on-device via WebGL/WASM)
      const predictions = await model.classify(imgEl, 5);
      console.log('MobileNet predictions:', predictions);

      const { category, confidence, reasoning } = mapToCategory(predictions);
      const isReusable = category !== 'ewaste';

      return { category, confidence, isReusable, reasoning };

    } catch (err) {
      console.error('On-device classification error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to classify image';
      setError(msg);
      return {
        category: 'clothes',
        confidence: 0.35,
        isReusable: true,
        reasoning: 'Classification failed — please select the correct category manually.',
      };
    } finally {
      setIsLoading(false);
    }
  }, [loadModel]);

  return { isLoading, error, classifyImage };
};
