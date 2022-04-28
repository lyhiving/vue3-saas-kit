import { createStore, createLogger } from "vuex";
import createPersistedState from "vuex-persistedstate";

// Modules
import { account } from "./modules/accountState";
import { auth } from "./modules/authState";
import { tenant } from "./modules/tenantState";
import { pricing } from "./modules/pricingState";
import { theme } from "./modules/themeState";
import { app } from "./modules/appState";
import { RootState } from "@/store/types";

const debug = import.meta.env.NODE_ENV !== "production";

export const store = createStore<RootState>({
  modules: {
    account,
    auth,
    tenant,
    pricing,
    theme,
    app,
  },
  strict: debug,
  plugins: debug ? [createPersistedState(), createLogger()] : [createPersistedState()],
});

export default store;
