import { Module } from "vuex";
import { Theme } from "@/application/enums/shared/Theme";
import { RootState, ThemeState } from "@/store/types";

const initialState: ThemeState = {
  theme: Theme.LIGHT,
};
export const theme: Module<ThemeState, RootState> = {
  namespaced: true,
  state: initialState,
  mutations: {
    reset(state: ThemeState) {
      state.theme = initialState.theme;
      const htmlClasses = document.querySelector("html")?.classList;
      htmlClasses?.remove("dark");
    },
    setTheme(state: ThemeState, payload: number) {
      state.theme = payload;
      const htmlClasses = document.querySelector("html")?.classList;
      if (payload === 0) {
        htmlClasses?.remove("dark");
      } else {
        htmlClasses?.add("dark");
      }
    },
  },
};
