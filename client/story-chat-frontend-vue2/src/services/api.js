import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE || "http://localhost:8787",
  timeout: 30000,
});

export async function sendChat(messages) {
  const { data } = await api.post("/api/chat", { messages });
  return data;
}

export async function refreshCharactersAPI(currentCharacterSet, newContext) {
  const { data } = await api.post("/api/analyze/characters", {
    ...currentCharacterSet,
    ...newContext,
  });
  return data; // {updatedCharacterSet, upToMessageId}
}

export async function refreshTimelineAPI(currentTimeline, newContext) {
  const { data } = await api.post("/api/analyze/timeline", {
    ...currentTimeline,
    ...newContext,
  });
  return data; // {updatedTimeline, upToMessgeId}
}
