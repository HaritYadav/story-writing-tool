import { refreshTimelineAPI } from "../services/api";

export default {
  namespaced: true,
  state: () => ({
    lastMessageIdAnalyzed: 0,
    timeline: [],
    loading: false,
    error: null,
  }),
  getters: {
    timeline: (s) => s.timeline,
    lastMessageIdAnalyzed: (s) => s.lastMessageIdAnalyzed,
    loading: (s) => s.loading,
    error: (s) => s.error,
  },
  mutations: {
    SET_LOADING(state, value) {
      state.loading = value;
    },
    SET_ERROR(state, value) {
      state.error = value;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    },
    SET_LAST_ANALYZED_MESSAGE_ID(state, value) {
      state.lastMessageIdAnalyzed = value;
    },
    SET_TIMELINE(state, value) {
      state.timeline = value;
    },
  },
  actions: {
    async refereshTImeline({ rootState, state, commit }) {
      const newMessages = rootState.chat.messages.filter(
        (m) => m.id > state.lastMessageIdAnalyzed
      );
      if (newMessages.length === 0) return;

      commit("SET_LOADING", true);
      commit("CLEAR_ERROR");

      try {
        const result = await refreshTimelineAPI({
          currentTimeline: state.timeline,
          newContext: newMessages,
        });
        commit("SET_CHARACTERS", result.timeline || state.timeline);
        if (typeof result.upToMessageId === "number") {
          commit("SET_LAST_ANALYZED_MESSAGE_ID", result.upToMessageId);
        } else {
          commit("SET_LAST_ANALYZED_MESSAGE_ID", state.lastMessageIdAnalyzed);
        }
      } catch (error) {
        commit("SET_ERROR", error.message || "Error refreshing timeline");
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};
