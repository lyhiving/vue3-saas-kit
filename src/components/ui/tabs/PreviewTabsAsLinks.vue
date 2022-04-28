<template>
  <div class="space-y-2 w-full">
    <Tabs
      class="w-full sm:w-auto"
      :tabs="[{ name: 'Home', routePath: '/' },
      { name: 'Components', routePath: currentRoute }]"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import Tabs from './Tabs.vue';

const route = useRoute();
const currentRoute = route.path;
</script>