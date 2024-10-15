// src/axiosConfig.js
import axios from 'axios';
import { BACKEND_URL } from './config';

const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
});

export default axiosInstance;
