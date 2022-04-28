import { Module } from "vuex";
import { AccountState, RootState } from "@/store/types";
import { UserDto } from "@/application/dtos/core/users/UserDto";

const initialState: AccountState = {
  user: null,
};

export const account: Module<AccountState, RootState> = {
  namespaced: true,
  state: initialState,
  mutations: {
    reset(state: AccountState) {
      state.user = initialState.user;
    },
    setLogged(state: AccountState, user: UserDto) {
      state.user = user;
    },
    setAvatar(state: AccountState, avatar: string) {
      if (state.user) {
        state.user.avatar = avatar;
      }
    },
  },
};
