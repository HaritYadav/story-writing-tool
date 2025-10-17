<template>
  <header class="bar">
    <h2>Story Writing Chat</h2>
    <div class="right">
      <slot />
    </div>
  </header>
</template>

<script>
export default {};
</script>

<style scoped>
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #eceff3;
  background: #fff;
}
h2 {
  margin: 0;
  font-size: 18px;
}
</style>
