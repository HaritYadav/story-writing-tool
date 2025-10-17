import { sendChat } from "../services/api.js";

const initialMessage = [
  {
    id: 0,
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
    nextId: 1,
  }),
  getters: {
    messages: (s) => s.messages,
    loading: (s) => s.loading,
    error: (s) => s.error,
    lastMessageId: (s) => (
      s.messages, length ? s.messages[s.messages.length - 1].id : 0
    ),
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
    INCREMENT_MESSAGE_ID(state) {
      state.nextId += 1;
    },
  },
  actions: {
    async sendMessages({ state, commit }, userText) {
      if (!userText || state.loading) return;
      commit("CLEAR_ERROR");
      commit("PUSH_MESSAGE", {
        id: state.nextId,
        role: "user",
        content: userText,
      });
      commit("INCREMENT_MESSAGE_ID");
      commit("SET_LOADING", true);
      try {
        const { text } = await sendChat(state.messages);
        commit("PUSH_MESSAGE", {
          id: state.nextId + 1,
          role: "model",
          content: text || "(no response from model)",
        });
        commit("INCREMENT_MESSAGE_ID");
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
