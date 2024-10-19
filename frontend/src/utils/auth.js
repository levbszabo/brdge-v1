import { api } from '../api';

export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
        // Don't log the token here
    } else {
        localStorage.removeItem('token');
    }
};

export const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const removeAuthToken = () => {
    localStorage.removeItem('token');
};

export const logout = () => {
    setAuthToken(null);
    // Optionally, redirect to login page or home page
};
