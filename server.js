const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate message' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));