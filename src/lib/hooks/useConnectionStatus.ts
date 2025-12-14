import { useState, useEffect } from "react";
import { CONFIG } from "lib/config";

const checkConnection = async (): Promise<boolean> => {
  if (!navigator.onLine) return false;

  try {
    const response = await fetch(".", { method: "HEAD" });
    return response.status >= 200 && response.status < 500;
  } catch {
    return false;
  }
};

export const useConnectionStatus = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (!CONFIG.API_URL) return;

    checkConnection().then((isOnline) => setIsOffline(!isOnline));

    const onOffline = () => setIsOffline(true);
    const onOnline = () => checkConnection().then((ok) => setIsOffline(!ok));

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);

    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  return isOffline;
};
