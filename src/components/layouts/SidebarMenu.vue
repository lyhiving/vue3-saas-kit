<template>
  <div>
    <!-- Mobile menu -->
    <div class="sm:hidden">
      <div v-for="(group, index) in getMenu" :key="index" class="mt-2">
        <div class="mt-2">
          <h3
            class="px-1 text-xs leading-4 font-semibold text-slate-500 uppercase tracking-wider"
          >{{ group.title }}</h3>
        </div>
        <div v-for="(menuItem, index) in group.items" :key="index">
          <div v-if="!menuItem.items || menuItem.items.length === 0">
            <router-link
              :to="menuItem.path"
              class="px-4 mt-1 group flex items-center space-x-4 py-2 text-base leading-5 rounded-sm hover:text-white text-slate-300 focus:outline-none focus:text-gray-50 transition ease-in-out duration-150"
              :class="{
                'text-slate-300 bg-theme-600 focus:bg-theme-700': isCurrent(menuItem),
                'text-slate-200 hover:bg-slate-800 focus:bg-slate-800': !isCurrent(menuItem),
              }"
              @click="$emit('selected')"
            >
              <SidebarIcon class="h-5 w-5 text-white" :icon="menuItem.icon" />
              <div>{{ menuItem.title }}</div>
            </router-link>
          </div>
          <div v-else>
            <div
              class="px-4 justify-between mt-1 group flex items-center py-2 text-base leading-5 rounded-sm hover:text-white focus:outline-none focus:text-gray-50 focus:bg-slate-800 transition ease-in-out duration-150 text-slate-200 hover:bg-slate-800"
              @click="toggleMenuItem(index)"
            >
              <div class="flex items-center space-x-4">
                <span class="text-slate-200 h-5 w-5 transition ease-in-out">
                  <SidebarIcon class="h-5 w-5 text-white" :icon="menuItem.icon" />
                </span>
                <div>{{ menuItem.title }}</div>
              </div>
              <!-- Expanded: "text-gray-400 rotate-90", Collapsed: "text-slate-200" -->
              <svg
                :class="menuItemIsExpanded(index) ? 'rotate-90 ml-auto h-3 w-3 transform group-hover:text-gray-400 group-focus:text-gray-400 transition-colors ease-in-out duration-150' : 'ml-auto h-3 w-3 transform group-hover:text-gray-400 group-focus:text-gray-400 transition-colors ease-in-out duration-150'"
                class="ml-auto h-5 w-5 transform transition-colors ease-in-out duration-150"
                viewBox="0 0 20 20"
              >
                <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
              </svg>
            </div>
            <!-- Expandable link section, show/hide based on state. -->
            <div v-if="menuItemIsExpanded(index)" class="mt-1">
              <router-link
                v-for="(subItem, index) in menuItem.items"
                :key="index"
                :to="subItem.path"
                class="pl-14 mt-1 group flex items-center py-2 sm:text-sm leading-5 rounded-sm hover:text-slate-300 focus:outline-none focus:text-slate-300 transition ease-in-out duration-150"
                :class="{
                  'text-slate-300 bg-theme-600 focus:bg-theme-700': isCurrent(subItem),
                  'text-slate-200 hover:bg-slate-800 focus:bg-slate-800': !isCurrent(subItem),
                }"
                @click="$emit('selected')"
              >
                <span v-if="subItem.icon" class="mr-1 h-5 w-5 transition ease-in-out">
                  <SidebarIcon class="h-5 w-5 text-white" :icon="subItem.icon" />
                </span>
                {{ subItem.title }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop menu -->
    <div class="hidden sm:block">
      <div v-for="(group, index) in getMenu" :key="index" class="select-none">
        <div class="mt-2">
          <h3
            id="Settings-headline"
            class="px-1 text-xs leading-4 font-semibold text-slate-500 uppercase tracking-wider"
          >{{ group.title }}</h3>
        </div>
        <div v-for="(menuItem, index) in group.items" :key="index">
          <div v-if="!menuItem.items || menuItem.items.length === 0">
            <router-link
              :to="menuItem.path"
              class="px-4 justify-between mt-1 group flex items-center py-2 text-sm leading-5 rounded-sm hover:text-white text-slate-300 focus:outline-none focus:text-gray-50 transition ease-in-out duration-150"
              :class="{
                'px-4': menuItem.icon !== undefined,
                'text-slate-300 bg-theme-600 focus:bg-theme-700': isCurrent(menuItem),
                'text-slate-200 hover:bg-slate-800 focus:bg-slate-800': !isCurrent(menuItem),
              }"
            >
              <div class="flex items-center space-x-5">
                <SidebarIcon class="h-5 w-5 text-white" :icon="menuItem.icon" />
                <div>{{ menuItem.title }}</div>
              </div>
            </router-link>
          </div>
          <div v-else>
            <button
              type="button"
              class="w-full px-4 justify-between mt-1 group flex items-center py-2 text-sm leading-5 rounded-sm hover:text-white focus:outline-none focus:text-gray-50 transition ease-in-out duration-150 text-slate-200 hover:bg-slate-800 focus:bg-slate-800"
              @click="toggleMenuItem(index)"
            >
              <div class="flex items-center space-x-5">
                <SidebarIcon class="h-5 w-5 text-white" :icon="menuItem.icon" />
                <div>{{ menuItem.title }}</div>
              </div>
              <!-- Expanded: "text-gray-400 rotate-90", Collapsed: "text-slate-200" -->
              <svg
                :class="menuItemIsExpanded(index) ? 'rotate-90 ml-auto h-3 w-3 transform  transition-colors ease-in-out duration-150' : 'ml-auto h-3 w-3 transform  transition-colors ease-in-out duration-150'"
                class="bg-slate-900 ml-auto h-5 w-5 transform transition-colors ease-in-out duration-150"
                viewBox="0 0 20 20"
              >
                <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
              </svg>
            </button>
            <!-- Expandable link section, show/hide based on state. -->
            <div v-if="menuItemIsExpanded(index)" class="mt-1">
              <router-link
                v-for="(subItem, index) in menuItem.items"
                :key="index"
                :to="subItem.path"
                class="mt-1 group flex items-center py-2 text-sm leading-5 rounded-sm hover:text-white focus:outline-none focus:text-gray-50 text-slate-300 transition ease-in-out duration-150"
                :class="{
                  'pl-10': menuItem.icon === undefined,
                  'pl-14': menuItem.icon !== undefined,
                  'text-slate-300 bg-theme-600 focus:bg-theme-700': isCurrent(subItem),
                  'text-slate-200 hover:bg-slate-800 focus:bg-slate-800': !isCurrent(subItem),
                }"
              >
                <SidebarIcon class="h-5 w-5 text-white" :icon="subItem.icon" />
                <div>{{ subItem.title }}</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SidebarGroup } from '@/application/sidebar/SidebarGroup';
