const express = require('express');
const axios = require('axios');
// const {OpenAI} = require('openai');
const router = express.Router();
require('dotenv').config();

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B';

const API_KEY = process.env.HUGGING_FACE_API_KEY;

if (!API_KEY) {
    console.error("❌ Hugging Face API Key is missing! Set HUGGING_FACE_API_KEY in .env");
    process.exit(1); // Stop the server if API key is missing
}

router.post('/chat', async (req, res) => {
    const {message} = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }
    try {
        const response = await axios.post(
            HUGGING_FACE_API_URL,
            {
                inputs: message,
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        );
        const aiReply = response.data[0]?.generated_text?.replace(message, '').trim() || 'Sorry, I did not understand that.';
        res.json({reply: aiReply});

    } catch (error) {
        console.error("Hugging Face API Error:", error.response?.data || error.message);
        res.status(500).send('Error communicating with the AI.');
    }
});

module.exports = router;