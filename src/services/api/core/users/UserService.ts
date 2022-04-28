import store from "@/store";
import { ApiService } from "@/services/api/ApiService";
import { UserDto } from "@/application/dtos/core/users/UserDto";
import { UserUpdateRequest } from "@/application/contracts/core/users/UserUpdateRequest";
import { UserUpdatePasswordRequest } from "@/application/contracts/core/users/UserUpdatePasswordRequest";
import { UserUpdateAvatarRequest } from "@/application/contracts/core/users/UserUpdateAvatarRequest";
import { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import { UserUpdateLocaleRequest } from "@/application/contracts/core/users/UserUpdateLocaleRequest";
import { IUserService } from "./IUserService";

export class UserService extends ApiService implements IUserService {
  constructor() {
    super("User");
  }
  adminGetAll(): Promise<UserDto[]> {
    return super.getAll("Admin/GetAll");
  }
  get(id: string): Promise<UserDto> {
    return super.get("Get", id);
  }
  updateAvatar(avatar: UserUpdateAvatarRequest): Promise<UserDto> {
    return new Promise((resolve, reject) => {
      super
        .post(avatar, "UpdateAvatar")
        .then((response: UserDto) => {
          store.commit("account/setLogged", response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  updateLocale(payload: UserUpdateLocaleRequest): Promise<any> {
    return super.post(payload, `UpdateLocale`);
  }
  update(id: string, payload: UserUpdateRequest): Promise<UserDto> {
    return new Promise((resolve, reject) => {
      super
        .put(id, payload)
        .then((response: UserDto) => {
          store.commit("account/setLogged", response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  updatePassword(payload: UserUpdatePasswordRequest): Promise<any> {
    return super.post(payload, "UpdatePassword");
  }
  adminUpdatePassword(userId: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      super
        .post(null, `Admin/UpdatePassword/${userId}/${password}`)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  updateDefaultTenant(tenantId?: string): Promise<UserLoggedResponse> {
    const userId = store.state.account.user?.id ?? "";
    return new Promise((resolve, reject) => {
      super
        .post(null, `UpdateDefaultTenant/${userId}/${tenantId}`)
        .then((response: UserLoggedResponse) => {
          store.commit("auth/login", response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  deleteMe(): Promise<void> {
    return new Promise((resolve, reject) => {
      super
        .delete("", "DeleteMe")
        .then((response) => {
          store.commit("auth/logout");
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  adminDelete(id: string): Promise<void> {
    return super.delete(id, "Admin/Delete");
  }
}
