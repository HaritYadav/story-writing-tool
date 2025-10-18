<template>
  <div>
    <form class="row" @submit.prevent="onSend">
      <textarea
        type="text"
        v-model="storyPromptInput"
        :disabled="disabled"
        placeholder="Type prompt for story here..."
        @keydown.enter.exact.prevent="onSend"
        ref="inputBox"
        @input="autoGrow"
      />
      <button :disabled="disabled || !trimmed">Write Chapter</button>
    </form>
  </div>
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
    autoGrow() {
      const inputBox = this.$refs.inputBox;
      if (!inputBox) return;
      inputBox.style.height = "auto";
      inputBox.style.height = inputBox.scrollHeight + "px";
    },
    onSend() {
      if (!this.trimmed || this.disabled) return;
      this.$emit("send", this.trimmed);
      this.storyPromptInput = "";
      this.$nextTick(this.autoGrow);
    },
  },
};
</script>

<style scoped>
.row {
  display: flex;
  gap: 8px;
}
/* input[type="text"] {
  flex: 1;
  padding: 12px;
  border: 1px solid #dcdfe4;
  border-radius: 8px;
  outline: none;
} */
/* Make textarea fill available width and auto-resize */
textarea {
  flex: 1;
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #dcdfe4;
  border-radius: 8px;
  outline: none;
  line-height: 1.4;
  min-height: 44px; /* comfortable single-line height */
  max-height: 40vh; /* prevent it from taking over the page */
  overflow-y: auto; /* scroll if beyond max-height */
  resize: none; /* we handle height programmatically */
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
