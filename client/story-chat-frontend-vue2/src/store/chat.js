import { sendChat } from "../services/api.js";

const initialMessage = [
  {
    role: "model",
    content: "Hi! I am your AI writing assistant. How can I help you today?",
  },
];

export default {
  namespaced: true,
  state: () => ({
    messages: [...initialMessage],
    loading: false,
    error: null,
  }),
  getters: {
    messages: (s) => s.messages,
    loading: (s) => s.loading,
    error: (s) => s.error,
  },
  mutations: {
    PUSH_MESSAGE(state, msg) {
      state.messages.push(msg);
    },
    SET_LOADING(state, loading_val) {
      state.loading = loading_val;
    },
    SET_ERROR(state, error_val) {
      state.error = error_val;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    },
    RESET_CHAT(state) {
      state.messages = [...initialMessage];
      state.error = null;
    },
  },
  actions: {
    async sendMessages({ state, commit }, userText) {
      if (!userText || state.loading) return;
      commit("CLEAR_ERROR");
      commit("PUSH_MESSAGE", { role: "user", content: userText });
      commit("SET_LOADING", true);
      try {
        const { text } = await sendChat(state.messages);
        commit("PUSH_MESSAGE", {
          role: "model",
          content: text || "(no response from model)",
        });
      } catch (e) {
        commit("SET_ERROR", "Issue Calling Model...Error: " + e.message);
        commit("PUSH_MESSAGE", {
          role: "model",
          content: "Error: " + e.message,
        });
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
