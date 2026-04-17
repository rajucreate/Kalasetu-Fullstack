import { artisansAPI } from '../api/artisans';

export const artisanService = {
  async getArtisans(page = 1) {
    const response = await artisansAPI.getArtisans(page);
    return response.data;
  },

  async getArtisan(id) {
    const response = await artisansAPI.getArtisan(id);
    return response.data;
  },
};
