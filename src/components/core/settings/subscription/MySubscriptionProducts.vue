<template>
  <div>
    <div>
      <div
        v-if="withCurrentPlan"
        class="space-y-2 sm:space-y-0 sm:flex items-center sm:space-x-2 justify-between"
      >
        <h3 class="leading-5 text-gray-900 truncate">
          <span v-if="loading" class="leading-5">{{ $t("shared.loading") }}...</span>
          <span v-else-if="currentProduct">
            {{ $t("settings.subscription.current") }}
            <router-link
              to="/app/settings/subscription"
              class="leading-5 font-bold hover:underline hover:text-theme-600"
            >{{ $t(currentProduct.subscriptionProduct.title) }}</router-link>
          </span>
          <span
            v-else-if="!loading"
            class="ml-1 text-sm leading-5 font-bold text-gray-500"
          >({{ $t("settings.subscription.noActivePlan") }})</span>
        </h3>
      </div>
      <dl
        class="grid gap-5"
        :class="[
          cols,
          {
            'mt-2 ': withCurrentPlan,
          },
        ]"
      >
        <div
          class="bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6"
          :class="{
            'bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer': billableStatus(maxLinksRemaining) === 0,
            'bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer': billableStatus(maxLinksRemaining) === 1,
            'bg-white': billableStatus(maxLinksRemaining) === 2,
            'bg-teal-50 border-teal-300 hover:bg-teal-100 cursor-pointer': billableStatus(maxLinksRemaining) === 3,
          }"
        >
          <dt class="text-sm font-medium text-gray-500 truncate">{{ $t("models.link.plural") }}</dt>
          <dd class="mt-1 text-xl font-semibold text-gray-900">
            <span v-if="loading">...</span>
            <span v-else>
              <span v-if="links">{{ links }}</span>
              <span v-else>0</span>
              /
              <span v-if="currentProduct">{{ currentProduct.maxLinks }}</span>
              <span v-else class="text-gray-500">0</span>
            </span>
          </dd>
        </div>

        <router-link
          to="/app/contracts/pending"
          class="bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6 hover:bg-gray-50"
          :class="{
            'bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer': billableStatus(maxDocumentsRemaining) === 0,
            'bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer': billableStatus(maxDocumentsRemaining) === 1,
            'bg-white': billableStatus(maxDocumentsRemaining) === 2,
            'bg-teal-50 border-teal-300 hover:bg-teal-100 cursor-pointer': billableStatus(maxDocumentsRemaining) === 3,
          }"
        >
          <dt class="text-sm font-medium text-gray-500 truncate">{{ $t("models.contract.plural") }}</dt>
          <dd class="mt-1 text-xl font-semibold text-gray-900">
            <span v-if="loading">...</span>
            <span v-else>
              <span v-if="usage && usage.contracts">{{ usage.contracts }}</span>
              <span v-else>0</span>
              /
              <span v-if="currentProduct">{{ currentProduct.monthlyContracts }}</span>
              <span v-else class="text-gray-500">0</span>
            </span>
          </dd>
        </router-link>

        <router-link
          to="/app/settings/workspaces"
          class="bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6 hover:bg-gray-50"
          :class="{
            'bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer': billableStatus(maxWorkspacesRemaining) === 0,
            'bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer': billableStatus(maxWorkspacesRemaining) === 1,
            'bg-white': billableStatus(maxWorkspacesRemaining) === 2,
            'bg-teal-50 border-teal-300 hover:bg-teal-100 cursor-pointer': billableStatus(maxWorkspacesRemaining) === 3,
          }"
        >
          <dt class="text-sm font-medium text-gray-500 truncate">{{ $t("models.workspace.plural") }}</dt>
          <dd class="mt-1 text-xl font-semibold text-gray-900">
            <span v-if="loading">...</span>
            <span v-else>
              <span v-if="usage">{{ workspaces.length }}</span>
              <span v-else>0</span>
              /
              <span v-if="currentProduct">{{ currentProduct.maxWorkspaces }}</span>
              <span v-else class="text-gray-500">0</span>
            </span>
          </dd>
        </router-link>
        <router-link
          to="/app/settings/members"
          class="bg-white px-4 py-5 border border-gray-300 shadow-md rounded-lg overflow-hidden sm:p-6 hover:bg-gray-50"
          :class="{
            'bg-rose-50 border-rose-300 hover:bg-rose-100 cursor-pointer': billableStatus(maxUsersRemaining) === 0,
            'bg-yellow-50 border-yellow-300 hover:bg-yellow-100 cursor-pointer': billableStatus(maxUsersRemaining) === 1,
            'bg-white': billableStatus(maxUsersRemaining) === 2,
            'bg-teal-50 border-teal-300 hover:bg-teal-100 cursor-pointer': billableStatus(maxUsersRemaining) === 3,
          }"
        >
          <dt class="text-sm font-medium text-gray-500 truncate">{{ $t("models.user.plural") }}</dt>
          <dd class="mt-1 text-xl font-semibold text-gray-900">
            <span v-if="loading">...</span>
            <span v-else>
              <span v-if="usage">{{ users.length }}</span>
              <span v-else>0</span>
              /
              <span v-if="currentProduct">{{ currentProduct.maxUsers }}</span>
              <span v-else class="text-gray-500">0</span>
            </span>
          </dd>
        </router-link>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";
