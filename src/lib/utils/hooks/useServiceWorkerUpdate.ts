/* eslint-disable no-console */
import { useEffect, useRef } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import lifecycle from "page-lifecycle/dist/lifecycle.mjs";

const CHECK_FOR_UPDATE_INTERVAL = 1000 * 60 * 60 * 2; // 2 hours
/**
 * This hook runs periodic checks for service worker updates.
 * When a new service worker has been installed and is waiting to activate,
 * the needRefresh flag will be set to true.
 * When the page life cycle state changes to hidden, the waiting service worker will be activated.
 * NOTE: This is not the only way that service worker updates can be handled. If a player closes down the app or hard refreshes the page,
 * the service worker will be updated.
 */
export function useServiceWorkerUpdate() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (registration) {
        setInterval(async () => {
          if (!(!registration.installing && navigator)) return;

          if ("connection" in navigator && !navigator.onLine) return;

          const resp = await fetch(swUrl, {
            cache: "no-store",
            headers: {
              cache: "no-store",
              "cache-control": "no-cache",
            },
          });

          if (resp?.status === 200) await registration.update();
        }, CHECK_FOR_UPDATE_INTERVAL);
      }
    },
  });

  const needRefreshRef = useRef(needRefresh);

  useEffect(() => {
    needRefreshRef.current = needRefresh;
  }, [needRefresh]);

  useEffect(() => {
    const handleStateChange = (evt: any) => {
      if (evt.newState === "hidden" && needRefreshRef.current) {
        updateServiceWorker();
      }
    };

    lifecycle.addEventListener("statechange", handleStateChange);

    return () => {
      lifecycle.removeEventListener("statechange", handleStateChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
