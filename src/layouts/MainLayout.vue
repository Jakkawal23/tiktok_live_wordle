<script setup lang="ts">
import { ref, watch } from "vue";
import Header from "@/components/shell/Header.vue";
import Sidebar from "@/components/shell/Sidebar.vue";

const sidebarOpen = ref(false);

watch(sidebarOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});
</script>

<template>
  <div class="flex h-screen text-text" :class="{ 'bg-background': true }">
    <!-- Sidebar -->
    <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Main Content -->
    <div class="flex flex-col flex-1 transition-all duration-300">
      <Header @toggleSidebar="sidebarOpen = !sidebarOpen" />
      <main class="flex-1 p-4 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>
