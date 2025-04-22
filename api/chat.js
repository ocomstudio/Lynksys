const axios = require('axios');
require('dotenv').config();

module.exports = async (req, res) => {
  // Headers CORS pour accepter toutes origines
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Réponse immédiate pour les prévols CORS (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { text, image_url } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const systemPrompt = process.env.SYSTEM_PROMPT || "Tu es un assistant utile et concis.";

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
    res.status(200).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.response?.data || err.message,
    });
  }
};
