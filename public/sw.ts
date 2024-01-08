/// <reference lib="webworker" />
/// <reference no-default-lib="true"/>

import { CONFIG } from "../src/lib/config";

const OFFLINE_VERSION = CONFIG.RELEASE_VERSION + "2";

import { offlineFallback, googleFontsCache } from "workbox-recipes";
import { setDefaultHandler } from "workbox-routing";
import { NetworkOnly } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

// Disable workbox logs
(self as any).__WB_DISABLE_DEV_LOGS = true;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

setDefaultHandler(new NetworkOnly());
googleFontsCache();
offlineFallback();
