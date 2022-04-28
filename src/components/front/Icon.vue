<template>
  <router-link to="/">
    <img
      v-if="$store.state.theme.theme === 0"
      class="h-9 w-auto mx-auto"
      src="@/assets/img/icon-light.png"
      alt="Logo"
    />
    <img v-else class="h-9 w-auto mx-auto" src="@/assets/img/icon-dark.png" alt="Logo" />
  </router-link>
</template>

<script setup lang="ts">
</script>
