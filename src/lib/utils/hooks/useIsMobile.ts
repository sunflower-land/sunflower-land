import { useEffect, useState } from "react";

export function detectMobile() {
  if ("maxTouchPoints" in navigator) {
    return navigator.maxTouchPoints > 0;
  }

  if (typeof matchMedia !== "undefined") {
    const mediaQuery = matchMedia("(pointer:coarse)");
    if (mediaQuery && mediaQuery.media === "(pointer:coarse)") {
      return !!mediaQuery.matches;
    }
  }

  if ("orientation" in window) {
    return true;
  }

  // Only as a last resort, fall back to user agent sniffing
  const USER_AGENT = navigator.userAgent;

  return (
    /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(USER_AGENT) ||
    /\b(Android|Windows Phone|iPad|iPod)\b/i.test(USER_AGENT)
  );
}

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(detectMobile());
  }, []);

  return [isMobile];
};
