import React from "react";

import * as Auth from "features/auth/lib/Provider";

import {AppProvider} from "./AppProvider";

import {Navigation} from "./Navigation";

import "./styles.css";

/**
 * Top level wrapper for providers
 */
export const App: React.FC = () => {
  return (
    <AppProvider>
      <Auth.Provider>
        <Navigation/>
      </Auth.Provider>
    </AppProvider>
  );
};
