import client from './client';

export const productsAPI = {
  // Public endpoints
  getProducts: (page = 1) => client.get('/products/', { params: { page } }),
  getProduct: (id) => client.get(`/products/${id}/`),

  // Artisan endpoints
  getMyProducts: () => client.get('/products/my_products/'),
  createProduct: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    return client.post('/products/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateProduct: (id, data) => client.put(`/products/${id}/`, data),
  deleteProduct: (id) => client.delete(`/products/${id}/`),

  // Consultant endpoints
  getPendingProducts: () => client.get('/products/pending/'),
  verifyProduct: (id, data) => client.patch(`/products/${id}/verify/`, data),

  // Admin endpoints
  getPendingApprovalProducts: () => client.get('/products/pending_approval/'),
  approveProduct: (id) => client.patch(`/products/${id}/approve/`),
  rejectProduct: (id) => client.patch(`/products/${id}/reject/`),
};
