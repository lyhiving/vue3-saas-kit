<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="space-y-2 w-full">
    <div class="flex justify-between">
      <DropdownWithClick ref="dropdownLeft" :right="true" @click="alert('Dropdown click')">
        <template v-slot:button>Dropdown with Click</template>
        <template v-slot:options>
          <button
            type="button"
            class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
            role="menuitem"
            tabindex="-1"
            id="menu-item-0"
            @click="() => {
              alert('click')
            }"
          >
            <div>Button</div>
          </button>
          <router-link
            :to="currentRoute"
            class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
            role="menuitem"
            tabindex="-1"
            id="menu-item-1"
          >
            <div>Link</div>
          </router-link>
        </template>
      </DropdownWithClick>
      <DropdownWithClick ref="dropdownRight" @click="alert('Dropdown click')">
        <template v-slot:button>Dropdown with Click</template>
        <template v-slot:options>
          <button
            type="button"
            class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
            role="menuitem"
            tabindex="-1"
            id="menu-item-0"
            @click="() => {
              alert('click')
            }"
          >
            <div>Button</div>
          </button>
          <router-link
            :to="currentRoute"
            class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
            role="menuitem"
            tabindex="-1"
            id="menu-item-1"
          >
            <div>Link</div>
          </router-link>
        </template>
      </DropdownWithClick>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import DropdownWithClick from './DropdownWithClick.vue';

const route = useRoute();
const currentRoute = route.path;

const dropdownLeft = ref<InstanceType<typeof DropdownWithClick>>();
const dropdownRight = ref<InstanceType<typeof DropdownWithClick>>();

function alert(message) {
  window.alert(message)
}
</script>