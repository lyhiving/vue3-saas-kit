import { createI18n } from "vue-i18n";

import en from "./en-US.json";
import es from "./es-MX.json";

const locale = localStorage.getItem("locale") ?? import.meta.env.VITE_VUE_APP_LANGUAGE?.toString();
export default createI18n({
  locale,
  fallbackLocale: locale,
  messages: {
    en,
    es,
  },
  globalInjection: true,
  silentFallbackWarn: true,
  fallbackWarn: false,
  warnHtmlInMessage: false,
  warnHtmlMessage: false,
  missingWarn: false,
});
