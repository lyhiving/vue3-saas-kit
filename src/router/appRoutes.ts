import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";

import Contracts from "@/views/app/contracts/Index.vue";
import NewContract from "@/views/app/contracts/NewContract.vue";
import Contract from "@/views/app/contracts/Contract.vue";
import Employees from "@/views/app/employees/Index.vue";
import NewEmployees from "@/views/app/employees/NewEmployees.vue";
import Employee from "@/views/app/employees/Employee.vue";

export default [
  {
    path: "contracts/:status?",
    component: Contracts,
    meta: {
      roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER, TenantUserRole.GUEST],
    },
  },
  {
    path: "contract/new",
    component: NewContract,
    meta: {
      roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER],
    },
  },
  {
    path: "contract/:id",
    component: Contract,
    meta: {
      roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER],
    },
  },
  {
    path: "employees",
    component: Employees,
    meta: {
      roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER],
    },
  },
  {
    path: "employees/new",
    component: NewEmployees,
    meta: {
      roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER],
    },
  },
  {
    path: "employee/:id",
    component: Employee,
    meta: {
      roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER],
    },
  },
];
