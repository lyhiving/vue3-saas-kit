<template>
  <router-link to="/">
    <img
      v-if="$store.state.theme.theme === 0"
      class="mx-auto"
      :class="[size]"
      src="@/assets/img/logo-light.png"
      alt="Logo"
    />
    <img v-else class="mx-auto" :class="[size]" src="@/assets/img/logo-dark.png" alt="Logo" />
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: 'Logo',
  props: {
    size: {
      type: String,
      default: 'h-9 w-auto'
    }
  }
})
</script>
