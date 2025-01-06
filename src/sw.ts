/// <reference lib="webworker" />
/// <reference no-default-lib="true"/>

import "workbox-core";
import { googleFontsCache, offlineFallback } from "workbox-recipes";
import { registerRoute } from "workbox-routing";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CONFIG } from "./lib/config";
import { getMessaging } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";
import { app } from "./lib/firebase";
declare let self: ServiceWorkerGlobalScope;

const isTestnet = CONFIG.NETWORK === "amoy";
const GAME_ASSETS_PATH = isTestnet ? "/testnet-assets" : "/game-assets";
const gameAssetsCacheName = `${isTestnet ? "testnet" : "game"}-assets`;

// Disable workbox logs => do not delete this static import: import "workbox-core";
self.__WB_DISABLE_DEV_LOGS = true;

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Precaching strategy
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

if (import.meta.env.PROD) {
  // Game assets
  registerRoute(
    ({ url }) =>
      url.pathname.startsWith(GAME_ASSETS_PATH) &&
      !url.pathname.includes("map_extruded.png"),
    new StaleWhileRevalidate({
      cacheName: `${gameAssetsCacheName}`,
      plugins: [
        new ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
        }),
        new ExpirationPlugin({
          maxEntries: 60,
        }),
      ],
    }),
  );

  // Google Fonts
  googleFontsCache();
}

// Firebase Messaging
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  // eslint-disable-next-line no-console
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  // Customize notification here
  const notificationTitle = payload.notification?.title as string;
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "../public/icons/favicon.ico",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Offline fallback html page
offlineFallback();
