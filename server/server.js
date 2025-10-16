import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { GoogleGenAI } from "@google/genai";

dotenv.config({ path: "./.env/google.ini" });

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

function toGeminiHistory(messages) {
  return messages
    .filter((m) => m.content && m.content.trim().length > 0)
    .map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));
}

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: "messages must be an array",
      });
    }

    //split history from last user turn
    const last = messages[messages.length - 1];
    if (!last || last.role !== "user") {
      return res.status(400).json({
        error: "last message must be from user",
      });
    }

    const history = toGeminiHistory(messages.slice(0, -1));
    const userPrompt = last.content || "";

    // const chat = model.startChat({ history });
    // const result = await chat.sendMessage(userPrompt);
    // const text = result.response.text();
    //   res.json({ text });
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [...history.map((h) => h.parts[0].text), userPrompt],
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Error handling /api/chat:", error);
    res.status(500).json({ error: "LLM Call failed" });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(
    // `Using Google API Key: ${process.env.GOOGLE_API_KEY ? "Yes" : "No"}`
    process.env.GOOGLE_API_KEY
  );
  console.log(`Server listening on port ${PORT}`);
});
