import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
export const BASE_URL = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL.replace('/api', '')
    : 'http://localhost:5001';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    getCurrentUser: () => api.get('/auth/me'),
    changePassword: (currentPassword, newPassword) =>
        api.post('/auth/change-password', { currentPassword, newPassword }),
    createUser: (name, email, role) =>
        api.post('/auth/register', { name, email, role }),
    getUsers: () => api.get('/auth/users'),
    deleteUser: (id) => api.delete(`/auth/users/${id}`),
    grantAdminDeletePermission: (userId, canDeleteAdmins) =>
        api.patch(`/auth/users/${userId}/permissions`, { canDeleteAdmins })
    // Removed: signup, forgotPassword, resetPassword (disabled for security)
};

// Content API
export const contentAPI = {
    getPageContent: (page) => api.get(`/content/${page}`),
    getSectionContent: (page, section) => api.get(`/content/${page}/${section}`),
    updateContent: (page, section, content) =>
        api.post(`/content/${page}/${section}`, { content }),
    deleteContent: (page, section) => api.delete(`/content/${page}/${section}`),
    getAllPages: () => api.get('/content')
};

// Media API
export const mediaAPI = {
    uploadFile: (formData) => api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    uploadMultiple: (formData) => api.post('/media/upload-multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getFiles: () => api.get('/media/files'),
    deleteFile: (filename) => api.delete(`/media/files/${filename}`)
};

export default api;
