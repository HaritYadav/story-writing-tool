import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE || "http://localhost:8787",
  timeout: 30000,
});

export async function sendChat(messages) {
  const { data } = await api.post("/api/chat", { messages });
  return data;
}

export async function refreshCharactersAPI({ currentCharacters, newMessages }) {
  const { data } = await api.post("/api/analyze/characters", {
    currentCharacters: currentCharacters,
    newMessages: newMessages,
  });
  return data; // {updatedCharacterSet, upToMessageId}
}

export async function refreshTimelineAPI({ currentTimeline, newMessages }) {
  const { data } = await api.post("/api/analyze/timeline", {
    currentTimeline: currentTimeline,
    newMessages: newMessages,
  });
  return data; // {updatedTimeline, upToMessgeId}
}
