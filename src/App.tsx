/* eslint-disable no-console */
import React, { useEffect, useRef } from "react";

import { initialise } from "lib/utils/init";

import "./styles.css";
import * as Auth from "features/auth/lib/Provider";
import ErrorBoundary from "features/auth/components/ErrorBoundary";
import { Navigation } from "./Navigation";
import "./lib/i18n";
import { WalletProvider } from "features/wallet/WalletProvider";
import lifecycle from "page-lifecycle/dist/lifecycle.mjs";
import { useRegisterSW } from "virtual:pwa-register/react";

const CHECK_FOR_UPDATE_INTERVAL = 1000 * 60 * 5;

// Initialise Global Settings
initialise();
/**
 * Top level wrapper for providers
 */
export const App: React.FC = () => {
  // useServiceWorkerUpdate();

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

          if (resp?.status === 200) {
            console.log("CHECKING FOR UPDATE");
            await registration.update();
          }
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
    if (evt.newState === "hidden" && needRefreshRef.current) {
      console.log("UPDATE NEEDED: Refreshing Service Worker");
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
