import { useState, useRef, useCallback } from 'react';

export interface DetectionGroup {
  category: string;
  label: string;   // human-readable COCO class, e.g. "book", "cell phone"
  count: number;
}

export interface ClassificationResult {
  category: string;        // dominant category
  confidence: number;
  isReusable: boolean;
  reasoning?: string;
  count: number;           // total objects detected
  detections: DetectionGroup[];
}

// ---------------------------------------------------------------
// COCO-SSD object classes → our 5 DB categories
// COCO has 80 classes; we map all relevant ones here.
// ---------------------------------------------------------------
const COCO_CATEGORY_MAP: Record<string, string> = {
  // books
  book: 'books',
  // clothes / accessories
  backpack: 'clothes', umbrella: 'clothes', handbag: 'clothes',
  tie: 'clothes', suitcase: 'clothes',
  // electronics
  laptop: 'electronics', mouse: 'electronics', remote: 'electronics',
  keyboard: 'electronics', 'cell phone': 'electronics', tv: 'electronics',
  microwave: 'electronics', oven: 'electronics', toaster: 'electronics',
  refrigerator: 'electronics', clock: 'electronics', 'hair drier': 'electronics',
  scissors: 'electronics',
  // furniture
  chair: 'furniture', couch: 'furniture', bed: 'furniture',
  'dining table': 'furniture', toilet: 'furniture', sink: 'furniture',
  'potted plant': 'furniture',
  // ewaste (batteries / hazardous — COCO doesn't have these directly;
  // they fall through to MobileNet fallback below)
};

// MobileNet keyword fallback (for categories COCO can't detect, e.g. ewaste)
type MobileNetModule = typeof import('@tensorflow-models/mobilenet');
type MobileNetModel = Awaited<ReturnType<MobileNetModule['load']>>;

const MOBILENET_KEYWORDS: Record<string, string[]> = {
  ewaste: [
    'battery', 'electric battery', 'lithium', 'cell phone battery',
    'crt', 'hard disc', 'hard disk', 'tape player', 'vcr',
    'dial telephone', 'pay-phone', 'typewriter', 'pager', 'fax',
    'circuit', 'floppy', 'diskette', 'film camera', 'cassette deck',
    'solar cell', 'solar panel', 'power supply', 'transformer',
    'oscilloscope', 'voltmeter',
  ],
  books: ['book jacket', 'comic book', 'menu', 'newspaper', 'magazine', 'atlas', 'notebook', 'binder'],
  clothes: [
    'jersey', 't-shirt', 'tee shirt', 'cardigan', 'sweatshirt', 'suit', 'kimono', 'jean',
    'fur coat', 'raincoat', 'overcoat', 'shirt', 'blouse', 'dress', 'jacket', 'coat',
    'sweater', 'hoodie', 'sock', 'shoe', 'boot', 'sandal', 'sneaker',
  ],
  electronics: [
    'laptop', 'computer', 'keyboard', 'mouse', 'television', 'remote', 'cellular', 'phone',
    'camera', 'speaker', 'headphone', 'microphone', 'printer', 'radio', 'tablet',
    'projector', 'screen', 'display', 'monitor', 'smartwatch', 'console',
  ],
  furniture: [
    'chair', 'couch', 'sofa', 'table', 'desk', 'bookcase', 'wardrobe', 'cabinet',
    'bench', 'stool', 'ottoman', 'shelf', 'bed', 'mattress', 'dresser', 'armchair',
    'dining table', 'rocking chair', 'studio couch',
  ],
};

function mobilenetFallback(
  predictions: Array<{ className: string; probability: number }>,
): { category: string; confidence: number; reasoning: string } {
  const scores: Record<string, number> = { books: 0, clothes: 0, electronics: 0, ewaste: 0, furniture: 0 };
  for (const pred of predictions) {
    const label = pred.className.toLowerCase();
    for (const [cat, kws] of Object.entries(MOBILENET_KEYWORDS)) {
      for (const kw of kws) {
        if (label.includes(kw)) scores[cat] += pred.probability;
      }
    }
  }
  const [topCat, topScore] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const topPred = predictions[0];
  if (topScore === 0) {
    return { category: 'clothes', confidence: 0.35, reasoning: `Could not categorize "${topPred.className}" — defaulted to clothes.` };
  }
  return {
    category: topCat,
    confidence: Math.min(Math.max(topScore * 1.5, 0.5), 0.99),
    reasoning: `Identified as "${topPred.className}" (${(topPred.probability * 100).toFixed(0)}% match)`,
  };
}

type CocoSsdModule = typeof import('@tensorflow-models/coco-ssd');
type CocoSsdModel = Awaited<ReturnType<CocoSsdModule['load']>>;

