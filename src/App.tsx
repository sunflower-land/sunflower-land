import React from "react";

import * as Auth from "features/auth/lib/Provider";
import { initialise } from "lib/utils/init";
import { Navigation } from "./Navigation";

import "./styles.css";
import ErrorBoundary from "features/auth/components/ErrorBoundary";

//Import PWA icons so that they are included in vite build
import pwaIcon from "./src/assets/brand/icon_pwa_1.png";
import icon192 from "./src/assets/brand/logo_with_sunflower_pwa_192.png";
import icon512 from "./src/assets/brand/logo_with_sunflower_pwa_512.png";

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
        <img src={pwaIcon} className="hidden" />
        <img src={icon192} className="hidden" />
        <img src={icon512} className="hidden" />
      </div>
    </Auth.Provider>
  );
};
