import { api } from '../api';

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('authToken', token);
        console.log('Token set:', token); // Debug log
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('authToken');
        console.log('Token removed'); // Debug log
    }
};

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const logout = () => {
    setAuthToken(null);
    // Optionally, redirect to login page or home page
};
