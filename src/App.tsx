import React from "react";
import * as Auth from "features/auth/lib/Provider";
import { Navigation } from "./Navigation";

import "./styles.css";

import { inspect } from "@xstate/inspect";

inspect({
  // options
  // url: 'https://stately.ai/viz?inspect', // (default)
  iframe: false, // open in new window
});

/**
 * Top level wrapper for providers
 */
export const App: React.FC = () => {
  return (
    <Auth.Provider>
      <Navigation />
    </Auth.Provider>
  );
};
