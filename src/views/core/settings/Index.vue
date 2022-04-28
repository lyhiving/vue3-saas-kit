<template>
  <div>
    <div class="bg-white shadow-sm border-b border-gray-300 w-full py-2">
      <div
        class="mx-auto max-w-5xl xl:max-w-7xl flex space-x-3 items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Tabs :tabs="tabs" class="flex-grow" />
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import Tabs, { TabItem } from "@/components/ui/tabs/Tabs.vue"
import i18n from '@/locale/i18n';
import { onMounted, ref } from "vue";
import { useMeta } from "@/modules/vue-meta";
import { useRoute, useRouter } from 'vue-router';

const $t = i18n.global.t;
const router = useRouter();
const route = useRoute();

useMeta({
  title: i18n.global.t("app.navbar.settings").toString()
})

const tabs = ref<TabItem[]>([]);

onMounted(() => {
  if (route.name?.toString() === "settings") {
    router.push("/app/settings/profile");
  }
  tabs.value = [
    {
      name: $t("settings.profile.profileTitle"),
      routePath: "/app/settings/profile",
    },
    {
      name: $t("models.workspace.plural"),
      routePath: "/app/settings/workspaces",
    },
    {
      name: $t("settings.members.title"),
      routePath: "/app/settings/members",
    },
    {
      name: $t("settings.subscription.title"),
      routePath: "/app/settings/subscription",
    },
    {
      name: $t("settings.tenant.title"),
      routePath: "/app/settings/tenant",
    },
  ];
})
</script>
