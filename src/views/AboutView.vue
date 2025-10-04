<template>
  <div class="about p-6 bg-background text-text min-h-screen">
    <h1 class="text-heading text-3xl mb-4">About Page</h1>

    <!-- Card -->
    <div class="bg-card text-text p-4 rounded shadow mb-4">
      This is a card with bg-card and text-text
    </div>

    <!-- Primary Text -->
    <p class="text-primary mb-4">This text uses the primary color</p>

    <!-- Secondary Text -->
    <p class="text-secondary mb-4">This text uses the secondary color</p>

    <!-- Button -->
    <button class="px-4 py-2 rounded bg-primary text-black hover:bg-primary/80">
      Primary Button
    </button>

    <!-- Sidebar example -->
    <div class="bg-sidebar p-4 rounded mt-6">Sidebar background example</div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
