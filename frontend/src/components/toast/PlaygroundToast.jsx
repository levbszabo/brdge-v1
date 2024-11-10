import React from 'react';
import toast from 'react-hot-toast';

export const showPlaygroundToast = (message, type = 'default') => {
    const toastConfig = {
        duration: 4000,
        position: 'top-right',
    };

    switch (type) {
        case 'success':
            return toast.success(message, toastConfig);
        case 'error':
            return toast.error(message, toastConfig);
        default:
            return toast(message, toastConfig);
    }
};

export const PlaygroundToast = {
    show: showPlaygroundToast,
    success: (message) => showPlaygroundToast(message, 'success'),
    error: (message) => showPlaygroundToast(message, 'error'),
};

export default PlaygroundToast; 