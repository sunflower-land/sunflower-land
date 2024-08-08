import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "settings.darkMode";
const DARK_MODE_EVENT = "darkModeChanged";

export function cacheDarkModeSetting(value: boolean) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(DARK_MODE_EVENT, { detail: value }));
}

export function getDarkModeSetting(): boolean {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  return cached ? JSON.parse(cached) : false;
}

export const useIsDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(getDarkModeSetting());

  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    cacheDarkModeSetting(newValue);
  };

  useEffect(() => {
    const handleDarkModeChange = (event: CustomEvent) => {
      setIsDarkMode(event.detail);
    };

    window.addEventListener(DARK_MODE_EVENT as any, handleDarkModeChange);

    return () => {
      window.removeEventListener(DARK_MODE_EVENT as any, handleDarkModeChange);
    };
  }, []);

  return { isDarkMode, toggleDarkMode };
};
