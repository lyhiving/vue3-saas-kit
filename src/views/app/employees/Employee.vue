<template>
  <div>
    <Breadcrumb :menu="[{ title: $t('models.employee.plural'), routePath: '/app/employees' }]"></Breadcrumb>
    <EmployeeProfile :id="id" />
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from "@/components/ui/breadcrumbs/Breadcrumb.vue";
import EmployeeProfile from "@/components/app/employees/EmployeeProfile.vue";
import i18n from "@/locale/i18n";
import { useMeta } from "@/modules/vue-meta";
import { useRoute } from "vue-router";
import { ref } from "vue";

useMeta({
  title: i18n.global.t("models.employee.object").toString()
})

const id = ref("");

const route = useRoute();

id.value = route.params.id.toString();

</script>
