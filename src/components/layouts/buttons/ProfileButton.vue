<template>
  <div v-click-outside="closeDropdownUser" class="relative">
    <div class="inline-flex shadow-none rounded-sm divide-x divide-gray-300">
      <button
        @click="dropDownUser = !dropDownUser"
        class="bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-theme-100 focus:ring-offset-2 focus:ring-offset-theme-50 focus:text-theme-900 focus:z-10 font-medium hover:text-theme-800 inline-flex items-center relative rounded-full shadow-inner text-slate-400"
        :class="{
          'p-2 focus:bg-theme-400 hover:bg-theme-300': !avatar,
          'p-1 hover:bg-gray-200': avatar
        }"
        id="user-menu"
        aria-label="User menu"
        aria-haspopup="true"
      >
        <img
          v-if="avatar"
          class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-800"
          :src="avatar"
          alt="Avatar"
        />
        <span v-else class="inline-block h-5 w-5 rounded-full overflow-hidden">
          <svg class="h-full w-full" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </span>
      </button>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="dropDownUser"
        class="z-40 origin-top-right absolute right-0 mt-2 w-64 rounded-sm shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div
          class="py-1 rounded-sm bg-white shadow-xs"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <a
            class="truncate group flex items-center px-4 py-2 text-sm text-gray-700 transition ease-in-out duration-150"
            role="menuitem"
          >
            <div class="flex flex-col space-y-1 truncate">
              <div class="font-medium">{{ profileName }}</div>
              <div class="font-bold truncate">{{ email }}</div>
            </div>
          </a>
          <div class="border-t border-gray-200"></div>

          <router-link
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
            role="menuitem"
            @click="closeDropdownUser"
            to="/app/settings/profile"
          >{{ $t("app.navbar.profile") }}</router-link>
          <router-link
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
            role="menuitem"
            @click="closeDropdownUser"
            to="/app/settings/workspaces"
          >{{ $t("app.navbar.workspaces") }}</router-link>

          <router-link
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
            role="menuitem"
            @click="closeDropdownUser"
            to="/app/settings/members"
          >{{ $t("app.navbar.members") }}</router-link>
          <router-link
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
            role="menuitem"
            @click="closeDropdownUser"
            to="/app/settings/subscription"
          >{{ $t("app.navbar.subscription") }}</router-link>
          <router-link
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
            role="menuitem"
            @click="closeDropdownUser"
            to="/app/settings/tenant"
          >{{ $t("app.navbar.tenant") }}</router-link>
          <div class="border-t border-gray-200 mt-1"></div>

          <button
            @click="logout"
            class="text-left w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150 focus:outline-none"
            role="menuitem"
          >{{ $t("app.navbar.signOut") }}</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import store from "@/store";
import { UserDto } from "@/application/dtos/core/users/UserDto";
import { computed, ref } from "vue";

const dropDownUser = ref(false);

function closeDropdownUser() {
  dropDownUser.value = false;
}
function logout() {
  store.commit("auth/logout");
}
const user = computed((): UserDto | null => {
  return store.state.account.user;
})
const avatar = computed((): string => {
  return user.value?.avatar ?? "";
})
const email = computed(() => {
  return user.value?.email ?? "";
})
const profileName = computed((): string => {
  if (user.value) {
    if (user.value.firstName && user.value.lastName) {
      return user.value.firstName + " " + user.value.lastName;
    } else {
      return user.value.email;
    }
  }
  return "--";
})
</script>
