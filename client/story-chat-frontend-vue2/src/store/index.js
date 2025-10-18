import Vue from "vue";
import Vuex from "vuex";
import chat from "./chat";
import timeline from "./timeline";
import characters from "./characters";
import draft from "./draft";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { chat, timeline, characters, draft },
});
