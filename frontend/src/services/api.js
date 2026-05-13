import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    (config) =>{
        const token = localStorage.getItem('token');
        config._hasAuthToken = Boolean(token);
        if(token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const hadAuthToken = Boolean(error?.config?._hasAuthToken);

        // Only force logout/redirect when an authenticated request fails.
        // Guests browsing public pages should not be redirected to /login.
        if (status === 401 && hadAuthToken) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;