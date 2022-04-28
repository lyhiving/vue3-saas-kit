<template>
  <div v-if="currentRole < 3" class="relative" v-click-outside="closeShowQuickActions">
    <div class="inline-flex shadow-none rounded-sm divide-x divide-gray-300">
      <div class="text-sm relative z-0 inline-flex shadow-none rounded-full">
        <button
          @click="showQuickActions = !showQuickActions"
          type="button"
          class="text-gray-800 bg-gray-50 border-gray-100 shadow-inner border relative inline-flex items-center p-2 rounded-full font-medium hover:bg-theme-300 hover:text-theme-800 focus:bg-theme-400 focus:text-theme-900 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-50 focus:ring-theme-100"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
        >
          <span class="sr-only">{{ $t("shared.new") }}</span>
          <!-- Heroicon name: solid/chevron-down -->
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <ul
        v-show="showQuickActions"
        class="z-40 origin-top-right absolute right-0 mt-2 w-72 rounded-sm shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none"
        tabindex="-1"
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-option-0"
      >
        <li
          class="text-gray-900 cursor-default select-none relative text-sm"
          id="listbox-option-0"
          role="option"
        >
          <router-link
            to="/app/contract/new"
            @click="showQuickActions = false"
            class="flex flex-col p-4 hover:bg-gray-50"
          >
            <div class="flex justify-between">
              <p class="font-semibold">{{ $t("app.contracts.new.title") }}</p>
            </div>
            <p class="text-gray-500 mt-2">{{ $t("app.contracts.new.description") }}</p>
          </router-link>
        </li>
        <li
          class="text-gray-900 cursor-default select-none relative text-sm"
          id="listbox-option-1"
          role="option"
        >
          <button
            type="button"
            @click="newProvider"
            class="w-full text-left flex flex-col p-4 hover:bg-gray-50 focus:outline-none"
          >
            <div class="flex justify-between">
              <p class="font-semibold">{{ $t("app.providers.new.title") }}</p>
            </div>
            <p class="text-gray-500 mt-2">{{ $t("app.providers.new.description") }}</p>
          </button>
        </li>
        <li
          class="text-gray-900 cursor-default select-none relative text-sm"
          id="listbox-option-2"
          role="option"
        >
          <button
            type="button"
            @click="newClient"
            class="w-full text-left flex flex-col p-4 hover:bg-gray-50 focus:outline-none"
          >
            <div class="flex justify-between">
              <p class="font-semibold">{{ $t("app.clients.new.title") }}</p>
            </div>
            <p class="text-gray-500 mt-2">{{ $t("app.clients.new.description") }}</p>
          </button>
        </li>
        <li
          v-if="isOwnerOrAdmin"
          class="text-gray-900 cursor-default select-none relative text-sm"
          role="option"
        >
          <router-link
            to="/app/settings/workspaces/new"
            @click="showQuickActions = false"
            class="flex flex-col p-4 hover:bg-gray-50"
          >
            <div class="flex justify-between">
              <p class="font-semibold">{{ $t("app.workspaces.create") }}</p>
            </div>
            <p class="text-gray-500 mt-2">{{ $t("app.workspaces.createDescription") }}</p>
          </router-link>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import store from "@/store";
import tinyEventBus from "@/plugins/tinyEventBus";
import { computed, ref } from "vue";

const showQuickActions = ref(false);

function closeShowQuickActions() {
  showQuickActions.value = false;
}
function newProvider() {
  showQuickActions.value = false;
  tinyEventBus().emitter.emit("new-provider");
}
function newClient() {
  showQuickActions.value = false;
  tinyEventBus().emitter.emit("new-client");
}
const isOwnerOrAdmin = computed((): boolean => {
  return (
    currentRole.value === TenantUserRole.OWNER ||
    currentRole.value === TenantUserRole.ADMIN
  );
})
const currentRole = computed((): TenantUserRole => {
  return store.state.tenant.current?.currentUser.role ?? TenantUserRole.GUEST;
})
</script>
