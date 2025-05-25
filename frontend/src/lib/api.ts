import axios from 'axios';

// Determine the base URL for the API
// In development, Vite provides environment variables via `import.meta.env`
// VITE_API_URL should be set in a .env file in the frontend directory
// e.g., VITE_API_URL=http://localhost:5000/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Assuming token is stored with key 'token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Interceptor to handle responses (e.g., for global error handling)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally if needed
    // For example, redirect to login on 401 errors
    if (error.response && error.response.status === 401) {
      // Potentially clear token and redirect to login
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      // window.location.href = '/login';
      console.error('Unauthorized access - 401. Consider redirecting to login.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
