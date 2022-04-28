<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div>
    <ButtonPrimary @click="increment(1)">Counter: {{ counter }}</ButtonPrimary>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ButtonPrimary from '@/components/ui/buttons/ButtonPrimary.vue';

const counter = ref(0);

onMounted(() => {
  console.log("mouted")
})

function increment(i: number) {
  counter.value += i;
}
</script>
