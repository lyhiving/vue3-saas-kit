<template>
  <div>
    <Breadcrumb
      :menu="[{
        title: $t('app.contracts.title'), routePath: '/app/contracts/pending'
      }]"
    ></Breadcrumb>
    <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8">
      <ContractDetails :id="id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.vue";
import ContractDetails from "@/components/app/contracts/ContractDetails.vue";
import i18n from '@/locale/i18n';
import { useRoute } from 'vue-router';
import { useMeta } from "@/modules/vue-meta";
import { ref } from "vue";

const $t = i18n.global.t;
const route = useRoute();

useMeta({
  title: i18n.global.t("models.contract.object").toString()
})

const id = ref(route.params.id.toString());
</script>
