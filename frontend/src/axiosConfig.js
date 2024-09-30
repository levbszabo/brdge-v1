// src/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000', // Update this if needed
});

export default axiosInstance;