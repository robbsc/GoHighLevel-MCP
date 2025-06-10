import { Router, Request, Response } from 'express';
import { OpenAI } from 'openai';

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

router.post('/run', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tool, input } = req.body;

    if (tool !== 'chat-completion') {
      res.status(400).json({ error: 'Unsupported tool' });
      return;
    }

    if (!input || !input.messages) {
      res.status(400).json({ error: 'Missing input messages' });
      return;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: input.messages,
    });

    res.json({ output: response.choices[0].message });
  } catch (err) {
    console.error('Error in /tools/run:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
