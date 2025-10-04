<script setup lang="ts">
import { RouterLink } from "vue-router";

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <!-- Overlay สำหรับ mobile -->
  <div
    v-if="props.isOpen"
    class="fixed inset-0 bg-opacity-40 z-30"
    @click="emit('close')"
  ></div>

  <!-- Sidebar -->
  <aside
    class="fixed top-0 left-0 w-64 h-full border-r border-border z-40 transform transition-transform duration-300"
    :class="{ '-translate-x-full': !props.isOpen, 'translate-x-0': props.isOpen }"
    style="background: var(--color-sidebar-background)"
  >
    <div
      class="flex items-center justify-between px-4 py-3 border-b border-border dark:border-gray-700"
    >
      <h2 class="text-lg font-semibold text-heading">Menu</h2>
      <button
        class="p-2 rounded-md hover:bg-backgroundSoft dark:hover:bg-gray-700"
        @click="emit('close')"
      >
        ✖
      </button>
    </div>

    <ul class="mt-4 space-y-2 px-4">
      <li>
        <RouterLink
          to="/game"
          class="block px-3 py-2 rounded-md text-text hover:bg-backgroundSoft dark:text-text"
          active-class="bg-backgroundMute font-bold"
          @click="emit('close')"
        >
          Game
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/tiktok-connect"
          class="block px-3 py-2 rounded-md text-text hover:bg-backgroundSoft dark:text-text"
          active-class="bg-backgroundMute font-bold"
          @click="emit('close')"
        >
          Tiktok Connect
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/home"
          class="block px-3 py-2 rounded-md text-text hover:bg-backgroundSoft dark:text-text"
          active-class="bg-backgroundMute font-bold"
          @click="emit('close')"
        >
          Home
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/about"
          class="block px-3 py-2 rounded-md text-text hover:bg-backgroundSoft dark:text-text"
          active-class="bg-backgroundMute font-bold"
          @click="emit('close')"
        >
          About
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>
