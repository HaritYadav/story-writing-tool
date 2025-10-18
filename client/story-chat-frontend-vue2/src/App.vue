<template>
  <div id="app">
    <HeaderBar />
    <main class="grid">
      <div class="col side">
        <CharacterPanel class="block" />
        <TimelineVIew class="block" />
      </div>
      <div class="col main">
        <ChatWindow class="block tall" />
        <DraftEditor class="block" />
      </div>
    </main>
  </div>
</template>

<script>
import CharacterPanel from "./components/CharacterPanel.vue";
import ChatWindow from "./components/ChatWindow.vue";
import DraftEditor from "./components/DraftEditor.vue";
import HeaderBar from "./components/HeaderBar.vue";
import TimelineVIew from "./components/TimelineVIew.vue";

export default {
  name: "App",
  components: {
    ChatWindow,
    HeaderBar,
    CharacterPanel,
    DraftEditor,
    TimelineVIew,
  },
};
</script>

<style>
body,
html,
#app {
  margin: 0;
  height: 100%;
  background: #f6f7f9;
}
main.grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 16px;
}
.col .block {
  margin-bottom: 16px;
}
.tall {
  min-height: 50vh;
}
.side .block {
}
.main .block {
}
.wrap {
  max-width: 880px;
  margin: 0 auto;
  padding: 16px;
}
</style>
