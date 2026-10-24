import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini AI instance
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// TTS Endpoint using gemini-3.8-flash-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text, speaker = 'Boss', style = 'Intense and energetic gangster boss in Cotonou' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text prompt is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        fallback: true,
        message: 'No GEMINI_API_KEY set, use fallback synth.',
      });
    }

    const voiceOptions = ['Fenrir', 'Puck', 'Kore', 'Zephyr', 'Charon'];
    const chosenVoice = voiceOptions[Math.floor(Math.random() * voiceOptions.length)];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${speaker}: ${text}`,
              speechMetadata: {
                style: style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: chosenVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(200).json({ fallback: true, message: 'No audio returned.' });
    }

    return res.json({
      audio: `data:audio/wav;base64,${base64Audio}`,
      voice: chosenVoice,
    });
  } catch (err: any) {
    console.error('TTS error:', err?.message || err);
    return res.status(200).json({
      fallback: true,
      error: err?.message || 'Error generating TTS',
    });
  }
});

// Quick server status endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Mount Vite or static server
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`GTA Cotonou server running at http://0.0.0.0:${port}`);
  });
}

setupServer();
