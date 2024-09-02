/* eslint-disable no-console */
import React, { useEffect } from "react";

import { initialise } from "lib/utils/init";

import "./styles.css";
import * as Auth from "features/auth/lib/Provider";
import ErrorBoundary from "features/auth/components/ErrorBoundary";
import { Navigation } from "./Navigation";
import "./lib/i18n";
import { WalletProvider } from "features/wallet/WalletProvider";
import { useServiceWorkerUpdate } from "lib/utils/hooks/useServiceWorkerUpdate";

// Initialise Global Settings
initialise();

// Android + Metamask browser has issues loading assets when the Service Worker is running
// The cause is unknown hence we unregister the service worker for these users to prevent
// rendering issues
const NoServiceWorker = () => {
  useEffect(() => {
    (async () => {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        const unregisterPromises = registrations.map((registration) =>
          registration.unregister(),
        );

        const allCaches = await caches.keys();
        const cacheDeletionPromises = allCaches.map((cache) =>
          caches.delete(cache),
        );

        await Promise.all([...unregisterPromises, ...cacheDeletionPromises]);
      }
    })();
  }, []);
  return null;
};

const ServiceWorker = () => {
  useServiceWorkerUpdate();
  return null;
};

/**
 * Top level wrapper for providers
 */
export const App: React.FC = () => {
  return (
    <>
      {/Metamask/i.test(navigator.userAgent) ? (
        <NoServiceWorker />
      ) : (
        <ServiceWorker />
      )}
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
