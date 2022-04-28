<template>
  <div>
    <h3 class="mb-2 text-gray-400 font-medium text-sm">{{ $t("models.contract.members") }}</h3>
    <div
      class="bg-white border-gray-200 rounded-tl-md rounded-tr-md border shadow-md overflow-hidden"
    >
      <div class="flow-root">
        <ul role="list" class="divide-y divide-gray-200">
          <li
            v-for="(member, idxMember) in sortedItems"
            :key="idxMember"
            :class="{
              ' ': member.role === 0 && !member.signDate,
            }"
            class="flex items-center justify-between py-2 px-4 space-x-2"
          >
            <div class="truncate">
              <div
                class="text-sm font-medium text-gray-800 truncate flex items-center space-x-1 justify-between"
              >
                <div
                  class="text-sm font-medium text-gray-800 truncate flex items-center space-x-1 justify-between"
                >
                  <span
                    class="text-theme-600 font-normal capitalize mr-1"
                    v-if="member.user.email === currentEmail"
                  >({{ $t("shared.you") }})</span>
                  {{ member.user.firstName }} {{ member.user.lastName }}
                </div>

                <div
                  v-if="member.role === 0"
                  class="text-gray-400 inline-flex items-centerpx-2.5 py-0.5 text-sm leading-5 font-medium rounded-full hover:bg-gray-50"
                ></div>
              </div>
              <div class="flex items-center space-x-2 justify-between truncate">
                <p class="text-sm text-gray-500 truncate">{{ member.user.email }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ContractMemberDto } from "@/application/dtos/app/contracts/ContractMemberDto";
import store from "@/store";
import { PropType } from "@vue/runtime-core";
import { computed } from "vue";

const props = defineProps({
  items: {
    type: Array as PropType<ContractMemberDto[]>
  }
})

const currentEmail = computed(() => {
  return store.state.account.user?.email ?? "";
})
const sortedItems = computed(() => {
  return props.items?.slice().sort((x, y) => {
    return x.user.firstName > y.user.firstName ? 1 : -1;
  });
})
</script>