import services from "@/services";
import { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";
import { SubscriptionGetCurrentResponse } from "@/application/contracts/core/subscriptions/SubscriptionGetCurrentResponse";
import { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import tinyEventBus from "@/plugins/tinyEventBus";
import { AppUsageSummaryDto } from "@/application/dtos/app/usage/AppUsageSummaryDto";
import { onBeforeUnmount } from "@vue/runtime-core";
import { computed, onMounted, ref } from "vue";

defineProps({
  withCurrentPlan: Boolean,
  cols: {
    default: "grid-cols-2 sm:grid-cols-2 xl:grid-cols-4"
  },
})

const loading = ref(false);
const subscription = ref<SubscriptionGetCurrentResponse | null>(null);
const workspaces = ref<WorkspaceDto[]>([]);
const users = ref<TenantUserDto[]>([]);

onMounted(() => {
  tinyEventBus().emitter.on("updated-plan", () => {
    reload();
  });
  reload();
})

onBeforeUnmount(() => {
  tinyEventBus().emitter.off("updated-plan");
})

function reload() {
  loading.value = true;

  const promises: any[] = [];

  const loadDashboard = services.subscriptionManager.getCurrentSubscription().then((response) => {
    subscription.value = response;
  });
  const loadWorkspaces = services.workspaces.getAllWorkspaces(false).then((response) => {
    workspaces.value = response;
  });
  const loadUsers = services.tenantUsers.getAll().then((response) => {
    users.value = response;
  });
  promises.push(loadDashboard);
  promises.push(loadWorkspaces);
  // promises.push(loadFeatures);
  promises.push(loadUsers);

  loading.value = true;
  Promise.all(promises).finally(() => {
    loading.value = false;
  });
}
function billableStatus(max: number): number {
  if (loading.value) {
    return 2;
  }
  if (!currentProduct.value) {
    return 0;
  }
  if (max === 0) {
    return 1;
  }
  if (max > 0) {
    return 2;
  }
  return 0;
}
const links = computed((): number => {
  return store.state.app.usage.providers + store.state.app.usage.clients;
})
const currentProduct = computed((): TenantProductDto | undefined => {
  if (subscription.value?.myProducts && subscription.value?.myProducts.length > 0) {
    return subscription.value?.myProducts[0];
  }
  return undefined;
})
const maxLinksRemaining = computed(() => {
  if (!currentProduct.value || !usage.value) {
    return 1;
  }
  const links = usage.value.providers + usage.value.clients;
  const remaining = currentProduct.value.maxLinks - links;
  return remaining;
})
const maxDocumentsRemaining = computed(() => {
  if (!currentProduct.value || !usage.value) {
    return 1;
  }
  return currentProduct.value.monthlyContracts - usage.value.contracts;
})
const maxWorkspacesRemaining = computed(() => {
  if (!currentProduct.value || !usage.value) {
    return 1;
  }
  return currentProduct.value.maxWorkspaces - workspaces.value.length;
})
const maxUsersRemaining = computed(() => {
  if (!currentProduct.value || !usage.value) {
    return 1;
  }
  return currentProduct.value.maxUsers - users.value.length;
})
const usage = computed((): AppUsageSummaryDto => {
  return store.state.app.usage;
})
</script>
