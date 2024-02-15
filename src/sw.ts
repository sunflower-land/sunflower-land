/// <reference lib="webworker" />
/// <reference no-default-lib="true"/>

import "workbox-core";
import { googleFontsCache } from "workbox-recipes";
import { NavigationRoute, registerRoute } from "workbox-routing";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CONFIG } from "./lib/config";

declare let self: ServiceWorkerGlobalScope;

const RELEASE_VERSION = CONFIG.RELEASE_VERSION;

// eslint-disable-next-line no-console
console.log(`[Service Worker] Release version: ${RELEASE_VERSION}`);

const isTestnet = CONFIG.NETWORK === "mumbai";
const GAME_ASSETS_PATH = isTestnet ? "/testnet-assets" : "/game-assets";
const gameAssetsCacheName = `${isTestnet ? "testnet" : "game"}-assets`;

// Disable workbox logs => do not delete this static import: import "workbox-core";
self.__WB_DISABLE_DEV_LOGS = true;

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// allow only fallback in dev: we don't want to cache anything in development
let allowlist: undefined | RegExp[];
if (import.meta.env.DEV) {
  allowlist = [/^offline.html$/];
}

// Precaching strategy
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

if (import.meta.env.PROD) {
  // Game assets
  registerRoute(
    ({ url }) => url.pathname.startsWith(GAME_ASSETS_PATH),
    new StaleWhileRevalidate({
      cacheName: `${gameAssetsCacheName}`,
      plugins: [
        new ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
        }),
      ],
    })
  );

  // Bootstrap
  registerRoute(
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
    new CacheFirst({
      cacheName: "bootstrap",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 1,
          maxAgeSeconds: 60 * 60 * 24 * 60, // 2 months
        }),
      ],
    })
  );

  // Google Fonts
  googleFontsCache();
}

// to allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("offline.html"), { allowlist })
);
