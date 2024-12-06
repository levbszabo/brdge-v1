import { useState, useEffect } from 'react';
import { api } from '../api';

export const setAuthToken = (token) => {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
};

export const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const logout = () => {
    removeAuthToken();
    window.location.href = '/login';
};

// Add useAuth hook
export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = getAuthToken();
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/user/profile');
                setUser({
                    id: response.data.id,
                    email: response.data.email,
                    account: response.data.account
                });
            } catch (error) {
                console.error('Auth check failed:', error);
                removeAuthToken();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return {
        user,
        loading,
        isAuthenticated: !!user,
        logout
    };
};
