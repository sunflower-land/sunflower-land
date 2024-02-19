/* eslint-disable no-console */
import { useEffect, useRef, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import lifecycle from "page-lifecycle/dist/lifecycle.mjs";

const CHECK_FOR_UPDATE_INTERVAL = 1000 * 60 * 2; // 1 hour
/**
 * This hook runs periodic checks for service worker updates.
 * When a new service worker has been installed and is waiting to activate,
 * the needRefresh flag will be set to true.
 * When the page life cycle state changes to hidden, the waiting service worker will be activated.
 * NOTE: This is not the only way that service worker updates can be handled. If a player closes down the app or hard refreshes the page,
 * the service worker will be updated.
 */
export function useServiceWorkerUpdate() {
  const [isInstalling, setIsInstalling] = useState(false);

  const activeServiceWorkerInstallationHandler = (
    registration: ServiceWorkerRegistration
  ) => {
    const updatefoundHandler = () => {
      setIsInstalling(true);

      const newWorker = registration.installing;

      if (newWorker) {
        const statechangeHandler = () => {
          if (newWorker.state === "installed") {
            setIsInstalling(false);
          }
        };

        newWorker.addEventListener("statechange", statechangeHandler);

        return () => {
          // Cleanup statechange event listener when the component is unmounted
          newWorker.removeEventListener("statechange", statechangeHandler);
        };
      }
    };

    registration.addEventListener("updatefound", updatefoundHandler);

    return () => {
      // Cleanup updatefound event listener when the component is unmounted
      registration.removeEventListener("updatefound", updatefoundHandler);
    };
  };

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.log("[APP] onRegisteredSW called", JSON.stringify(registration));
      if (registration) {
        activeServiceWorkerInstallationHandler(registration);

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

          if (resp?.status === 200) {
            console.log("[APP] checking for update");
            await registration.update();
            console.log("[APP] check for update complete");
          }
        }, CHECK_FOR_UPDATE_INTERVAL);
      }
    },
  });

  const needRefreshRef = useRef(needRefresh);

  useEffect(() => {
    console.log("[APP] needRefresh", needRefresh);
    needRefreshRef.current = needRefresh;
  }, [needRefresh]);

  useEffect(() => {
    const handleStateChange = (evt: any) => {
      if (evt.oldState === "hidden" && evt.newState === "terminated") {
        console.log("----RELOADED APP-----");
      }

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

  return { isInstalling, needRefresh: needRefreshRef.current };
}
