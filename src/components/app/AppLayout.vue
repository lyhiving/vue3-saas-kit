<template>
  <div>
    <StackedLayout v-if="currentLayout === 1" :layout="layout" @addTenant="addingTenant = true">
      <div>
        <router-view :key="currentWorkspaceId"></router-view>
      </div>
    </StackedLayout>
    <SidebarLayout v-else :layout="layout" @addTenant="addingTenant = true">
      <div>
        <router-view :key="currentWorkspaceId"></router-view>
      </div>
    </SidebarLayout>

    <TenantNew v-if="addingTenant" @close="addingTenant = false" />
    <NewLink ref="newLink" :as-provider="false" :select-type="false" />
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script setup lang="ts">
import SidebarLayout from "@/components/layouts/SidebarLayout.vue";
import StackedLayout from "@/components/layouts/StackedLayout.vue";
import store from "@/store";
import { ApplicationLayout } from "@/application/enums/shared/ApplicationLayout";
import tinyEventBus from "@/plugins/tinyEventBus";
import services from '@/services';
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import TenantNew from "@/components/core/settings/tenant/TenantNew.vue";
import NewLink from "@/components/app/links/pending/NewLink.vue";
import { useRouter } from 'vue-router';
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import i18n from "@/locale/i18n";

const $t = i18n.global.t;
const router = useRouter();

defineProps({
  layout: String
})

const newLink = ref<InstanceType<typeof NewLink>>();
const errorModal = ref<InstanceType<typeof ErrorModal>>();
const addingTenant = ref(false);

onMounted(() => {
  services.tenants.getAll();
  services.workspaces.getAllWorkspaces(true)
    .then((response) => {
      if (response.length === 0) {
        errorModal.value?.show($t("app.workspaces.errors.noWorkspaces"), $t("app.workspaces.errors.addAtLeastOneWorkspace"))
        router.push("/app/settings/workspaces")
      }
    });

  tinyEventBus().emitter.on("view-pending-invitations", () => {
    router.push("/app/links/pending");
  });
  tinyEventBus().emitter.on("new-provider", () => {
    newLink.value?.show(false, false);
  });
  tinyEventBus().emitter.on("new-client", () => {
    newLink.value?.show(true, false);
  });
  tinyEventBus().emitter.on("new-link", () => {
    newLink.value?.show(true, true);
  });
})

onBeforeUnmount(() => {
  tinyEventBus().emitter.off("view-pending-invitations");
  tinyEventBus().emitter.off("view-pending-links");
  tinyEventBus().emitter.off("view-links-information");
  tinyEventBus().emitter.off("new-provider");
  tinyEventBus().emitter.off("new-client");
  tinyEventBus().emitter.off("new-link");
})

const currentWorkspaceId = computed((): string => {
  return store.state.tenant.currentWorkspace?.id ?? "";
})
const currentLayout = computed((): ApplicationLayout => {
  return store.state.app.layout;
})
</script>
