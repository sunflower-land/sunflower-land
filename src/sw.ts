/* eslint-disable no-console */
/// <reference lib="webworker" />
/// <reference no-default-lib="true"/>

import "workbox-core";
import { offlineFallback, googleFontsCache } from "workbox-recipes";
import { NavigationRoute, registerRoute } from "workbox-routing";
import { CONFIG } from "./lib/config";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";

declare let self: ServiceWorkerGlobalScope;

const OFFLINE_VERSION = CONFIG.RELEASE_VERSION;

console.log("SW VERSION 1", OFFLINE_VERSION);

// Disable workbox logs => do not delete this static import: import "workbox-core";
self.__WB_DISABLE_DEV_LOGS = true;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

// allow only fallback in dev: we don't want to cache anything in dev
let allowlist: undefined | RegExp[];
if (import.meta.env.DEV) allowlist = [/^offline.html$/];

precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

googleFontsCache();
offlineFallback();

// to allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("offline.html"), { allowlist })
);
