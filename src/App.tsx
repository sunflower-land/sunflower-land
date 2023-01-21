import React from "react";

import * as Auth from "features/auth/lib/Provider";
import { initialise } from "lib/utils/init";
import { Navigation } from "./Navigation";

import "./styles.css";
import ErrorBoundary from "features/auth/components/ErrorBoundary";

//Import PWA icons so that they are included in vite build

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
      <div>
        <img src="pwaIcon" className="hidden" />
        <img src="icon192" className="hidden" />
        <img src="icon512" className="hidden" />
      </div>
    </Auth.Provider>
  );
};
