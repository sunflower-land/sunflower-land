/* eslint-disable no-console */
/// <reference lib="webworker" />
/// <reference no-default-lib="true"/>

import "workbox-core";
import { googleFontsCache, offlineFallback } from "workbox-recipes";
import { registerRoute } from "workbox-routing";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CONFIG } from "./lib/config";
import { getMessaging, isSupported } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";
import "./lib/firebase";
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

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  console.log("Notification clicked", event);

  // Get the link from fcmOptions if it exists, otherwise fallback to "/play"
  const link = event.notification?.data?.link || "/play";
  event.waitUntil(self.clients.openWindow(link));
});

async function initializeFirebaseMessaging() {
  // Firebase Messaging
  const messaging = getMessaging();
  const supported = await isSupported();

  console.log(
    "[firebase-messaging-sw.js] Firebase Messaging supported",
    supported,
  );

  if (supported) {
    onBackgroundMessage(messaging, (payload) => {
      console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload,
      );

      if (!payload.data) return;

      const notificationTitle = payload.data.title;
      const notificationOptions = {
        body: payload.data.body,
        icon: payload.data.icon,
        data: {
          link: payload.data.link,
        },
      };

      self.registration.showNotification(
        notificationTitle,
        notificationOptions,
      );
    });
  }
}

initializeFirebaseMessaging().catch((error) =>
  console.error("[ERROR] Failed to initialize firebase messaging", error),
);

// Offline fallback html page
offlineFallback();
