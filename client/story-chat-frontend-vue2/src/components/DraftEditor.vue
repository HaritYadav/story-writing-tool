<template>
  <section class="draft">
    <header class="bar">
      <h3>Draft</h3>
      <div class="right">
        <button @click="seedFromChat" class="btn">Seed from Chat</button>
        <span class="hint" v-if="seedId">
          Seeded up to message #{{ seedId }}
        </span>
      </div>
    </header>

    <textarea
      v-model="localText"
      @input="debouncedSave"
      class="editor"
      placeholder="Write or edit the story here..."
    ></textarea>

    <footer class="foot">
      <small class="muted">Autosave as you type.</small>
    </footer>
  </section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({
    localText: "",
    saveTimer: null,
  }),
  computed: {
    ...mapGetters("draft", ["text", "lastSeedFromMessageId"]),
    seedId() {
      return this.lastSeedFronMessageId;
    },
  },
  watch: {
    text: {
      immediate: true,
      handler(newText) {
        this.localText = newText;
      },
    },
  },
  methods: {
    ...mapActions("draft", ["updateText", "seedFromChat"]),
    debouncedSave() {
      if (this.saveTimer) clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => {
        this.updateText(this.localText);
      }, 300);
    },
  },
  beforeDestroy() {
    if (this.saveTimer) clearTimeout(this.saveTimer);
  },
};
</script>

<style scoped>
.draft {
  background: #fff;
  border: 1px solid #e8ebf0;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}
.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #eef1f5;
}
.right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.btn {
  padding: 6px 10px;
  border: none;
  border-radius: 8px;
  background: #1a73e8;
  color: #fff;
  cursor: pointer;
}
.editor {
  min-height: 260px;
  padding: 12px;
  border: none;
  outline: none;
  resize: vertical;
  font: 14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}
.foot {
  padding: 8px 12px;
  border-top: 1px solid #eef1f5;
}
.muted {
  color: #6b7280;
}
.hint {
  color: #6b7280;
  font-size: 12px;
}
</style>
