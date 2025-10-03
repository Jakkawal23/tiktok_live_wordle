<script setup lang="ts">
const toggleTheme = () => {
  const root = document.documentElement;
  const current = root.getAttribute("data-theme");
  root.setAttribute("data-theme", current === "dark" ? "light" : "dark");
};
</script>

<template>
  <header class="header">
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="40" height="40" />
    <h1 class="title">My Web</h1>
    <div class="actions">
      <button @click="$emit('toggleSidebar')">☰</button>
      <button @click="toggleTheme">🌓</button>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

.title {
  flex: 1;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-heading);
}

.menu-btn,
.actions button {
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
}
</style>
