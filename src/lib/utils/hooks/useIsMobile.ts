import { useEffect, useState } from "react";

// Matches Tailwind's default `sm` breakpoint (640px). Anything narrower is
// treated as a mobile viewport. Used to switch the Withdraw flow between the
// desktop two-pane layout and the mobile single-screen-at-a-time flow.
const MOBILE_QUERY = "(max-width: 639px)";

/**
 * Reactive viewport check against the Tailwind `sm` breakpoint.
 * Returns `true` while the viewport is narrower than 640px.
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const handleChange = () => setIsMobile(media.matches);

    handleChange();
    media.addEventListener("change", handleChange);

    return () => media.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
};