export const useImageClassifier = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Two cached models — loads once each, persisted across calls
  const cocoRef = useRef<CocoSsdModel | null>(null);
  const cocoLoadingRef = useRef<Promise<CocoSsdModel> | null>(null);
  const mobileNetRef = useRef<MobileNetModel | null>(null);
  const mobileNetLoadingRef = useRef<Promise<MobileNetModel> | null>(null);

  const loadCoco = useCallback(async (): Promise<CocoSsdModel> => {
    if (cocoRef.current) return cocoRef.current;
    if (!cocoLoadingRef.current) {
      cocoLoadingRef.current = (async () => {
        const [tf, cocoSsd] = await Promise.all([
          import('@tensorflow/tfjs'),
          import('@tensorflow-models/coco-ssd'),
        ]);
        await tf.ready();
        const model = await cocoSsd.load();
        cocoRef.current = model;
        return model;
      })();
    }
    return cocoLoadingRef.current;
  }, []);

  const loadMobileNet = useCallback(async (): Promise<MobileNetModel> => {
    if (mobileNetRef.current) return mobileNetRef.current;
    if (!mobileNetLoadingRef.current) {
      mobileNetLoadingRef.current = (async () => {
        const [tf, mobilenet] = await Promise.all([
          import('@tensorflow/tfjs'),
          import('@tensorflow-models/mobilenet'),
        ]);
        await tf.ready();
        const model = await mobilenet.load({ version: 2, alpha: 1.0 });
        mobileNetRef.current = model;
        return model;
      })();
    }
    return mobileNetLoadingRef.current;
  }, []);

  const classifyImage = useCallback(async (imageUrl: string): Promise<ClassificationResult | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Build HTMLImageElement from data URL / blob URL
      const imgEl = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageUrl;
      });

      // ── Step 1: COCO-SSD — detects multiple objects with bounding boxes ──
      const cocoModel = await loadCoco();
      const cocoDetections = await cocoModel.detect(imgEl);
      console.log('COCO-SSD detections:', cocoDetections);

      // Filter detections with decent confidence and map to our categories
      const CONFIDENCE_THRESHOLD = 0.35;
      const mapped = cocoDetections
        .filter(d => d.score >= CONFIDENCE_THRESHOLD && COCO_CATEGORY_MAP[d.class])
        .map(d => ({ label: d.class, category: COCO_CATEGORY_MAP[d.class], score: d.score }));

      if (mapped.length > 0) {
        // Group by (category + label) and count each distinct type
        const groups = new Map<string, DetectionGroup>();
        for (const det of mapped) {
          const key = `${det.category}::${det.label}`;
          if (groups.has(key)) {
            groups.get(key)!.count += 1;
          } else {
            groups.set(key, { category: det.category, label: det.label, count: 1 });
          }
        }
        const detections = Array.from(groups.values());

        // Dominant category = the one with the most detected objects
        const categoryTotals = new Map<string, number>();
        for (const g of detections) {
          categoryTotals.set(g.category, (categoryTotals.get(g.category) ?? 0) + g.count);
        }
        const [dominantCategory] = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1])[0];
        const totalCount = detections.reduce((s, g) => s + g.count, 0);
        const topScore = cocoDetections[0]?.score ?? 0.8;
        const confidence = Math.min(Math.max(topScore, 0.5), 0.99);

        const labels = detections.map(g => `${g.count}× ${g.label}`).join(', ');
        return {
          category: dominantCategory,
          confidence,
          isReusable: dominantCategory !== 'ewaste',
          count: totalCount,
          detections,
          reasoning: `Detected: ${labels}`,
        };
      }

      // ── Step 2: MobileNet fallback — single-item classification ──
      const mnModel = await loadMobileNet();
      const predictions = await mnModel.classify(imgEl, 5);
      console.log('MobileNet fallback predictions:', predictions);

      const { category, confidence, reasoning } = mobilenetFallback(predictions);
      return {
        category,
        confidence,
        isReusable: category !== 'ewaste',
        count: 1,
        detections: [{ category, label: predictions[0].className.split(',')[0], count: 1 }],
        reasoning,
      };

    } catch (err) {
      console.error('On-device classification error:', err);
      const msg = err instanceof Error ? err.message : 'Failed to classify image';
      setError(msg);
      return {
        category: 'clothes',
        confidence: 0.35,
        isReusable: true,
        count: 1,
        detections: [{ category: 'clothes', label: 'unknown', count: 1 }],
        reasoning: 'Classification failed — please select the correct category manually.',
      };
    } finally {
      setIsLoading(false);
    }
  }, [loadCoco, loadMobileNet]);

  return { isLoading, error, classifyImage };
};
