import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

// TODO - tree shaking to minimise bundle size
// if (CONFIG.PORTAL_APP) {
//   ReactDOM.render(
//     <React.StrictMode>
//       <PortalApp />
//     </React.StrictMode>,
//     document.getElementById("root")
//   );
// } else {
// Main Game
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
// }
