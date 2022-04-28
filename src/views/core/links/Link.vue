<template>
  <div>
    <Breadcrumb :menu="[{ title: $t('models.link.plural'), routePath: '/app/links/all' }]"></Breadcrumb>
    <LinkProfile :id="id" />
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.vue";
import LinkProfile from "@/components/app/links/all/LinkProfile.vue"
import i18n from '@/locale/i18n';
import { useRoute } from 'vue-router';
import { useMeta } from "@/modules/vue-meta";
import { ref } from "vue";

useMeta({
  title: i18n.global.t("models.link.object").toString(),
})

const route = useRoute();

const id = ref("")

id.value = route.params.id.toString();
</script>
