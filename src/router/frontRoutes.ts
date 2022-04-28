import Landing from "@/views/front/Landing.vue";
import Pricing from "@/views/front/Pricing.vue";
import Contact from "@/views/front/Contact.vue";
import PrivacyPolicy from "@/views/front/PrivacyPolicy.vue";
import TermsAndConditions from "@/views/front/TermsAndConditions.vue";

import Login from "@/views/front/account/Login.vue";
import Register from "@/views/front/account/Register.vue";
import Verify from "@/views/front/account/Verify.vue";
import Reset from "@/views/front/account/Reset.vue";
import Forgot from "@/views/front/account/Forgot.vue";
import Invitation from "@/views/front/account/Invitation.vue";
import JoinTenant from "@/views/front/account/JoinTenant.vue";

import Components from "@/views/front/Components.vue";

export default [
  {
    path: "/",
    component: Landing,
  },
  {
    path: "/pricing",
    component: Pricing,
  },
  {
    path: "/contact",
    component: Contact,
  },
  {
    path: "/privacy-policy",
    component: PrivacyPolicy,
  },
  {
    path: "/terms-and-conditions",
    component: TermsAndConditions,
  },
  {
    path: "/login",
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/register",
    component: Register,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/verify",
    component: Verify,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/forgot-password",
    component: Forgot,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/reset",
    component: Reset,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/invitation",
    component: Invitation,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/join/:tenant",
    component: JoinTenant,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/components",
    component: Components,
    meta: {
      requiresAuth: false,
    },
  },
];
