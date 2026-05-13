import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5178',
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