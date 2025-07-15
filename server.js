const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@libsql/client');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('AI Dating Backend is running!');
});

// ✅ Turso (libSQL) client setup
const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
});

// ✅ OpenAI setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Message handler
app.post('/api/message', async (req, res) => {
  const { message, mode } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: `You are a dating assistant in ${mode} mode.` },
        { role: 'user', content: message }
      ]
    });

    const reply = completion.choices[0].message.content.trim();

    // Optional: save chat to database
    await db.execute({
      sql: 'INSERT INTO messages (user_input, mode, ai_reply) VALUES (?, ?, ?)',
      args: [message, mode, reply]
    });

    res.json({ reply });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to generate message' });
  }
});

// ✅ Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
