<template>
  <aside class="sidebar" :class="{ open: isOpen }">
    <button class="close-btn" @click="$emit('close')">✖</button>
    <ul>
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><RouterLink to="/about">About</RouterLink></li>
      <li><RouterLink to="/manage">Manage Game</RouterLink></li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps<{ isOpen: boolean }>();
defineEmits<{
  (e: "close"): void;
}>();
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: -220px;
  top: 0;
  bottom: 0;
  width: 200px;
  background: var(--color-background-soft);
  border-right: 1px solid var(--color-border);
  padding: 1rem;
  transition: left 0.3s ease;
  color: var(--color-text);
}

.sidebar.open {
  left: 0;
}

.sidebar a {
  color: var(--color-text);
}

.sidebar a.router-link-exact-active {
  color: var(--color-heading);
  font-weight: bold;
}
</style>
