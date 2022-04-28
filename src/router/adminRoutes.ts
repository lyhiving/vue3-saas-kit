import { UserType } from "@/application/enums/core/users/UserType";

import Index from "@/views/admin/Index.vue";
import Tenants from "@/views/admin/tenants/Index.vue";
import Tenant from "@/views/admin/tenants/Tenant.vue";
import Users from "@/views/admin/Users.vue";
import Pricing from "@/views/admin/Pricing.vue";
import Emails from "@/views/admin/Emails.vue";
import Navigation from "@/views/admin/Navigation.vue";
import Components from "@/views/admin/Components.vue";

export const adminRoutes = {
  path: "/admin",
  component: Index,
  meta: {
    requiresAuth: true,
    userTypes: [UserType.Admin],
  },
  redirect: "/admin/tenants",
  children: [
    {
      path: "tenants",
      component: Tenants,
    },
    {
      path: "tenant/:id",
      component: Tenant,
    },
    {
      path: "users",
      component: Users,
    },
    {
      path: "pricing",
      component: Pricing,
    },
    {
      path: "emails",
      component: Emails,
    },
    {
      path: "navigation",
      component: Navigation,
    },
    {
      path: "components",
      component: Components,
    },
  ],
};
