import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse large base64 image payloads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Server-side Gemini initialization
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Structured JSON schema for plant leaf disease analysis
const plantDiagnosisSchema = {
  type: Type.OBJECT,
  properties: {
    plantIdentification: {
      type: Type.OBJECT,
      properties: {
        commonName: { type: Type.STRING, description: 'Common name of the plant (e.g., Garden Tomato, Fiddle Leaf Fig)' },
        scientificName: { type: Type.STRING, description: 'Botanical binomial name' },
        plantFamily: { type: Type.STRING, description: 'Taxonomic family name' },
        confidenceScore: { type: Type.NUMBER, description: 'Identification confidence from 0 to 100' },
        isPlantLeaf: { type: Type.BOOLEAN, description: 'Whether the image contains an identifiable plant or leaf' },
      },
      required: ['commonName', 'scientificName', 'plantFamily', 'confidenceScore', 'isPlantLeaf'],
    },
    healthStatus: {
      type: Type.STRING,
      description: 'One of: Healthy, Early Symptoms, Moderate Infection, Severe Infection, Nutrient Deficiency, Abiotic Stress',
    },
    healthScore: {
      type: Type.NUMBER,
      description: 'Numerical leaf health rating from 0 (dead/critical) to 100 (pristine health)',
    },
    diseaseDiagnosis: {
      type: Type.OBJECT,
      properties: {
        diseaseName: { type: Type.STRING, description: 'Primary disease or condition name, e.g. Early Blight (Alternaria solani) or Healthy Foliage' },
        pathogenType: { type: Type.STRING, description: 'One of: Fungal, Bacterial, Viral, Pest/Insect, Nutritional/Abiotic, None - Healthy' },
        severityLevel: { type: Type.STRING, description: 'One of: None, Low, Medium, High, Critical' },
        summary: { type: Type.STRING, description: 'Clinical 1-2 sentence pathology assessment of the leaf condition' },
        contagious: { type: Type.BOOLEAN, description: 'True if airborne/splash contagious to other plants nearby' },
      },
      required: ['diseaseName', 'pathogenType', 'severityLevel', 'summary', 'contagious'],
    },
    symptoms: {
      type: Type.ARRAY,
      description: 'Specific visible symptoms detected on the leaf',
      items: {
        type: Type.OBJECT,
        properties: {
          symptom: { type: Type.STRING, description: 'Short symptom title' },
          location: { type: Type.STRING, description: 'Where on the leaf (e.g. margin, petiole, interveinal area)' },
          appearance: { type: Type.STRING, description: 'Visual appearance description' },
        },
        required: ['symptom', 'location', 'appearance'],
      },
    },
    rootCauses: {
      type: Type.ARRAY,
      description: 'Primary environmental, cultural, or biological triggers of this condition',
      items: { type: Type.STRING },
    },
    immediateActions: {
      type: Type.ARRAY,
      description: 'Urgent containment and first-aid steps to execute today',
      items: { type: Type.STRING },
    },
    treatmentPlan: {
      type: Type.ARRAY,
      description: '14-day step-by-step recovery and rehabilitation protocol',
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING, description: 'e.g. Day 1, Day 3-5, Day 7, Day 14' },
          title: { type: Type.STRING, description: 'Action step headline' },
          instructions: { type: Type.STRING, description: 'Detailed execution instructions' },
          type: { type: Type.STRING, description: 'One of: Organic Remedy, Pruning, Environment, Fungicide/Chemical, Monitoring' },
        },
        required: ['day', 'title', 'instructions', 'type'],
      },
    },
    careGuide: {
      type: Type.OBJECT,
      properties: {
        watering: {
          type: Type.OBJECT,
          properties: {
            frequency: { type: Type.STRING },
            technique: { type: Type.STRING },
            moistureLevel: { type: Type.STRING },
          },
          required: ['frequency', 'technique', 'moistureLevel'],
        },
        light: {
          type: Type.OBJECT,
          properties: {
            ideal: { type: Type.STRING },
            luxLevel: { type: Type.STRING },
            warning: { type: Type.STRING },
          },
          required: ['ideal', 'luxLevel', 'warning'],
        },
        soilAndNutrients: {
          type: Type.OBJECT,
          properties: {
            soilType: { type: Type.STRING },
            fertilizer: { type: Type.STRING },
            pHRange: { type: Type.STRING },
          },
          required: ['soilType', 'fertilizer', 'pHRange'],
        },
        humidityAndAirflow: {
          type: Type.OBJECT,
          properties: {
            targetHumidity: { type: Type.STRING },
            ventilationTip: { type: Type.STRING },
          },
          required: ['targetHumidity', 'ventilationTip'],
        },
      },
      required: ['watering', 'light', 'soilAndNutrients', 'humidityAndAirflow'],
    },
    remedies: {
      type: Type.ARRAY,
      description: 'Specific organic and gentle treatment recipes or bio-controls',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          recipeOrDosage: { type: Type.STRING },
          organic: { type: Type.BOOLEAN },
          frequency: { type: Type.STRING },
        },
        required: ['name', 'recipeOrDosage', 'organic', 'frequency'],
      },
    },
    preventionTips: {
      type: Type.ARRAY,
      description: 'Long-term cultural practices to permanently prevent recurrence',
      items: { type: Type.STRING },
    },
  },
  required: [
    'plantIdentification',
    'healthStatus',
    'healthScore',
    'diseaseDiagnosis',
    'symptoms',
    'rootCauses',
    'immediateActions',
    'treatmentPlan',
    'careGuide',
    'remedies',
    'preventionTips',
  ],
};

