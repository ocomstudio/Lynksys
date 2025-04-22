const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Prompt système depuis .env
const systemPrompt = process.env.SYSTEM_PROMPT || "Tu es un assistant utile et concis.";

// Route POST /chat
app.post('/chat', async (req, res) => {
  const { text, image_url } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  try {
    const messages = [
      {
        role: 'system',
        content: [
          { type: 'text', text: systemPrompt },
        ],
      },
      {
        role: 'user',
        content: [
          { type: 'text', text },
        ],
      },
    ];
    if (image_url) {
      messages[1].content.push({
        type: 'image_url',
        image_url: { url: image_url },
      });
    }
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-4-maverick:free',
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.SITE_URL || '',
          'X-Title': process.env.SITE_NAME || '',
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
