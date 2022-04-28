<template>
  <!-- https://v3.vuejs.org/guide/component-attrs.html#disabling-attribute-inheritance -->
  <!-- Core -->
  <IconAdmin :class="$attrs.class" v-if="icon === 0" />
  <IconTenants :class="$attrs.class" v-else-if="icon === 1" />
  <IconUsers :class="$attrs.class" v-else-if="icon === 2" />
  <IconPricing :class="$attrs.class" v-else-if="icon === 3" />
  <IconEmails :class="$attrs.class" v-else-if="icon === 4" />
  <IconNavigation :class="$attrs.class" v-else-if="icon === 5" />
  <IconComponents :class="$attrs.class" v-else-if="icon === 6" />
  <IconApp :class="$attrs.class" v-else-if="icon === 7" />
  <IconDashboard :class="$attrs.class" v-else-if="icon === 8" />
  <IconSettings :class="$attrs.class" v-else-if="icon === 9" />

  <!-- :class="$attrs.class" App -->
  <IconLinks :class="$attrs.class" v-else-if="icon === 10" />
  <IconProviders :class="$attrs.class" v-else-if="icon === 11" />
  <IconClients :class="$attrs.class" v-else-if="icon === 12" />
  <IconContracts :class="$attrs.class" v-else-if="icon === 13" />
  <IconEmployees :class="$attrs.class" v-else-if="icon === 14" />
</template>

<script setup lang="ts">
import { SvgIcon } from '@/application/enums/shared/SvgIcon';

import IconAdmin from "./IconAdmin.vue";
import IconTenants from "./IconTenants.vue";
import IconUsers from "./IconUsers.vue";
import IconPricing from "./IconPricing.vue";
import IconNavigation from "./IconNavigation.vue";
import IconComponents from "./IconComponents.vue";

import IconApp from "./IconApp.vue";
import IconDashboard from "./IconDashboard.vue";
import IconSettings from "./IconSettings.vue";
import IconLinks from "./IconLinks.vue";
import IconProviders from "./IconProviders.vue";
import IconClients from "./IconClients.vue";
import IconContracts from "./IconContracts.vue";
import IconEmployees from "./IconEmployees.vue";
import { PropType } from 'vue';
import IconEmails from './IconEmails.vue';

defineProps({
  icon: Number as PropType<SvgIcon>,
})

</script>
