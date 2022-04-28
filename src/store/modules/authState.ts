import store from "@/store";
import router from "@/router";
import { Module } from "vuex";
import { UserDto } from "@/application/dtos/core/users/UserDto";
import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import { UserType } from "@/application/enums/core/users/UserType";
import i18n from "@/locale/i18n";
import { AuthState, RootState } from "../types";

const initialState: AuthState = {
  authenticated: false,
  token: "",
};

export const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state: initialState,
  mutations: {
    login: (state: AuthState, payload: UserLoggedResponse) => {
      state.authenticated = true;
      state.token = payload.token;

      const tenants = payload.user.tenants.map((f) => f.tenant);
      const currentTenant = payload.user.currentTenant;
      store.commit("account/setLogged", payload.user);
      store.commit("tenant/setMyTenants", tenants);
      store.commit("tenant/setCurrent", currentTenant);
      if (payload.user.locale) {
        localStorage.setItem("locale", payload.user.locale);
        // @ts-ignore
        i18n.global.locale = payload.user.locale ?? "en";
      }
      store.commit("tenant/setCurrentWorkspace", payload.defaultWorkspace);

      try {
        // Google Analytics

        // @ts-ignore
        if (window.analytics) {
          // @ts-ignore
          window.analytics.identify(payload.user.username, {
            email: payload.user.email,
            firstName: payload.user.firstName,
            lastName: payload.user.lastName,
            tenant: payload.user.currentTenant,
          });
        }
        // if (mixpanel) {
        //   try {
        //     mixpanel.identify(payload.user.id);
        //     if (mixpanel.people) {
        //       mixpanel.people.set({
        //         USER_ID: payload.user.id,
        //         $email: payload.user.email,
        //         "First name": payload.user.firstName,
        //         "Last name": payload.user.lastName,
        //       });
        //     }
        //     mixpanel.track("Login");
        //   } catch (ex) {
        //     // ignore
        //   }
        // }
        // if (LogRocket) {
        //   LogRocket.identify(payload.user.email, {
        //     username: payload.user.username,
        //     firstName: payload.user.firstName,
        //     lastName: payload.user.lastName,
        //     email: payload.user.email,
        //     subscriptionCustomerId:
        //       payload.user.currentTenant?.subscriptionCustomerId ?? "",
        //     subscriptionPlanId:
        //       payload.user.currentTenant?.subscriptionPlanId ?? "",
        //   });
        // }
      } catch (ex) {
        // ignore
      }

      if (router.currentRoute.value.query.redirect) {
        router.push(router.currentRoute.value.query.redirect.toString());
      } else {
        if ((payload.user as UserDto).type === UserType.Admin && import.meta.env.VITE_VUE_APP_SERVICE !== "sandbox") {
          router.push("/admin");
        } else {
          router.push("/app/dashboard");
        }
      }
    },
    logout: (state: AuthState) => {
      state.authenticated = false;
      state.token = "";

      store.commit("account/reset");
      store.commit("pricing/reset");
      store.commit("tenant/reset");
      store.commit("app/reset");

      localStorage.clear();
      router.push("/");
    },
  },
};
