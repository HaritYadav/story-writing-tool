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

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [...history.map((h) => h.parts[0].text), userPrompt],
      config: {
        systemInstruction:
          "You are a story generation mode. If the Query is not related to story writing specifically, reply that this is not your assigned task.",
      },
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Error handling /api/chat:", error);
    res.status(500).json({ error: "LLM Call failed" });
  }
});

app.post("/api/analyze/characters", async (req, res) => {
  try {
    const { currentCharacters = [], newMessages = [] } = req.body || {};

    const systemInstructions = `Extract or update a compact roster of characters from provided conversation chunks.
    Return STRICT JSON as in below schema,
  {
    "characters": [
      {"name": "string", "aliases": ["string"], "traits": ["string"], "role": "protagonist|antagonist|supporting|background_npc|unknown", "notes":"string"}
    ]
  }`;
    const textBlock = newMessages
      .map((m) => `[${m.role}] ${m.content}`)
      .join("\n");
    const prompt = `${systemInstructions}\n\nExisting Characters: ${JSON.stringify(
      currentCharacters
    )}\n\nConversation Chunks:\n${textBlock}\n\nReturn updated character roster JSON only.`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "Your task is to look at chat histroy, current messages and current character roster and then update the character roster accordingly. Your resppnse should be onle and exactly a json. Do not add anything except the JSON response.",
      },
    });

    let parsed;
    try {
      let responseText = response.text.replace(/```json|```/g, "");
      // console.log(responseText);
      parsed = JSON.parse(responseText);
    } catch (e) {
      throw new Error(
        "Failed to parse LLM response as JSON. Returned response is: \n\n:" +
          response.text
      );
    }

    const upToMessageId = newMessages.length
      ? newMessages[newMessages.length - 1].id
      : 0;

    //Add any characters already present in currentCharacters but missing in parsed.characters
    if (parsed.characters) {
      //check if parsed.characters has all characters from currentCharacters
      currentCharacters.forEach((currChar) => {
        const exists = parsed.characters.some(
          (parsedChar) => parsedChar.name === currChar.name
        );
        if (!exists) {
          parsed.characters.push(currChar);
        }
      });
    }

    return res.json({
      characters: parsed.characters ?? currentCharacters,
      upToMessageId,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Character analysis failed, " + error.message.text });
  }
});

app.post("/api/analyze/timeline", async (req, res) => {
  try {
    const { currentTimeline = [], newMessages = [] } = req.body || {};

    const systemInstructions = `Extract or update a story timeline from provided conversation chunks.
    Group by chapter if mentioned. If chapter not explicitly mentioned, infer chapter numbers in order.
    Keep it concise and explicit.
    Return STRICT JSON as in below schema,
  {
    "timeline": [
      {"chapter": number, "events": [{
      "id":"string", "when": "string", "who": ["string"], "what": "string","where": "string", "notes": "string"}]
    ]
  }`;
    const textBlock = newMessages
      .map((m) => `[${m.role}] ${m.content}`)
      .join("\n");
    const prompt = `${systemInstructions}\n\nExisting Timeline: ${JSON.stringify(
      currentTimeline
    )}\n\nConversation Chunks:\n${textBlock}\n\nReturn updated timeline JSON only.`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "Your task is to look at chat histroy, current messages and current character roster and then update the character roster accordingly. Your resppnse should be onle and exactly a json. Do not add anything except the JSON response.",
      },
    });

    let parsed;
    try {
      let responseText = response.text.replace(/```json|```/g, "");
      // console.log(responseText);
      parsed = JSON.parse(responseText);
    } catch (e) {
      throw new Error(
        "Failed to parse LLM response as JSON. Returned response is: \n\n:" +
          response.text
      );
    }

    const upToMessageId = newMessages.length
      ? newMessages[newMessages.length - 1].id
      : 0;

    //Add any timeline events already present in currentTimeline but missing in parsed.timeline
    if (parsed.timeline) {
      //check if parsed.timeline has all events from currentTimeline
      currentTimeline.forEach((currEntry) => {
        let parsedEntry = parsed.timeline.find(
          (pe) => pe.chapter === currEntry.chapter
        );
        if (parsedEntry) {
          //check for events
          currEntry.events.forEach((currEvent) => {
            const exists = parsedEntry.events.some(
              (parsedEvent) => parsedEvent.id === currEvent.id
            );
            if (!exists) {
              parsedEntry.events.push(currEvent);
            }
          });
        } else {
          //add entire entry
          parsed.timeline.push(currEntry);
        }
      });
    }

    return res.json({
      characters: parsed.timeline ?? currentTimeline,
      upToMessageId,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Timeline analysis failed, " + error.message.text });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(
    `Using Google API Key: ${process.env.GOOGLE_API_KEY ? "Yes" : "No"}`
  );
  console.log(`Server listening on port ${PORT}`);
});
