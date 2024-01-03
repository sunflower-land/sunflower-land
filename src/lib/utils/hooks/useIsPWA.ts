import { useState, useEffect } from "react";

export const useIsPWA = () => {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    if (
      // "serviceWorker" in navigator &&
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      setIsPWA(true);
    }
  }, []);

  return isPWA;
};
