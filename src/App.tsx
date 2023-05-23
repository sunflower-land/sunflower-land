import React from "react";

import { initialise } from "lib/utils/init";

import "./styles.css";
import { Phaser } from "features/world/Phaser";

// Initialise Global Settings
initialise();

/**
 * Top level wrapper for providers
 */
export const App: React.FC = () => {
  return (
    // <Auth.Provider>
    //   <ErrorBoundary>
    //     <Navigation />
    //   </ErrorBoundary>
    // </Auth.Provider>
    <Phaser />
  );
};
