<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div v-if="open" class="bg-slate-900 border-b-2 border-yellow-500 shadow-2xl">
    <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
      <div class="w-full lg:w-auto lg:justify-end flex items-center space-x-3">
        <div class="flex-grow">
          <div class="flex sm:hidden">
            <div class="w-full">
              <select
                id="framework-or-library"
                name="framework-or-library"
                class="bg-slate-800 text-slate-400 block w-full pl-3 pr-10 py-2 text-base border-gray-700 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
                @change="updateRoute"
              >
                <option :value="0">Vue2</option>
                <option selected :value="1">Vue3</option>
                <option :value="2">React</option>
                <option :value="3">Svelte</option>
              </select>
            </div>
          </div>
          <div class="hidden sm:flex font-extrabold items-center space-x-1">
            <a
              :href="getRouteInVue2()"
              class="w-16 text-center border border-transparent rounded-md px-1 py-1 font-extrabold shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500 hover:bg-slate-800 text-slate-400"
            >Vue2</a>
            <div
              class="w-16 text-center border border-transparent rounded-md px-1 py-1 font-extrabold shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-teal-800 bg-teal-100 border-teal-100 select-none"
            >Vue3</div>
            <a
              :href="getRouteInReact()"
              class="w-16 text-center border border-transparent rounded-md px-1 py-1 font-extrabold shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500 hover:bg-slate-800 text-slate-400"
            >React</a>
            <a
              :href="getRouteInSvelte()"
              class="w-16 text-center border border-transparent rounded-md px-1 py-1 font-extrabold shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500 hover:bg-slate-800 text-slate-400"
            >Svelte</a>
          </div>
        </div>
        <div class="hidden md:flex items-center truncate">
          <div class="flex items-center space-x-2 truncate">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="24"
              height="24"
              viewBox="0 0 172 172"
              class="h-6 w-6"
            >
              <g
                fill="none"
                fill-rule="nonzero"
                stroke="none"
                stroke-width="1"
                stroke-linecap="butt"
                stroke-linejoin="miter"
                stroke-miterlimit="10"
                stroke-dashoffset="0"
                font-family="none"
                font-weight="none"
                font-size="none"
                text-anchor="none"
                style="mix-blend-mode: normal"
              >
                <path d="M0,172v-172h172v172z" fill="none" />
                <g>
                  <path d="M7.353,168.89683l-0.00717,-0.05733l-0.00717,-0.0215z" fill="#000000" />
                  <path
                    d="M0,11.83217l86,148.34283l86,-148.34283h-34.4l-51.6,89.00283l-52.03,-89.00283z"
                    fill="#41b883"
                  />
                  <path
                    d="M33.97,11.83217l52.03,89.43283l51.6,-89.43283h-31.82l-19.78,34.39283l-20.21,-34.39283z"
                    fill="#35495e"
                  />
                  <path d="M33.97,11.83217h-33.97l86,148.34283v-58.91z" fill="#39a072" />
                  <path d="M65.79,11.83217h-31.82l52.03,89.43283v-55.04z" fill="#2e4052" />
                </g>
              </g>
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              class="h-9"
              viewBox="-5 -15 60 60"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M25.517 0C18.712 0 14.46 3.382 12.758 10.146c2.552-3.382 5.529-4.65 8.931-3.805 1.941.482 3.329 1.882 4.864 3.432 2.502 2.524 5.398 5.445 11.722 5.445 6.804 0 11.057-3.382 12.758-10.145-2.551 3.382-5.528 4.65-8.93 3.804-1.942-.482-3.33-1.882-4.865-3.431C34.736 2.92 31.841 0 25.517 0zM12.758 15.218C5.954 15.218 1.701 18.6 0 25.364c2.552-3.382 5.529-4.65 8.93-3.805 1.942.482 3.33 1.882 4.865 3.432 2.502 2.524 5.397 5.445 11.722 5.445 6.804 0 11.057-3.381 12.758-10.145-2.552 3.382-5.529 4.65-8.931 3.805-1.941-.483-3.329-1.883-4.864-3.432-2.502-2.524-5.398-5.446-11.722-5.446z"
                fill="#38bdf8"
              />
            </svg>
            <svg
              class="h-6 w-6 bg-white"
              style="color: #5027d5"
              xmlns="http://www.w3.org/2000/svg"
              width="1216"
              height="1216"
              viewBox="0 0 912 912"
            >
              <path
                fill="currentColor"
                d="M0 456v456h912V0H0v456zm326.2-23c31.2 49.8 57.2 91.2 57.8 92 .9 1.2.9 1.1.3-.5-.4-1.1-.9-42.6-1.1-92.3l-.3-90.2H421v237h-42.8l-55.3-87.3c-30.4-47.9-57.1-90.4-59.2-94.2-2.1-3.9-3.5-6.1-3.1-5 .4 1.1.9 43.5 1.2 94.2l.4 92.3H224V342l22.7.2 22.7.3 56.8 90.5zm269.6-74.3-.3 16.8-42.7.3-42.8.2v66h79v34h-79v70h91v33H471V342h125l-.2 16.7zm190 0-.3 16.8-33.2.3-33.3.2v203h-39V376l-32.7-.2-32.8-.3-.3-16.8-.2-16.7h172l-.2 16.7zM170.1 539c4.8 1.3 11.8 7.5 14 12.4 3.5 7.8 1.9 17.8-3.9 23.9-4.8 5.1-9.9 7.1-17.8 7.2-6.1 0-7.7-.4-12-3-7.1-4.4-10.9-11-10.9-18.9.2-15.7 14.7-26 30.6-21.6z"
              />
            </svg>
          </div>
        </div>
        <div class="flex-shrink-0 order-2 mt-0 w-auto">
          <a
            href="https://saasfrontends.com/docs/editions?framework=vue3&subdomain=sandbox"
            class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm sm:text-sm font-medium text-yellow-900 bg-yellow-400 hover:bg-yellow-500"
          >
            Get
            <span class="hidden sm:block sm:mx-1">sandbox</span> codebase!
          </a>
        </div>
        <div class="flex-shrink-0 order-3 ml-2">
          <button
            type="button"
            @click="open = false"
            class="-mr-1 flex p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-400 sm:-mr-2"
          >
            <span class="sr-only">{{ $t("shared.close") }}</span>
            <svg
              class="h-6 w-6 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const router = useRoute();
const open = ref(true);
const getRoute = (item, path) => {
  let host = "";
  switch (item) {
    case 0:
      host = "https://sandbox.vue2.saasfrontends.com";
      break;
    case 1:
      host = "https://PRODUCT_URL";
      break;
    case 2:
      host = "https://sandbox.react.saasfrontends.com";
      break;
    case 3:
      host = "https://sandbox.svelte.saasfrontends.com";
      break;
  }
  if (path !== undefined) {
    host += path;
  }
  return host;
}
const updateRoute = (e) => {
  window.location.replace(getRoute(e.target.value, router.path));
}
const getRouteInVue2 = () => {
  console.log("getRouteInVue2", router.path)
  return getRoute(0, router.path)
}
const getRouteInReact = () => {
  return getRoute(2, router.path)
}
const getRouteInSvelte = () => {
  return getRoute(3, router.path)
}
</script>