<template>
  <AppLayout layout="app"></AppLayout>
</template>

<script setup lang="ts">
import AppLayout from "@/components/app/AppLayout.vue";
import i18n from '@/locale/i18n';
import { useMeta } from "@/modules/vue-meta";

useMeta({
  title: i18n.global.t('app.sidebar.app').toString(),
  titleTemplate: "%s | Vue3 Frontend"
})
</script>