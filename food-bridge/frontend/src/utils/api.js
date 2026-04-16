import axios from 'axios';
const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true, 
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Profile API calls — unchanged, withCredentials handles auth automatically
export const getProfile  = () => api.get('/api/auth/profile');
export const updateProfile = (data) => api.put('/api/auth/profile', data);

export default api;