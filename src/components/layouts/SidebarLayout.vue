<template>
  <div>
    <div class="h-screen flex overflow-hidden bg-gray-100 text-gray-800">
      <!-- Mobile sidebar -->
      <div v-if="sidebarOpen" class="md:hidden">
        <div class="fixed inset-0 flex z-40">
          <transition
            enter-active-class="transition-opacity ease-linear duration-300"
            enter-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity ease-linear duration-300"
            leave-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div class="fixed inset-0">
              <div class="absolute inset-0 bg-gray-800 opacity-75" />
            </div>
          </transition>

          <transition
            enter-active-class="transition ease-in-out duration-300 transform"
            enter-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition ease-in-out duration-300 transform"
            leave-class="translate-x-0"
            leave-to-class="-translate-x-full"
          >
            <div class="relative flex-1 flex flex-col max-w-xs w-full pb-4 bg-gray-900">
              <div class="absolute top-0 right-0 -mr-14 p-1 mt-2">
                <button
                  class="flex items-center justify-center h-12 w-12 rounded-sm focus:outline-none focus:bg-gray-600"
                  aria-label="Close sidebar"
                  @click="sidebarOpen = !sidebarOpen"
                >
                  <svg
                    class="text-white h-7 w-7"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div class="mt-5 flex-1 h-0 overflow-y-auto">
                <nav class="px-2 space-y-2">
                  <TenantSelector class="text-sm" @add="$emit('addTenant')" />
                  <WorkspaceSelector v-if="layout === 'app'" class="text-sm" />
                  <SidebarMenu :layout="layout" @selected="sidebarOpen = !sidebarOpen" />
                </nav>
              </div>
            </div>
          </transition>
          <div class="flex-shrink-0 w-14">
            <!-- Dummy element to force sidebar to shrink to fit close icon -->
          </div>
        </div>
      </div>

      <!-- Desktop sidebar -->
      <div
        :class="sidebarOpen ? 'hidden transition ease-in duration-1000' : 'overflow-x-hidden hidden md:flex md:flex-shrink-0 border-r dark:border-r-0 border-theme-200 dark:border-theme-800 shadow-sm dark:shadow-lg'"
      >
        <div class="flex flex-col w-64">
          <div class="flex flex-col h-0 flex-1 shadow-md bg-theme-600">
            <div class="flex-1 flex flex-col overflow-y-auto">
              <nav class="flex-1 px-2 py-4 space-y-3 bg-gray-900 select-none">
                <TenantSelector class="text-xs sm:text-sm" @add="$emit('addTenant')" />
                <WorkspaceSelector
                  v-if="layout === 'app'"
                  class="text-xs sm:text-sm"
                  @add="sidebarOpen = false"
                  @selected="sidebarOpen = false"
                />
                <SidebarMenu :layout="layout" />
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col w-0 flex-1 overflow-hidden">
        <div
          class="relative flex-shrink-0 flex h-14 bg-white shadow-inner border-b border-gray-200"
        >
          <button
            class="px-4 border-r border-gray-200 text-gray-600 focus:outline-none focus:bg-gray-100 focus:text-gray-600"
            aria-label="Open sidebar"
            @click="sidebarOpen = !sidebarOpen"
          >
            <svg class="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>

          <div class="flex-1 px-3 flex justify-between">
            <div class="flex-1 flex items-center">
              <div class="w-full flex md:ml-0">
                <div class="align-baseline w-full text-slate-200 pl-1">
                  <!-- Logo -->
                  <nav class="lg:hidden">
                    <router-link to="/app">
                      <img
                        alt="Logo"
                        class="h-7 w-auto sm:hidden"
                        src="@/assets/img/icon-light.png"
                      />
                      <img
                        alt="Logo"
                        class="h-7 w-auto hidden sm:block"
                        src="@/assets/img/logo-light.png"
                      />
                    </router-link>
                  </nav>
                  <nav class="hidden lg:flex items-center text-base leading-5 font-medium">
                    <router-link to="/app">
                      <img
                        alt="Logo"
                        class="hidden sm:block h-7 sm:h-8 w-auto"
                        src="@/assets/img/logo-light.png"
                      />
                    </router-link>
                  </nav>
                  <!-- Logo: End -->
                </div>
              </div>
            </div>
            <div class="flex items-center md:ml-6 space-x-2">
              <LayoutSelector v-if="layout === 'admin'" class="text-sm" />
              <LocaleSelector v-if="layout === 'admin'" class="text-sm" />
              <PendingInvitationsButton v-if="layout === 'app'" />
              <ChatSupportButton v-if="layout === 'app'" />
              <QuickActionsButton v-if="layout === 'app'" />
              <ProfileButton />
            </div>
          </div>
        </div>

        <main
          ref="mainElement"
          class="flex-1 focus:outline-none overflow-y-auto bg-gray-50"
          tabindex="0"
        >
          <div :key="currentWorkspaceId" class="pb-20 sm:pb-0">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WorkspaceSelector from "@/components/layouts/selectors/WorkspaceSelector.vue";
import TenantSelector from "@/components/layouts/selectors/TenantSelector.vue";
import store from "@/store";
import PendingInvitationsButton from "./buttons/PendingInvitationsButton.vue";
import QuickActionsButton from "./buttons/QuickActionsButton.vue";
import ProfileButton from "./buttons/ProfileButton.vue";
import ChatSupportButton from "./buttons/ChatSupportButton.vue";
import SidebarMenu from "./SidebarMenu.vue";
import LocaleSelector from "@/components/ui/selectors/LocaleSelector.vue";
import LayoutSelector from "@/components/ui/selectors/LayoutSelector.vue";
import { computed, ref } from "vue";

defineProps({
  layout: {
    default: ""
  }
})
const mainElement = ref<HTMLElement>();

const sidebarOpen = ref(false);

const currentWorkspaceId = computed((): string => {
  return store.state.tenant.currentWorkspace?.id ?? "";
})
</script>
