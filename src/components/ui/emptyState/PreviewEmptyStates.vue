<template>
  <div class="space-y-2 w-full">
    <EmptyState
      @new="alert('click')"
      :captions="{
        new: 'Button',
        thereAreNo: 'There are no...',
        description: 'Description...',
      }"
      icon="plus"
    />
    <EmptyState
      :to="currentRoute"
      :captions="{
        new: 'Link',
        thereAreNo: 'There are no...',
        description: 'Description...',
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import EmptyState from './EmptyState.vue';

const route = useRoute();
const currentRoute = route.path;

function alert(message) {
  window.alert(message)
}
</script>