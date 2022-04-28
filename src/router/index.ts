import { createWebHistory, createRouter } from "vue-router";

import store from "@/store";
import { UserType } from "@/application/enums/core/users/UserType";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import frontRoutes from "./frontRoutes";
import { appCoreRoutes } from "./coreRoutes";
import { adminRoutes } from "./adminRoutes";

const routes: any[] = [
  // {
  //   path: "/:catchAll(.*)",
  //   redirect: "/",
  // },
  ...frontRoutes,
  appCoreRoutes,
  adminRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, _from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.state.auth.authenticated) {
      const redirect = to.query.redirect ? "" : to.fullPath;
      next("/login?redirect=" + redirect);
      return;
    }
  }

  const userTypesAllowed = to.meta?.userTypes as UserType[];
  if (to.matched.some((record) => record.meta && record.meta.userTypes) && userTypesAllowed) {
    const currentType = store.state.account.user?.type as UserType;
    if (!userTypesAllowed.some((f) => f === currentType)) {
      next("/app/unauthorized");
      return;
    }
  }

  const rolesAllowed = to.meta?.roles as TenantUserRole[];
  if (to.matched.some((record) => record.meta && record.meta.roles) && rolesAllowed) {
    const currentRole = store.state.tenant.current?.currentUser.role as TenantUserRole;
    if (!rolesAllowed.some((f) => f === currentRole)) {
      next("/app/unauthorized");
      return;
    }
  }

  // const productsAllowed = to.meta?.subscriptions as SubscriptionProductDto[];
  // if (to.matched.some((record) => record.meta && record.meta.subscriptions) && productsAllowed) {
  //   const currentProduct = store.state.tenant.subscription?.activeProduct as TenantProductDto | undefined;
  //   if (!currentProduct || !productsAllowed.some((f) => f.tier === currentProduct.subscriptionProduct.tier)) {
  //     next("/app/unauthorized");
  //     return;
  //   }
  // }

  next();
});
export default router;
