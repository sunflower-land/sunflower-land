/* eslint-disable no-console */
import React, { useEffect, useRef } from "react";

import { initialise } from "lib/utils/init";

import "./styles.css";
import * as Auth from "features/auth/lib/Provider";
import ErrorBoundary from "features/auth/components/ErrorBoundary";
import { Navigation } from "./Navigation";
import "./lib/i18n";
import { WalletProvider } from "features/wallet/WalletProvider";
import { useRegisterSW } from "virtual:pwa-register/react";
import lifecycle from "page-lifecycle/dist/lifecycle.mjs";

const CHECK_FOR_UPDATE_INTERVAL = 1000 * 60 * 2;

// Initialise Global Settings
initialise();
/**
 * Top level wrapper for providers
 */
export const App: React.FC = () => {
  // Periodic Service Worker Updates
  // https://vite-pwa-org.netlify.app/guide/periodic-sw-updates.html#handling-edge-cases
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (registration) {
        setInterval(async () => {
          console.log("Checking for update");
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
          console.log("Checked for update");
        }, CHECK_FOR_UPDATE_INTERVAL);
      }
    },
  });

  const needRefreshRef = useRef(needRefresh);

  // Update the ref whenever needRefresh changes
  useEffect(() => {
    needRefreshRef.current = needRefresh;
  }, [needRefresh]);

  const handleStateChange = (evt: any) => {
    console.log("State change: ", evt.newState);
    console.log("Need refresh: ", needRefreshRef.current);
    if (evt.newState === "hidden" && needRefreshRef.current) {
      updateServiceWorker();
    }
  };

  useEffect(() => {
    lifecycle.addEventListener("statechange", handleStateChange);

    return () => {
      lifecycle.removeEventListener("statechange", handleStateChange);
    };
  }, []);

  return (
    <>
      <Auth.Provider>
        <WalletProvider>
          <ErrorBoundary>
            <Navigation />
          </ErrorBoundary>
        </WalletProvider>
      </Auth.Provider>
    </>
  );
};
