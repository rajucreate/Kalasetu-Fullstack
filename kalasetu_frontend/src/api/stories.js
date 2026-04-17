import client from './client';

export const storiesAPI = {
  // Public endpoints
  getStories: (page = 1) => client.get('/stories/', { params: { page } }),
  getStory: (id) => client.get(`/stories/${id}/`),

  // Artisan endpoints
  getMyStories: () => client.get('/stories/my_stories/'),
  createStory: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    return client.post('/stories/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateStory: (id, data) => client.put(`/stories/${id}/`, data),
  deleteStory: (id) => client.delete(`/stories/${id}/`),
};
