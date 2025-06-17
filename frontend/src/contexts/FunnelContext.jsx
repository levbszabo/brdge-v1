import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FunnelContext = createContext();

export const FunnelProvider = ({ children, funnelType }) => {
    const [sessionId, setSessionId] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [chatHistory, setChatHistory] = useState([]);
    const [proposalData, setProposalData] = useState(null);
    const [orderId, setOrderId] = useState(null);

    // Initialize sessionId from localStorage or create a new one
    useEffect(() => {
        let storedSessionId = localStorage.getItem('funnelSessionId');
        if (!storedSessionId) {
            storedSessionId = uuidv4();
            localStorage.setItem('funnelSessionId', storedSessionId);
        }
        setSessionId(storedSessionId);
    }, []);

    const value = {
        sessionId,
        funnelType,
        currentStep,
        setCurrentStep,
        chatHistory,
        setChatHistory,
        proposalData,
        setProposalData,
        orderId,
        setOrderId
    };

    return (
        <FunnelContext.Provider value={value}>
            {children}
        </FunnelContext.Provider>
    );
};

export const useFunnel = () => {
    const context = useContext(FunnelContext);
    if (!context) {
        throw new Error('useFunnel must be used within a FunnelProvider');
    }
    return context;
}; 