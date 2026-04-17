import client from './client';

export const artisansAPI = {
  getArtisans: (page = 1) => client.get('/artisans/', { params: { page } }),
  getArtisan: (id) => client.get(`/artisans/${id}/`),
};
