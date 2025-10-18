export default {
  namespaced: true,
  state: () => ({
    text: "# Story Draft\n\n",
    lastSeedFromMessageId: 0,
  }),
  getters: {
    text: (s) => s.text,
    lastSeedFromMessageId: (s) => s.lastSeedFromMessageId,
  },
  mutations: {
    SET_TEXT(state, value) {
      state.text = value;
    },
    SET_LAST_SEED_MESSAGE_ID(state, value) {
      state.lastSeedFromMessageId = value;
    },
  },
  actions: {
    seedFromChat({ rootState, state, commit }) {
      const latestId = rootState.chat.messages.length
        ? rootState.chat.messages[rootState.chat.messages.length - 1].id
        : 0;

      const parts = ["# Story Draft\n\n"];
      rootState.chat.messages.forEach((m) => {
        if ((m.role === "model") & (m.id > state.lastSeedFromMessageId))
          parts.push("\n## New Chapter\n" + m.content + "\n");
      });

      commit("SET_TEXT", parts.join("\n"));
      commit("SET_LAST_SEED_MESSAGE_ID", latestId);
    },
    updateText({ commit }, newText) {
      commit("SET_TEXT", newText);
    },
  },
};
