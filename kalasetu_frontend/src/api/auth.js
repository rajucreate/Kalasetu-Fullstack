import client from './client';

export const authAPI = {
  register: (data) => client.post('/auth/register/', data),
  login: (email, password, captchaToken) => client.post('/auth/login/', {
    email,
    password,
    captcha_token: captchaToken,
  }),
  getCurrentUser: () => client.get('/auth/me/'),
  updateProfile: (data) => client.put('/auth/me/', data),
};
