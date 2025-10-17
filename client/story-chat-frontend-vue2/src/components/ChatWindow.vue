<template>
  <div class="card">
    <MessageList ref="list" :messages="messages" :loading="loading" />
    <div class="footer">
      <ChatInput :disabled="loading" @send="handleSendMessages" />
      <TypingIndicator v-if="loading" />
    </div>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import MessageList from "./MessageList.vue";
import ChatInput from "./ChatInput.vue";
import TypingIndicator from "./TypingIndicator.vue";

export default {
  components: { MessageList, ChatInput, TypingIndicator },
  computed: {
    ...mapGetters("chat", ["messages", "loading", "error"]),
  },
  methods: {
    ...mapActions("chat", ["sendMessages"]),
    async handleSendMessages(text) {
      await this.sendMessages(text);
      this.$refs.list.scrollToBottom();
    },
  },
};
</script>

<style scoped>
.card {
  background: #fff;
  border: 1px solid #e8ebf0;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  min-height: 70vh;
}
.footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.error {
  color: #b00020;
  font-size: 12px;
  margin: 8px 4px 0;
}
</style>
