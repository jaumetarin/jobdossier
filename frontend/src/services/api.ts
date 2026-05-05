import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { clearToken, getToken } from './auth';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

export const navigation = {
  goToLogin() {
    window.location.href = '/login';
  },
};

export function attachAuthHeader(config: InternalAxiosRequestConfig) {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

export function handleAuthError(error: { response?: { status?: number } }) {
  if (error.response?.status === 401) {
    clearToken();
    navigation.goToLogin();
  }

  return Promise.reject(error);
}

api.interceptors.request.use(attachAuthHeader);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  handleAuthError,
);
