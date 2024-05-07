import { useState } from "react";

export interface PlazaSettings {
  framerate: 30 | 60 | 90 | 120 | 0; // 0 = unlimited
  idleAnimation: boolean;
  walkAnimation: boolean;
}

type SetValueFunction = (
  key: keyof PlazaSettings,
  value: string | number | boolean
) => void;

export const usePlazaSettings: () => [PlazaSettings, SetValueFunction] = () => {
  const [storedValue, setStoredValue] = useState<PlazaSettings>(() => {
    try {
      const item = window.localStorage.getItem("plaza-settings");
      return item
        ? JSON.parse(item)
        : { framerate: 60, idleAnimation: true, walkAnimation: true };
    } catch (error) {
      return { framerate: 60, idleAnimation: true, walkAnimation: true };
    }
  });

  const setValue: SetValueFunction = (key, value) => {
    try {
      setStoredValue({
        ...storedValue,
        [key]: value,
      });
      window.localStorage.setItem(
        "plaza-settings",
        JSON.stringify({ ...storedValue, [key]: value })
      );
    } catch (error) {
      throw new Error("Error setting plaza settings in local storage");
    }
  };

  return [storedValue, setValue];
};
