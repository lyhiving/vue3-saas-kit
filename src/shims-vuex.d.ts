import { Store } from "vuex";
import { RootState } from "./store/types";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<RootState>;
  }
}
