<template>
  <div class="messages" ref="messagesListBox">
    <MessageBubble
      v-for="(message, index) in messages"
      :key="index"
      :role="message.role"
      :content="message.content"
    />
    <div v-if="loading" class="bubble model">...thinking</div>
  </div>
</template>

<script>
import MessageBubble from "./MessageBubble.vue";

export default {
  components: { MessageBubble },
  props: {
    messages: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    scrollToBottom() {
      const listBoxElement = this.$refs.messageListBox;
      if (listBoxElement) {
        listBoxElement.scrollTop = listBoxElement.scrollHeight;
      }
    },
  },
  updated() {
    this.scrollToBottom();
  },
};
</script>

<style scoped>
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 6px;
  min-height: 58vh;
}
.bubble {
  padding: 10px 12px;
  border-radius: 10px;
  margin: 8px 0;
  max-width: 80%;
  line-height: 1.4;
  white-space: pre-wrap;
}
.model {
  background: #f1f3f5;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}
</style>
