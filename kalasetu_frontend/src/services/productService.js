import { productsAPI } from '../api/products';

export const productService = {
  async getProducts(page = 1) {
    const response = await productsAPI.getProducts(page);
    return response.data;
  },

  async getProduct(id) {
    const response = await productsAPI.getProduct(id);
    return response.data;
  },

  async getMyProducts() {
    const response = await productsAPI.getMyProducts();
    return response.data?.results || response.data;
  },

  async createProduct(data) {
    const response = await productsAPI.createProduct(data);
    return response.data;
  },

  async updateProduct(id, data) {
    const response = await productsAPI.updateProduct(id, data);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await productsAPI.deleteProduct(id);
    return response.data;
  },

  async getPendingApprovalProducts() {
    const response = await productsAPI.getPendingApprovalProducts();
    return response.data?.results || response.data;
  },

  async approveProduct(id) {
    const response = await productsAPI.approveProduct(id);
    return response.data;
  },

  async rejectProduct(id) {
    const response = await productsAPI.rejectProduct(id);
    return response.data;
  },
};
