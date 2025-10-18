<template>
  <aside class="panel">
    <header class="panel-head">
      <h3>Characters</h3>
      <button class="btn" @click="refreshCharacters" :disabled="loading">
        Refresh
      </button>
    </header>

    <div v-if="error" class="error">{{ error }}</div>
    <ul class="list" v-if="characters.length">
      <li
        v-for="(character, index) in characters"
        :key="index"
        class="character-item"
      >
        <div class="name">
          {{ character.name || "Unnamed" }}
          <span v-if="character.role" class="role"> {{ character.role }}</span>
        </div>
        <div v-if="character.aliases?.length" class="muted">
          Aliases: {{ character.aliases.join(", ") }}
        </div>
        <div v-if="character.traits?.length" class="muted">
          Traits: {{ character.traits.join(", ") }}
        </div>
        <div v-if="character.notes" class="notes">
          Notes: {{ character.notes }}
        </div>
      </li>
    </ul>

    <p v-else class="muted">No characters yet. Click refresh to analyze.</p>
  </aside>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("characters", ["characters", "loading", "error"]),
  },
  methods: {
    refreshCharacters() {
      this.$store.dispatch("characters/refereshCharacters");
    },
  },
};
</script>

<style scoped>
.panel {
  background: #fff;
  border: 1px solid #e8ebf0;
  border-radius: 12px;
  padding: 12px;
}
.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.btn {
  padding: 6px 10px;
  border: none;
  border-radius: 8px;
  background: #1a73e8;
  color: #fff;
  cursor: pointer;
}
.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}
.character-item {
  padding: 8px;
  border: 1px solid #eef1f5;
  border-radius: 10px;
}
.name {
  font-weight: 600;
}
.role {
  color: #6b7280;
  font-weight: 400;
}
.muted {
  color: #6b7280;
  font-size: 12px;
  margin-top: 2px;
}
.notes {
  margin-top: 4px;
}
.error {
  color: #b00020;
  font-size: 12px;
  margin-bottom: 6px;
}
</style>
