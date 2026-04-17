import { storiesAPI } from '../api/stories';

export const storyService = {
  async getStories(page = 1) {
    const response = await storiesAPI.getStories(page);
    return response.data;
  },

  async getStory(id) {
    const response = await storiesAPI.getStory(id);
    return response.data;
  },

  async getMyStories() {
    const response = await storiesAPI.getMyStories();
    return response.data?.results || response.data;
  },

  async createStory(data) {
    const response = await storiesAPI.createStory(data);
    return response.data;
  },

  async updateStory(id, data) {
    const response = await storiesAPI.updateStory(id, data);
    return response.data;
  },

  async deleteStory(id) {
    const response = await storiesAPI.deleteStory(id);
    return response.data;
  },
};
