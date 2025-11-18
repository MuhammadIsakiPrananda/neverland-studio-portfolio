import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Settings {
  theme: 'light' | 'dark';
  language: 'en' | 'id';
  notificationsEnabled: boolean;
}

interface SettingsContextProps {
  settings: Settings;
  toggleTheme: () => void;
  setLanguage: (lang: 'en' | 'id') => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const defaultSettings: Settings = {
  theme: 'dark',
  language: 'en',
  notificationsEnabled: true,
};

const SettingsContext = createContext<SettingsContextProps>({
  settings: defaultSettings,
  toggleTheme: () => {},
  setLanguage: () => {},
  setNotificationsEnabled: () => {},
});

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const storedSettings = localStorage.getItem('settings');
    return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const toggleTheme = () => {
    setSettings(prevSettings => ({ ...prevSettings, theme: prevSettings.theme === 'light' ? 'dark' : 'light' }));
  };

  const setLanguage = (lang: 'en' | 'id') => {
    setSettings(prevSettings => ({ ...prevSettings, language: lang }));
  };

  const setNotificationsEnabled = (enabled: boolean) => {
    setSettings(prevSettings => ({ ...prevSettings, notificationsEnabled: enabled }));
  };

  return (
    <SettingsContext.Provider value={{ settings, toggleTheme, setLanguage, setNotificationsEnabled }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);