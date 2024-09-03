import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { CONFIG } from "lib/config";
import { PortalApp } from "features/portal/PortalApp";

// TODO - tree shaking to minimise bundle size
if (CONFIG.PORTAL_APP) {
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <React.StrictMode>
      <PortalApp />
    </React.StrictMode>,
  );
} else {
  // Main Game
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
