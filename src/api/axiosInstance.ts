import axios from "axios";
import { apiUrls } from "../properties";

let logoutHandler: (() => void) | null = null;

const axiosInstance = axios.create({
  baseURL: apiUrls.BASEURL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && logoutHandler) {
      logoutHandler();
    }
    return Promise.reject(error);
  }
);

export const setLogoutHandler = (handler: () => void) => {
  logoutHandler = handler;
};

export default axiosInstance;