import { SideBarItem } from '@/application/sidebar/SidebarItem';
import { UserType } from '@/application/enums/core/users/UserType';
import { TenantUserRole } from '@/application/enums/core/tenants/TenantUserRole';
import store from '@/store';
import { AdminSidebar } from '@/application/sidebar/AdminSidebar';
import { AppSidebar } from "@/application/sidebar/AppSidebar";
import SidebarIcon from "./icons/SidebarIcon.vue";
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  layout: {
    default: ""
  }
})

const route = useRoute();

const menu = ref<SideBarItem[]>([]);
const expanded = ref<number[]>([]);

onMounted(() => {
  menu.value = props.layout === 'admin' ? AdminSidebar : AppSidebar;
  menu.value.forEach((group) => {
    group.items?.forEach((element, index) => {
      if (element.open) {
        expanded.value.push(index);
      } else {
        expanded.value = expanded.value.filter((f) => f !== index);
      }
    });
  });
})

function menuItemIsExpanded(index: number) {
  return expanded.value.includes(index);
}
function toggleMenuItem(index) {
  if (expanded.value.includes(index)) {
    expanded.value = expanded.value.filter((item) => item !== index);
  } else {
    expanded.value.push(index);
  }
}
function isCurrent(menuItem: SideBarItem) {
  return route.path?.includes(menuItem.path);
  // return route.name && menuItem.pathName && route.name.includes(menuItem.pathName)
}
function allowCurrentUserType(item: SideBarItem) {
  return (!item.userTypes || item.userTypes.includes(currentUserType.value));
}
function allowCurrentRole(item: SideBarItem) {
  return (!item.userRoles || item.userRoles.includes(currentUserRole.value));
}
const getMenu = computed((): SidebarGroup[] => {
  const _menu: SidebarGroup[] = [];
  menu.value
    .filter(f => allowCurrentUserType(f) && allowCurrentRole(f))
    .forEach(({ title, items }) => {
      _menu.push({
        title: title.toString(),
        items: items?.filter(f => allowCurrentUserType(f) && allowCurrentRole(f)) ?? [],
      });
    });
  return _menu.filter(f => f.items.length > 0);
})
const currentUserType = computed((): UserType => {
  return store.state.account.user?.type ?? UserType.Tenant;
})
const currentUserRole = computed((): TenantUserRole => {
  return store.state.tenant.current?.currentUser.role as TenantUserRole;
})
</script>