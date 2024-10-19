import { api } from '../api';

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('authToken', token);
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('authToken');
    }
};

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
    localStorage.removeItem('authToken');
};

export const logout = () => {
    setAuthToken(null);
    // Optionally, redirect to login page or home page
};
