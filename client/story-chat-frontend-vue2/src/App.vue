<template>
  <div id="app">
    <HeaderBar />
    <main class="wrap">
      <ChatWindow />
    </main>
  </div>
</template>

<script>
import ChatWindow from "./components/ChatWindow.vue";
import HeaderBar from "./components/HeaderBar.vue";

export default {
  name: "App",
  components: { ChatWindow, HeaderBar },
};
</script>

<style>
body,
html,
#app {
  margin: 0;
  height: 100%;
}
.wrap {
  max-width: 880px;
  margin: 0 auto;
  padding: 16px;
}
</style>