// Helper with retry for transient 503 / 429 upstream errors
async function callGeminiWithRetry(fn: () => Promise<any>, maxRetries = 2, delayMs = 1000): Promise<any> {
  let lastError: any;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const isTransient =
        err?.status === 503 ||
        err?.message?.includes('503') ||
        err?.message?.includes('high demand') ||
        err?.status === 429;
      if (isTransient && attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Fallback care advice generator for when upstream model is unavailable
function generateFallbackCareAdvice(question: string, context?: any) {
  const q = question.toLowerCase();
  const plantName = context?.plantName || 'your plant';
  const disease = context?.diseaseName || 'foliar stress';

  if (q.includes('cut') || q.includes('prune') || q.includes('trim') || q.includes('remove')) {
    return {
      answer: `When treating ${disease} on ${plantName}, pruning severely diseased leaves (over 50% infected surface) is recommended to prevent spores from transferring to adjacent healthy foliage. Always use sterilized pruners disinfected with 70% isopropyl alcohol to avoid cross-contaminating other branches.`,
      actionableTips: [
        'Cut at the petiole base without nicking the main stem.',
        'Wipe shears with an alcohol wipe between cuts.',
        'Bag and throw away removed leaves in the trash—never compost diseased foliage.',
      ],
    };
  }

  if (q.includes('neem') || q.includes('spray') || q.includes('ratio') || q.includes('oil')) {
    return {
      answer: `For effective organic treatment of ${disease}, mix 1 to 1.5 teaspoons of pure cold-pressed neem oil with 1/2 teaspoon of mild unscented Castile soap per 1 quart of lukewarm water. The soap acts as an essential emulsifier so the oil blends uniformly. Shake vigorously before and during application.`,
      actionableTips: [
        'Spray during late afternoon or twilight to prevent sun-induced leaf scorch.',
        'Thoroughly coat both the tops and undersides of leaves.',
        'Reapply every 7 to 10 days until new foliage emerges symptom-free.',
      ],
    };
  }

  if (q.includes('water') || q.includes('moisture') || q.includes('dry')) {
    return {
      answer: `Proper moisture management is critical for ${plantName} while recovering from ${disease}. Fungal and bacterial pathogens thrive on wet leaf surfaces, so irrigation should always be applied directly to the root zone at soil level rather than via overhead spraying.`,
      actionableTips: [
        'Check the top 1.5 to 2 inches of soil with your finger before watering.',
        'Ensure the pot drains freely and discard stagnant runoff from the saucer.',
        'Water early in the morning so ambient daylight dries any accidental leaf droplets.',
      ],
    };
  }

  return {
    answer: `To help ${plantName} recover from ${disease}, maintain consistent environmental stability. Isolate the specimen from nearby plants, provide bright indirect sunlight with gentle room ventilation, and avoid heavy nitrogen fertilizers while the plant is under disease stress.`,
    actionableTips: [
      'Separate by at least 1 meter from vulnerable neighboring plants.',
      'Maintain stable humidity and gentle air circulation.',
      'Monitor new shoots weekly to track recovery progress.',
    ],
  };
}

// POST /api/plant/scan
app.post('/api/plant/scan', async (req: Request, res: Response) => {
  try {
    const { image, mimeType = 'image/jpeg', plantName } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Clean base64 data URL prefix if present
    const base64Data = image.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const systemInstruction = `You are a certified master plant pathologist, botanist, and agricultural plant healthcare diagnostic expert.
You inspect photos of plant leaves, identify the plant species, diagnose any fungal, bacterial, viral, pest, or physiological disorders with scientific rigor, and provide precise, actionable, organic-friendly treatment and plant care guidelines.
Be specific about pathogen names (e.g. Alternaria solani, Erysiphe cichoracearum, Phragmidium mucronatum, Tetranychus urticae, Xanthomonas campestris) and exact practical dosage ratios for home and garden remedies.`;

    const promptText = `Conduct a comprehensive diagnostic examination of this plant leaf image.
Identify:
1. Plant species (common and scientific name) and taxonomic family.
2. If this is not a plant or leaf, set isPlantLeaf to false and report appropriately.
3. Health status: Is it healthy, or does it display symptoms of fungal, bacterial, viral, pest, or abiotic stress?
4. Pinpoint exact visual symptoms on the leaf (spots, concentric rings, chlorosis, necrosis, powdery spores, stippling, curling).
5. Diagnose primary disease or disorder, pathogen class, and severity.
6. Provide an immediate first-aid action checklist, 14-day recovery care plan, specific remedies with dosage, and environmental care parameters (light, water, soil pH, humidity).
${plantName ? `User notes that this plant may be: ${plantName}. Consider this context.` : ''}`;

    const response = await callGeminiWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: base64Data,
                },
              },
              {
                text: promptText,
              },
            ],
          },
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: plantDiagnosisSchema,
        },
      })
    );

    const responseText = response.text || '';
    const parsedData = JSON.parse(responseText);

    const diagnosisResult = {
      id: `diag-${Date.now()}`,
      timestamp: new Date().toISOString(),
      imageUrl: image.startsWith('data:') ? image : `data:${mimeType};base64,${base64Data}`,
      ...parsedData,
    };

    return res.json(diagnosisResult);
  } catch (error: any) {
    console.error('Plant scan diagnosis failed:', error);
    return res.status(500).json({
      error: 'Failed to complete plant diagnosis. Please verify image clarity and try again.',
      details: error?.message || String(error),
    });
  }
});

