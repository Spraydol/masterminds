import axios from 'axios';

// Auto-detect API URL for GitHub Codespaces
const getApiBaseUrl = () => {
  // If running on Codespaces/GitHub Pages, use relative path
  if (typeof window !== 'undefined' && window.location.hostname.includes('app.github.dev')) {
    // Extract the base domain (without port) for API calls
    const hostname = window.location.hostname;
    const port = window.location.port;
    // If frontend is on port 5173, backend is likely on 5000
    return port 
      ? `https://${hostname.replace('-5173', '-5000')}` 
      : `https://${hostname}`;
  }
  // Local development fallback
  return 'http://localhost:5000';
};

export const API_URL = getApiBaseUrl();

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
  upvotePost: (postId: number, userId: number) => api.post('/community/upvote', { post_id: postId, user_id: userId }),
  deletePost: (postId: number, userId: number) => api.delete('/community/post', { data: { post_id: postId, user_id: userId } }),
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
