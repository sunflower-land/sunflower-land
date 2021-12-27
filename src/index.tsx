import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import App from "./dapp/App";
import * as serviceWorker from "./serviceWorker";

Sentry.init({
  dsn: "https://6bb1614ccfda4590b78ffb00a5c2d6d4@o1100427.ingest.sentry.io/6125492",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
