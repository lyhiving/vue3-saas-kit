<template>
  <div>
    <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
      <div
        class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2"
      >
        <h1 class="flex-1 font-bold flex items-center truncate">{{ $t("models.contract.plural") }}</h1>
        <div class="flex items-center">
          <ButtonPrimary to="/app/contract/new">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="hidden lg:block">{{ $t("app.contracts.new.title") }}</span>
            <span class="lg:hidden">{{ $t("shared.new") }}</span>
          </ButtonPrimary>
        </div>
      </div>
    </div>
    <div class="bg-white border-b border-gray-300 w-full py-2">
      <div
        class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 space-x-2"
      >
        <Tabs :tabs="tabs" paramName="status" class="flex-grow" />
      </div>
    </div>
    <div class="pt-2 space-y-2 max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ContractsList :filter="filter" :key="filter" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs, { TabItem } from "@/components/ui/tabs/Tabs.vue"
import ContractsList from "@/components/app/contracts/ContractsList.vue";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
import { ContractStatusFilter } from '@/application/contracts/app/contracts/ContractStatusFilter';
import i18n from "@/locale/i18n";
import { useRoute, useRouter } from 'vue-router';
import { useMeta } from "@/modules/vue-meta";
import { onMounted, ref, watch } from "vue";

const $t = i18n.global.t;
const router = useRouter();
const route = useRoute();

useMeta({
  title: i18n.global.t("models.contract.plural").toString()
})

const tabs = ref<TabItem[]>([]);
const filter = ref<ContractStatusFilter>(ContractStatusFilter.ALL);

changeContractsStatus();

onMounted(() => {
  tabs.value = [
    {
      name: $t("shared.all"),
      routePath: "/app/contracts/all"
    },
    {
      name: $t("app.contracts.pending.title"),
      routePath: "/app/contracts/pending"
    },
    {
      name: $t("app.contracts.signed.title"),
      routePath: "/app/contracts/signed"
    },
    {
      name: $t("app.contracts.archived.title"),
      routePath: "/app/contracts/archived"
    },
  ];
  changeContractsStatus();
})
watch(() => route.path, changeContractsStatus)
function changeContractsStatus() {
  if (!route.path.includes("/app/contracts")) {
    return;
  }
  if (!route.params.status) {
    router.push({ path: "/app/contracts/pending" });
  } else {
    switch (route.params.status) {
      case "pending":
        filter.value = ContractStatusFilter.PENDING;
        break;
      case "signed":
        filter.value = ContractStatusFilter.SIGNED;
        break;
      case "archived":
        filter.value = ContractStatusFilter.ARCHIVED;
        break;
      case "all":
        filter.value = ContractStatusFilter.ALL;
        break;
      default:
        router.push({ path: "/app/contracts/pending" });
        break;
    }
  }
}
</script>
