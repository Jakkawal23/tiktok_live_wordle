<script setup lang="ts">
const toggleTheme = () => {
  const root = document.documentElement;
  if (root.classList.contains("dark")) {
    root.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    root.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
};
</script>

<template>
  <header
    class="flex items-center justify-between px-4 py-2 border-b border-border"
    :class="{ 'bg-background': true }"
  >
    <!-- Left -->
    <div class="flex items-center space-x-3">
      <button
        class="text-2xl p-2 rounded-md hover:bg-backgroundSoft dark:hover:bg-gray-700"
        @click="$emit('toggleSidebar')"
      >
        ☰
      </button>
      <img alt="Vue logo" class="w-8 h-8" src="@/assets/logo.svg" />
      <h1 class="text-lg font-bold text-heading">My Web</h1>
    </div>

    <!-- Right -->
    <div class="flex items-center space-x-3">
      <button
        class="p-2 rounded-md text-xl hover:bg-backgroundSoft dark:hover:bg-gray-700"
        @click="toggleTheme"
      >
        🌗
      </button>
    </div>
  </header>
</template>
