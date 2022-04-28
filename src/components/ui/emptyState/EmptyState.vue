<template>
  <div>
    <div class="text-center border-2 border-dashed border-gray-200 py-16 px-1.6">
      <IconEmptyResults class="mx-auto w-10" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">{{ captions.thereAreNo }}</h3>
      <p class="mt-1 text-sm text-gray-500">{{ captions.description }}</p>
      <div class="mt-6" v-if="captions.new">
        <ButtonSecondary v-if="to" :to="to">
          <svg
            v-if="icon === 'plus'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <svg
            v-if="icon === 'refresh'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <div>{{ captions.new }}</div>
        </ButtonSecondary>
        <ButtonSecondary
          v-else-if="captions.routeName"
          :to="{ name: captions.routeName, params: captions.routeParams }"
        >
          <svg
            v-if="icon === 'plus'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <div>{{ captions.new }}</div>
        </ButtonSecondary>
        <ButtonSecondary v-else @click="$emit('new')" type="button">
          <div>
            <svg
              v-if="icon === 'plus'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <div>{{ captions.new }}</div>
        </ButtonSecondary>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import IconEmptyResults from "@/assets/icons/IconEmptyResults.vue"
import ButtonSecondary from "../buttons/ButtonSecondary.vue";

interface Captions {
  description?: string;
  thereAreNo?: string;
  new?: string;
  routeName?: string;
  routeParams?: any;
}

export default defineComponent({
  components: {
    IconEmptyResults,
    ButtonSecondary
  },
  props: {
    captions: {
      required: true,
      type: Object as PropType<Captions>
    },
    to: null,
    icon: String,
  }
})
</script>
