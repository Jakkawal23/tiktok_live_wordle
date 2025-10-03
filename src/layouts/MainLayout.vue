<script setup lang="ts">
import { ref } from "vue";
import Header from "@/components/shell/Header.vue";
import Sidebar from "@/components/shell/Sidebar.vue";
import { RouterView } from "vue-router";

const sidebarOpen = ref(false);
</script>

<template>
  <div class="layout">
    <Header @toggleSidebar="sidebarOpen = !sidebarOpen" />
    <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.main-content {
  flex: 1;
  padding: 1rem;
  margin-left: 0;
  transition: margin-left 0.3s ease;
}
@media (min-width: 768px) {
  .main-content {
    margin-left: 200px; /* leave space for sidebar on desktop */
  }
}
</style>
