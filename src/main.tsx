import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { CONFIG } from "lib/config";
import { PortalApp } from "features/portal/PortalApp";
import "lib/firebase";

// TODO - tree shaking to minimise bundle size
if (CONFIG.PORTAL_APP) {
  const rootElement = document.getElementById("root")!;
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <PortalApp />
    </React.StrictMode>,
  );
} else {
  // Main Game
  const rootElement = document.getElementById("root")!;
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
