import axios from 'axios';

const API_BASE =
  import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('calathx_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const api = {
  auth: {
    login: (data) => client.post('/auth/login', data),
    logout: () => client.post('/auth/logout'),
    me: () => client.get('/auth/me'),
    refresh: () => client.post('/auth/refresh'),
  },
  posts: {
    getAll: (params) => client.get('/posts', { params }),
    getBySlug: (slug) => client.get(`/posts/${slug}`),
    getByCategory: (slug, params) => client.get(`/posts/category/${slug}`, { params }),
    getByTag: (slug, params) => client.get(`/posts/tag/${slug}`, { params }),
    getPopular: (limit = 5) => client.get('/posts/popular', { params: { limit } }),
    getLatest: (limit = 10) => client.get('/posts/latest', { params: { limit } }),
    getVideos: (limit = 4) => client.get('/posts/videos', { params: { limit } }),
    toggleFeature: (id) => client.patch(`/posts/${id}/feature`),
    updateOrder: (id, homeOrder) => client.patch(`/posts/${id}/order`, { homeOrder }),
    getRelated: (id) => client.get(`/posts/related/${id}`),
    incrementView: (id) => client.patch(`/posts/${id}/view`),
    create: (data) => client.post('/posts', data),
    update: (id, data) => client.put(`/posts/${id}`, data),
    delete: (id) => client.delete(`/posts/${id}`),
  },
  categories: {
    getAll: () => client.get('/categories'),
    create: (data) => client.post('/categories', data),
    update: (id, data) => client.put(`/categories/${id}`, data),
    delete: (id) => client.delete(`/categories/${id}`),
  },
  tags: {
    getAll: () => client.get('/tags'),
    create: (data) => client.post('/tags', data),
    delete: (id) => client.delete(`/tags/${id}`),
  },
  pages: {
    getBySlug: (slug) => client.get(`/pages/${slug}`),
    upsert: (slug, data) => client.put(`/pages/${slug}`, data),
  },
  media: {
    getAll: (params) => client.get('/media', { params }),
    upload: (formData) =>
      client.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    delete: (id) => client.delete(`/media/${id}`),
  },
  comments: {
    getByPost: (postId) => client.get(`/comments/post/${postId}`),
    create: (postId, data) => client.post(`/comments/post/${postId}`, data),
  },
  subscribers: {
    subscribe: (data) => client.post('/subscribers', data),
    getAll: () => client.get('/subscribers'),
  },
  contact: {
    submit: (data) => client.post('/contact', data),
    getAll: () => client.get('/contact'),
    markRead: (id) => client.patch(`/contact/${id}/read`),
    delete: (id) => client.delete(`/contact/${id}`),
  },
  settings: {
    get: () => client.get('/settings'),
    update: (data) => client.put('/settings', data),
  },
  search: {
    query: (q) => client.get('/search', { params: { q } }),
  },
};

export default api;

