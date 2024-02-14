import React, { useEffect } from "react";

import { initialise } from "lib/utils/init";

import "./styles.css";
import * as Auth from "features/auth/lib/Provider";
import ErrorBoundary from "features/auth/components/ErrorBoundary";
import { Navigation } from "./Navigation";
import "./lib/i18n";
import { WalletProvider } from "features/wallet/WalletProvider";
import { useServiceWorkerUpdate } from "lib/utils/hooks/useServiceWorkerUpdate";
import { messaging } from "lib/messaging";
import { onMessage } from "firebase/messaging";
import { RequestPermission } from "components/RequestPermission";

// Initialise Global Settings
initialise();
/**
 * Top level wrapper for providers
 */
export const App: React.FC = () => {
  const { registration } = useServiceWorkerUpdate();

  useEffect(() => {
    if (registration?.active) {
      onMessage(messaging, (payload) => {
        /* eslint-disable no-console */
        console.log("[App.js] Received foreground message ", payload);
      });
    }
  }, [registration]);

  return (
    <>
      <Auth.Provider>
        <WalletProvider>
          <ErrorBoundary>
            <Navigation />
          </ErrorBoundary>
        </WalletProvider>
      </Auth.Provider>
      <RequestPermission registration={registration} />
    </>
  );
};
