import React from "react";

import * as Auth from "features/auth/lib/Provider";
import background from "assets/land/background.png";

import { Navigation } from "./Navigation";

import "./styles.css";

/**
 * Top level wrapper for providers
 */
export const App: React.FC = () => {
  return (
    <Auth.Provider>
      {/* Load background in as early as possible so its fully downloaded when a user starts the game */}
      <img src={background} className="hidden" />
      <Navigation />
    </Auth.Provider>
  );
};
