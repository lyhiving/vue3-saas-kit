<template>
  <router-link
    to="/app/links/providers"
    class="px-4 py-5 border shadow-md rounded-lg overflow-hidden sm:p-6 bg-white border-gray-300 hover:bg-gray-50"
  >
    <div>
      <dt class="text-sm font-medium text-gray-500 truncate">{{ $t("models.provider.plural") }}</dt>
      <dd v-if="loading" class="mt-1 text-xl font-semibold text-gray-900">...</dd>
      <dd v-else class="mt-1 text-gray-900 truncate">
        <span class="text-xl font-semibold">{{ providers }}</span>
      </dd>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import services from "@/services";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import store from "@/store";
import { computed, onMounted, ref } from "vue";

const loading = ref(false);

onMounted(() => {
  loading.value = true;
  services.tenants.getCurrentUsage(AppUsageType.PROVIDERS).finally(() => {
    loading.value = false;
  });
})
const providers = computed(() => {
  return store.state.app.usage.providers;
})
</script>

