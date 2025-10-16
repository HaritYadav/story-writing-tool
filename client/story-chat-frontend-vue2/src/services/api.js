import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE || "http://localhost:8787",
  timeout: 30000,
});

export async function sendChat(messages) {
  const { data } = await api.post("/api/chat", { messages });
  return data;
}