// POST /api/plant/ask-care
app.post('/api/plant/ask-care', async (req: Request, res: Response) => {
  try {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const contextText = context
      ? `Plant: ${context.plantName || 'Unknown'}, Diagnosed Issue: ${context.diseaseName || 'None'}, Health Status: ${context.healthStatus || 'General Inquiry'}.`
      : 'General Plant Care Inquiry';

    const prompt = `Context: ${contextText}
User Question: "${question}"

Respond as a warm, authoritative botanical doctor and garden clinician.
Give:
1. Clear, direct advice answering their specific question (2-3 concise paragraphs).
2. Exactly 3 key actionable bullet points for quick execution.
Keep the tone scientific yet approachable and practical for indoor and outdoor gardeners.`;

    try {
      const response = await callGeminiWithRetry(() =>
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                answer: { type: Type.STRING, description: 'Detailed clinical explanation and guidance' },
                actionableTips: {
                  type: Type.ARRAY,
                  description: '3 concrete immediate action steps',
                  items: { type: Type.STRING },
                },
              },
              required: ['answer', 'actionableTips'],
            },
          },
        })
      );

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (geminiErr: any) {
      console.warn('Gemini temporary error in ask-care, serving intelligent fallback advice:', geminiErr?.message);
      const fallbackData = generateFallbackCareAdvice(question, context);
      return res.json(fallbackData);
    }
  } catch (error: any) {
    console.error('Ask care assistant error:', error);
    return res.status(500).json({
      error: 'Care assistant could not process your query right now.',
      details: error?.message || String(error),
    });
  }
});

// Vite middleware / static serving setup
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`PhytoScan server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
