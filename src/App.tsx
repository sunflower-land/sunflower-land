import React from "react";
import * as Auth from "features/auth/lib/Provider";
import { Navigation } from "./Navigation";

import "./styles.css";

import Decimal from "decimal.js-light";

/**
 * Decimal precision standard for repo follows ERC20 18 decimal standard
 */
Decimal.set({ toExpPos: 19 });
Decimal.set({ toExpNeg: -19 });

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
