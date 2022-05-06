import React from "react";
import * as Auth from "features/auth/lib/Provider";
import { Navigation } from "./Navigation";

import "./styles.css";

import Decimal from "decimal.js-light";

/**
 * Decimal precision standard to handle ERC20 18 decimals + 12 decimal places reserved for in game actions
 */
Decimal.set({ toExpPos: 30 });
Decimal.set({ toExpNeg: -30 });

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
