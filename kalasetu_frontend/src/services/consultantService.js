import { consultantAPI } from '../api/consultant';

export const consultantService = {
  async getPendingProducts() {
    const response = await consultantAPI.getPendingProducts();
    return response.data?.results || response.data;
  },

  async verifyProduct(productId, data) {
    const response = await consultantAPI.verifyProduct(productId, data);
    return response.data;
  },
};
