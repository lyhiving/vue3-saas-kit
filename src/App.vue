<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div id="app">
    <TopBanner />
    <metainfo>
      <template
        v-slot:title="{ content }"
      >{{ content ? `${content} | Vue3 SaasFrontend` : 'Vue3 SaasFrontend' }}</template>
    </metainfo>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import store from "./store";
import { Theme } from "./application/enums/shared/Theme";
import TopBanner from "@/components/ui/banners/TopBanner.vue";
import { onMounted } from "@vue/runtime-core";
import { useMeta } from "@/modules/vue-meta";
export default {
  components: {
    TopBanner
  },
  setup() {
    useMeta({
      title: '',
      htmlAttrs: { lang: 'en', amp: true }
    })

    onMounted(() => {
      const theme = store.state?.theme?.theme ?? Theme.LIGHT;
      const htmlClasses = document.querySelector("html")?.classList;
      if (theme === 0) {
        htmlClasses?.remove("dark");
      } else {
        htmlClasses?.add("dark");
      }
    })
  }
}
</script>
