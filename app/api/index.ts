import axios from 'axios';
import { BASE_URL } from './endpoints';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Get token from localStorage for web
const getToken = () => {
  try {
    const persistedState = localStorage.getItem('persist:roster-app-moduled-341235416873216483721647');
    if (persistedState) {
      const parsed = JSON.parse(persistedState);
      if (parsed.user) {
        const userState = JSON.parse(parsed.user);
        return userState.token;
      }
    }
  } catch (error) {
    console.error('Error getting token:', error);
  }
  return null;
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    console.log(error?.request, 'request error');

    if (error.response) {
      const { status, data } = error.response;
      console.log(data, 'error in axios config');
      
      if (status === 401) {
        // Unauthorized: Clear storage and redirect to login
        localStorage.removeItem('persist:roster-app-moduled-341235416873216483721647');
        window.location.href = '/auth/company-url';
      } else if (status === 404) {
        // Resource not found
      }
      
      if (data.message) {
        return Promise.reject(data.message);
      }

      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;

