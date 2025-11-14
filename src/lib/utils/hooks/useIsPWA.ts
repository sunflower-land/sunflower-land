import { useEffect, useState } from "react";

const computeIsStandalone = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(display-mode: standalone)").matches;

export const useIsPWA = () => {
  const [isPWA, setIsPWA] = useState(() => computeIsStandalone());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(display-mode: standalone)");

    const handleChange = (event: MediaQueryListEvent) => {
      setIsPWA(event.matches);
    };

    mediaQuery.addEventListener?.("change", handleChange);
    return () => mediaQuery.removeEventListener?.("change", handleChange);
  }, []);

  return isPWA;
};
