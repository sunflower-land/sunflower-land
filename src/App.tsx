import React from "react";

import { initialise } from "lib/utils/init";

import "./styles.css";
import * as Auth from "features/auth/lib/Provider";
import ErrorBoundary from "features/auth/components/ErrorBoundary";
import { Navigation } from "./Navigation";
import "./lib/i18n";
import { ReloadPrompt } from "features/pwa/ReloadPrompt";

// Initialise Global Settings
initialise();

/**
 * Top level wrapper for providers
 */
export const App: React.FC = () => {
  return (
    <>
      <Auth.Provider>
        <ErrorBoundary>
          <Navigation />
        </ErrorBoundary>
      </Auth.Provider>
      <ReloadPrompt />
    </>
  );
};
