const express = require('express');
const cookieParser = require('cookie-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
    res.send('Backend is working!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
