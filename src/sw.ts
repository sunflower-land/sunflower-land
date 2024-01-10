/* eslint-disable no-console */
/// <reference lib="webworker" />
/// <reference no-default-lib="true"/>

import { CONFIG } from "./lib/config";

const OFFLINE_VERSION = CONFIG.RELEASE_VERSION;

console.log("SW VERSION 1", OFFLINE_VERSION);

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
