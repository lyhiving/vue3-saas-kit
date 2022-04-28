import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/index.css";
import "./registerServiceWorker";
import router from "./router";
import store from "@/store";
import i18n from "@/locale/i18n";
import { createMetaManager } from "@/modules/vue-meta";
import vClickOutside from "click-outside-vue3";
import setLogger from "@/plugins/logging";

const app = createApp(App);
setLogger(app, router);
app.use(router).use(store).use(i18n);
app.use(createMetaManager());
app.use(vClickOutside);
app.mount("#app");
