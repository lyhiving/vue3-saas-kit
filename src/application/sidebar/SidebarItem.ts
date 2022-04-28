import { TranslateResult } from "vue-i18n";
import { TenantUserRole } from "../enums/core/tenants/TenantUserRole";
import { UserType } from "../enums/core/users/UserType";
import { SvgIcon } from "../enums/shared/SvgIcon";

export interface SideBarItem {
  title: string | TranslateResult;
  path: string;
  icon?: SvgIcon;
  open?: boolean;
  userTypes?: UserType[];
  userRoles?: TenantUserRole[];
  items?: SideBarItem[];
}
