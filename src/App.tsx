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
import { PWAInstallComponent } from "components/pwa/PWAInstallComponent";
import { PWAInstallProvider } from "features/pwa/PWAInstallProvider";

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
          registration.unregister()
        );

        const allCaches = await caches.keys();
        const cacheDeletionPromises = allCaches.map((cache) =>
          caches.delete(cache)
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
        <PWAInstallProvider>
          <WalletProvider>
            <ErrorBoundary>
              <Navigation />
              <div
                className="fixed top-2 left-1/2"
                style={{ zIndex: 5678907878 }}
              >
                <PWAInstallComponent />
              </div>
              {/* <div
              className="fixed top-6 left-0 text-xs w-full"
              style={{ fontFamily: "sans-serif", zIndex: 5678907878 }}
            >
              {" "}
              {`Device: ${JSON.stringify(parser.getDevice())}`}
              {`Browser: ${JSON.stringify(parser.getBrowser())}`}
              {`Result: ${JSON.stringify(parser.getResult())}`}
              {`UA: ${JSON.stringify(navigator.userAgent)}`}
            </div> */}
            </ErrorBoundary>
          </WalletProvider>
        </PWAInstallProvider>
      </Auth.Provider>
    </>
  );
};
