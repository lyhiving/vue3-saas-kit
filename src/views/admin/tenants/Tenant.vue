<template>
  <div>
    <Breadcrumb
      home="/admin"
      :menu="[{ title: $t('models.tenant.plural'), routePath: '/admin/tenants' }]"
    ></Breadcrumb>
    <div class="bg-white shadow-sm border-b border-gray-300 w-full py-3 px-8 h-13">
      <div class="mx-auto max-w-5xl xl:max-w-7xl flex items-center justify-between">
        <Tabs :asLinks="false" :tabs="tabs" @selected="selectedTab" class="flex-grow" />
      </div>
    </div>
    <div>
      <TenantProfile v-if="selected === 0" :id="id" />
      <TenantSubscription v-if="selected === 1" :id="id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.vue";
import Tabs, { TabItem } from "@/components/ui/tabs/Tabs.vue"
import TenantProfile from "@/components/core/tenants/TenantProfile.vue"
import TenantSubscription from "@/components/core/tenants/TenantSubscription.vue"
import i18n from '@/locale/i18n';
import { useMeta } from "@/modules/vue-meta";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const $t = i18n.global.t;
const route = useRoute();

useMeta({
  title: $t("models.tenant.object").toString(),
})

const tabs = ref<TabItem[]>([]);
const selected = ref(0);
const id = route.params.id.toString();

onMounted(() => {
  tabs.value = [
    {
      name: $t("admin.tenants.profile.title"),
    },
    {
      name: $t("admin.tenants.subscription.title"),
    },
  ];
})
function selectedTab(idx) {
  selected.value = Number(idx);
}
</script>
