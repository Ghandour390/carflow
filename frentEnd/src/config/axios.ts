import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (refreshToken) {
            config.headers['X-Refresh-Token'] = refreshToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => {
        const newAccessToken = response.headers['x-new-access-token'];
        if (newAccessToken) {
            localStorage.setItem('accessToken', newAccessToken);
        }
        return response;
    },
    async (error) => {
        if (error.response?.status === 403) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
