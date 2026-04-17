import client from './client';

export const consultantAPI = {
  getPendingProducts: () => client.get('/consultant/pending/'),
  verifyProduct: (id, data) => client.patch(`/consultant/verify/${id}/`, data),
};
