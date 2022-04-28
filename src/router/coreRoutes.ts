import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import appRoutes from "./appRoutes";

import Index from "@/views/core/Index.vue";
import Dashboard from "@/views/core/Dashboard.vue";
import Unauthorized from "@/views/core/Unauthorized.vue";
import Settings from "@/views/core/settings/Index.vue";
import Profile from "@/views/core/settings/Profile.vue";
import Workspaces from "@/views/core/settings/Workspaces.vue";
import NewWorkspace from "@/components/core/workspaces/NewWorkspace.vue";
import EditWorkspace from "@/components/core/workspaces/EditWorkspace.vue";
import Members from "@/views/core/settings/Members.vue";
import NewMember from "@/components/core/settings/members/NewMember.vue";
import EditMember from "@/components/core/settings/members/EditMember.vue";
import MySubscription from "@/components/core/settings/subscription/MySubscription.vue";
import Tenant from "@/views/core/settings/Tenant.vue";
import Links from "@/views/core/links/Index.vue";
import AllLinksList from "@/components/app/links/all/AllLinksList.vue";
import PendingLinksList from "@/components/app/links/pending/PendingLinksList.vue";
import ProvidersList from "@/components/app/links/providers/ProvidersList.vue";
import ClientsList from "@/components/app/links/clients/ClientsList.vue";
import Link from "@/views/core/links/Link.vue";

export const appCoreRoutes = {
  path: "/app",
  component: Index,
  meta: {
    requiresAuth: true,
  },
  redirect: "/app/dashboard",
  children: [
    {
      path: "dashboard",
      component: Dashboard,
      meta: {
        roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER],
      },
    },
    {
      path: "unauthorized",
      component: Unauthorized,
    },
    {
      path: "settings",
      component: Settings,
      redirect: "settings/profile",
      children: [
        {
          path: "profile",
          component: Profile,
        },
        {
          path: "workspaces",
          component: Workspaces,
          meta: {
            requiresAuth: true,
            roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
          },
          children: [
            {
              path: "new",
              component: NewWorkspace,
              meta: {
                roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
              },
            },
            {
              path: "edit/:id",
              component: EditWorkspace,
              meta: {
                roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
              },
            },
          ],
        },
        {
          path: "members",
          component: Members,
          meta: {
            roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
          },
          children: [
            {
              path: "new",
              component: NewMember,
              meta: {
                roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
              },
            },
            {
              path: "edit/:id",
              component: EditMember,
              meta: {
                roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
              },
            },
          ],
        },
        {
          path: "subscription",
          component: MySubscription,
          meta: {
            roles: [TenantUserRole.OWNER],
          },
        },
        {
          path: "tenant",
          component: Tenant,
          meta: {
            roles: [TenantUserRole.OWNER],
          },
        },
      ],
    },
    {
      path: "links",
      component: Links,
      meta: {
        roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
      },
      children: [
        {
          path: "all",
          component: AllLinksList,
        },
        {
          path: "pending",
          component: PendingLinksList,
        },
        {
          path: "providers",
          component: ProvidersList,
        },
        {
          path: "clients",
          component: ClientsList,
        },
      ],
    },
    {
      path: "link/:id",
      component: Link,
      meta: {
        roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
      },
    },
    ...appRoutes,
  ],
};
