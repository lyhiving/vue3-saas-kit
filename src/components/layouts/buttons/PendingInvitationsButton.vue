<template>
  <!-- Pending invitations (links) -->
  <div v-if="currentRole < 3" class="inline-flex shadow-none rounded-sm divide-x divide-gray-300">
    <div class="text-sm relative z-0 inline-flex shadow-none rounded-full">
      <button
        @click="showPendingLinks"
        type="button"
        class="shadow-inner rounded-full border relative items-center p-2 font-medium"
        :class="{
          'px-3 flex space-x-2 text-theme-900 bg-theme-50 border-theme-300 hover:bg-theme-100 hover:text-theme-800 focus:bg-theme-200 focus:text-theme-900 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-50 focus:ring-theme-100': pendingInvitations > 0,
          ' text-gray-800 bg-gray-50 border-gray-100 hover:bg-theme-300 hover:text-theme-800 focus:bg-theme-400 focus:text-theme-900 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-50 focus:ring-theme-50': !pendingInvitations || pendingInvitations === 0,
        }"
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
      >
        <div v-if="pendingInvitations > 0">
          {{ pendingInvitations }}
          <span
            v-if="pendingInvitations === 1"
            class="hidden md:inline-block lowercase"
          >{{ $t("app.links.pending.one") }}</span>
          <span
            v-else
            class="hidden md:inline-block lowercase"
          >{{ $t("app.links.pending.multiple") }}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      </button>
    </div>
  </div>
  <!-- Pending invitations (links): End -->
</template>

<script setup lang="ts">
import store from "@/store";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import tinyEventBus from "@/plugins/tinyEventBus";
import services from "@/services";
import { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import { onMounted } from "@vue/runtime-core";
import { computed } from "vue";

onMounted(() => {
  services.tenants.getCurrentUsage(AppUsageType.PENDING_INVITATIONS);
})

function showPendingLinks() {
  tinyEventBus().emitter.emit("view-pending-invitations");
}
const pendingInvitations = computed((): number => {
  return store.state.app.usage.pendingInvitations;
})
const currentRole = computed((): TenantUserRole => {
  return store.state.tenant.current?.currentUser.role ?? TenantUserRole.GUEST;
})
</script>
