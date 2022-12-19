import React from "react";

import * as Auth from "features/auth/lib/Provider";
import { initialise } from "lib/utils/init";
import { Navigation } from "./Navigation";

import "./styles.css";
import ErrorBoundary from "features/auth/components/ErrorBoundary";

// Initialise Global Settings
initialise();

/**
 * Top level wrapper for providers
 */
export const App: React.FC = () => {
  return (
    <Auth.Provider>
      <ErrorBoundary>
        <Navigation />
      </ErrorBoundary>
    </Auth.Provider>
  );
};
