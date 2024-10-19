import axios from 'axios';


import { BACKEND_URL as API_BASE_URL } from './config';

const api = axios.create({
    baseURL: API_BASE_URL,
});

const unauthenticated_api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token && !config.url.includes('/public/')) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export { api, unauthenticated_api };
