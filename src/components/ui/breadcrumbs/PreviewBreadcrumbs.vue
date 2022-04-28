<template>
  <div class="space-y-2 w-full">
    <Breadcrumb
      class="w-full"
      home="/"
      :menu="[{ title: $t('shared.home'), routePath: '/' },
      { title: $t('admin.components.title'), routePath: currentRoute },
      { title: 'Breadcrumbs' }]"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import Breadcrumb from './Breadcrumb.vue';

const route = useRoute();
const currentRoute = route.path;
</script>