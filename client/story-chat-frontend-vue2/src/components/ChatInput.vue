<template>
  <form class="row" @submit.prevent="onSend">
    <input
      type="text"
      v-model="storyPromptInput"
      :disabled="disabled"
      placeholder="Type prompt for story here..."
      @keydown.enter.exact.prevent="onSend"
    />
    <button :disabled="disabled || !trimmed">Send</button>
  </form>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      storyPromptInput: "",
    };
  },
  computed: {
    trimmed() {
      return this.storyPromptInput.trim();
    },
  },
  methods: {
    onSend() {
      if (!this.trimmed || this.disabled) return;
      this.$emit("send", this.trimmed);
      this.storyPromptInput = "";
    },
  },
};
</script>

<style scoped>
.row {
  display: flex;
  gap: 8px;
}
input[type="text"] {
  flex: 1;
  padding: 12px;
  border: 1px solid #dcdfe4;
  border-radius: 8px;
  outline: none;
}
button {
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: #1a73e8;
  color: #fff;
  cursor: pointer;
}
button[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
