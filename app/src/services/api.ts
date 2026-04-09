import axios from 'axios';

// Use the public GitHub Codespaces URL for the backend service
// Format: https://<port>-<your-codespace-id>.app.github.dev
export const API_URL = 'https://5000-opulent-space-dollop-qwxxj6r77qr2445q-5000.app.github.dev';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth APIs
export const authAPI = {
  sendCode: (email: string) => api.post('/auth/send-code', { email }),
  verifyCode: (email: string, code: string) => api.post('/auth/verify', { email, code }),
  completeProfile: (data: { email: string; name: string; sector: string; year: string }) =>
    api.post('/auth/complete-profile', data),
  login: (email: string) => api.post('/auth/login', { email }),
  getProfile: (userId: number) => api.get(`/user/profile?user_id=${userId}`),
};

// Document APIs
export const documentAPI = {
  upload: (formData: FormData) =>
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getDocuments: (params?: { sector?: string; year?: string; doc_type?: string }) =>
    api.get('/documents', { params }),
  download: (docId: number) => `${API_URL}/documents/download/${docId}`,
};

// Community APIs
export const communityAPI = {
  getPosts: (sector?: string) => api.get('/community/posts', { params: { sector } }),
  createPost: (data: { title: string; content: string; author_id: number; sector?: string }) =>
    api.post('/community/post', data),
  createReply: (data: { post_id: number; content: string; author_id: number }) =>
    api.post('/community/reply', data),
  getPostDetails: (postId: number) => api.get(`/community/post/${postId}`),
};

// AI Chat APIs
export const chatAPI = {
  sendMessage: (message: string, userId?: number) =>
    api.post('/ai/chat', { message, user_id: userId }),
  getChatHistory: (userId: number) => api.get(`/ai/chat-history?user_id=${userId}`),
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: () => api.get('/leaderboard'),
};

// Streak/Stats API
export const streakAPI = {
  getStats: (userId: number) => api.get(`/user/stats?user_id=${userId}`),
};

export default api;
