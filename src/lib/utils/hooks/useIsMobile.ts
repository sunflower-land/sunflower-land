import { useEffect, useState } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if ("maxTouchPoints" in navigator) {
      setIsMobile(navigator.maxTouchPoints > 0);
    } else {
      const mediaQuery = matchMedia("(pointer:coarse)");
      if (mediaQuery && mediaQuery.media === "(pointer:coarse)") {
        setIsMobile(!!mediaQuery.matches);
      } else if ("orientation" in window) {
        setIsMobile(true); // deprecated, but good fallback
      } else {
        // Only as a last resort, fall back to user agent sniffing
        const USER_AGENT = navigator.userAgent;

        setIsMobile(
          /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(USER_AGENT) ||
            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(USER_AGENT)
        );
      }
    }
  }, []);

  return [isMobile];
};
