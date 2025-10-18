<template>
  <section class="panel">
    <header class="panel-head">
      <h3>Story Timeline</h3>
      <button class="btn" @click="refresh" :disabled="loading">Refresh</button>
    </header>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="timeline.length" class="chapters">
      <details v-for="(chapter, index) in timeline" :key="index" open>
        <summary class="chapter">Chapter {{ chapter.chapter }}</summary>
        <ul class="events">
          <li
            v-for="(event, ev_index) in chapter.events"
            :key="ev_index"
            class="event"
          >
            <div class="what">{{ event.what || "Event" }}</div>
            <div class="meta">
              <span v-if="event.when">When: {{ event.when }}</span>
              <span v-if="event.where">When: {{ event.where }}</span>
              <span v-if="event.who?.length"
                >Who: {{ event.who.join(", ") }}</span
              >
            </div>
            <div v-if="event.notes" class="notes">Notes: {{ event.notes }}</div>
          </li>
        </ul>
      </details>
    </div>

    <p v-else class="muted">No timeline yet. Click Refresh to analyze.</p>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("timeline", ["timeline", "loading", "error"]),
  },
  methods: {
    refresh() {
      this.$store.dispatch("timeline/refereshTimeline");
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
.chapters {
  display: grid;
  gap: 8px;
}
.chapter {
  font-weight: 600;
  cursor: pointer;
}
.events {
  list-style: none;
  padding: 0 0 0 4px;
  margin: 8px 0 0;
  display: grid;
  gap: 8px;
}
.event {
  padding: 8px;
  border: 1px solid #eef1f5;
  border-radius: 10px;
}
.what {
  font-weight: 600;
}
.meta,
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
