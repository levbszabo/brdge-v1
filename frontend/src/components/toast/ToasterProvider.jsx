import React, { createContext, useContext } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToasterProvider = ({ children }) => {
    const showToast = (message, type = 'default') => {
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            default:
                toast(message);
        }
    };

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 5000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
        </ToastContext.Provider>
    );
};

// Export ToastProvider as an alias for ToasterProvider for backward compatibility
export const ToastProvider = ToasterProvider;

export default ToasterProvider; 