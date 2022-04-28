import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import store from "@/store";
import i18n from "@/locale/i18n";

const apiUrl = import.meta.env.VITE_VUE_APP_SERVER_URL?.toString() + "api";
const config: AxiosRequestConfig = {
  baseURL: apiUrl,
};
const server: AxiosInstance = axios.create(config);

server.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

server.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.status === 401) {
      store.commit("auth/logout");
      return;
    }
    if (error.response?.data) {
      return Promise.reject(i18n.global.t(error.response.data));
    } else if (error.message) {
      return Promise.reject(i18n.global.t(error.message));
    } else {
      return Promise.reject(i18n.global.t(error));
    }
  }
);

server.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (!config.headers) {
      return config;
    }
    if (store.state.tenant.current) {
      config.headers.common["X-Tenant-Key"] = store.state.tenant.current.uuid;
    }
    if (store.state.tenant.currentWorkspace) {
      config.headers.common["X-Workspace-Id"] = store.state.tenant.currentWorkspace.id;
    }
    const authToken = store.state.auth.token;
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default server;
