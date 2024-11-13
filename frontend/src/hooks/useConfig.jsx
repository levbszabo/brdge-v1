import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import yaml from 'js-yaml';

// Default config
const defaultConfig = {
    title: "LiveKit Agents Playground",
    description: "A playground for testing LiveKit Agents",
    video_fit: "cover",
    settings: {
        editable: true,
        chat: true,
        inputs: {
            camera: true,
            mic: true,
        },
        outputs: {
            audio: true,
            video: true,
        },
        ws_url: "",
        token: "",
    },
    show_qr: false,
};

const ConfigContext = createContext();

// Helper functions for storage
const saveToStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const loadFromStorage = (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
};

export const ConfigProvider = ({ children }) => {
    const appConfig = useMemo(() => {
        if (process.env.NEXT_PUBLIC_APP_CONFIG) {
            try {
                const parsedConfig = yaml.load(process.env.NEXT_PUBLIC_APP_CONFIG);
                if (parsedConfig.settings === undefined) {
                    parsedConfig.settings = defaultConfig.settings;
                }
                if (parsedConfig.settings.editable === undefined) {
                    parsedConfig.settings.editable = true;
                }
                return parsedConfig;
            } catch (e) {
                console.error("Error parsing app config:", e);
            }
        }
        return defaultConfig;
    }, []);

    const getSettingsFromStorage = useCallback(() => {
        return loadFromStorage('lk_settings');
    }, []);

    const setStorageSettings = useCallback((settings) => {
        saveToStorage('lk_settings', settings);
    }, []);

    const getConfig = useCallback(() => {
        const appConfigFromSettings = { ...appConfig };

        if (appConfigFromSettings.settings.editable === false) {
            return appConfigFromSettings;
        }
        const storageSettings = getSettingsFromStorage();
        if (!storageSettings) {
            return appConfigFromSettings;
        }
        appConfigFromSettings.settings = storageSettings;
        return { ...appConfigFromSettings };
    }, [appConfig, getSettingsFromStorage]);

    const setUserSettings = useCallback((settings) => {
        const appConfigFromSettings = appConfig;
        if (appConfigFromSettings.settings.editable === false) {
            return;
        }
        setStorageSettings(settings);
        _setConfig((prev) => ({
            ...prev,
            settings: settings,
        }));
    }, [appConfig, setStorageSettings]);

    const [config, _setConfig] = useState(getConfig());

    useEffect(() => {
        _setConfig(getConfig());
    }, [getConfig]);

    return (
        <ConfigContext.Provider value={{ config, setUserSettings }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
};

// ... rest of the file 