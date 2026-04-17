import { authAPI } from '../api/auth';
import { storage } from '../utils/storage';

export const authService = {
  async register(payload) {
    const response = await authAPI.register(payload);
    return response.data;
  },

  async login(email, password, captchaToken) {
    const response = await authAPI.login(email, password, captchaToken);
    const { access, refresh } = response.data;

    storage.setAccessToken(access);
    storage.setRefreshToken(refresh);

    return response.data;
  },

  async getCurrentUser() {
    const response = await authAPI.getCurrentUser();
    return response.data;
  },

  async updateProfile(data) {
    const response = await authAPI.updateProfile(data);
    return response.data;
  },

  logout() {
    storage.clearAuth();
  },
};
