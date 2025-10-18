<template>
  <div class="bubble" :class="roleClass" v-html="escapedContent"></div>
</template>

<script>
export default {
  props: {
    role: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  computed: {
    roleClass() {
      return this.role === "user" ? "user" : "model";
    },
    escapedContent() {
      const div = document.createElement("div");
      div.innerText = this.content;
      return div.innerHTML;
    },
  },
};
</script>

<style scoped>
.bubble {
  padding: 10px 12px;
  border-radius: 10px;
  margin: 8px 0;
  max-width: 80%;
  line-height: 1.4;
  white-space: pre-wrap;
}
.user {
  background: #e7f0ff;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}
.model {
  background: #f1f3f5;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}
</style>
