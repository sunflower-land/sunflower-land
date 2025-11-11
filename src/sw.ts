/* eslint-disable no-console */
/// <reference lib="webworker" />
/// <reference no-default-lib="true"/>

import "workbox-core";
import { googleFontsCache, offlineFallback } from "workbox-recipes";
import { registerRoute } from "workbox-routing";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CONFIG } from "./lib/config";
import { getMessaging, isSupported } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";
import "./lib/firebase";
declare let self: ServiceWorkerGlobalScope;

const isTestnet = CONFIG.NETWORK === "amoy";
const GAME_ASSETS_PATH = isTestnet ? "/testnet-assets" : "/game-assets";
const gameAssetsCacheName = `${isTestnet ? "testnet" : "game"}-assets`;
const PROTECTED_IMAGE_PREFIX = CONFIG.PROTECTED_IMAGE_URL.replace(/\/+$/, "");
const PROTECTED_IMAGE_CATEGORIES = [
  "achievements",
  "animals",
  "announcements",
  "aura",
  "brand",
  "buildings",
  "captcha",
  "composters",
  "crafting",
  "cropMachine",
  "crops",
  "decorations",
  "desert",
  "flowers",
  "fruit",
  "fx",
  "icons",
  "land",
  "npcs",
  "potion_house",
  "resources",
  "sfts",
  "sfx",
  "skills",
  "songs",
  "sound-effects",
  "splash",
  "tools",
  "tutorials",
  "ui",
  "vfx",
  "volcano",
  "world",
] as const;
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;
const PROTECTED_PREFIXES = PROTECTED_IMAGE_CATEGORIES.map(
  (category) => `${PROTECTED_IMAGE_PREFIX}/${category}/`,
);

const isProtectedCategoryUrl = (href: string) =>
  PROTECTED_PREFIXES.some((categoryPrefix) => href.startsWith(categoryPrefix));

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
  // Private/protected assets per category
  PROTECTED_IMAGE_CATEGORIES.forEach((category, index) => {
    const categoryPrefix = PROTECTED_PREFIXES[index];

    registerRoute(
      ({ url }) => url.href.startsWith(categoryPrefix),
      new CacheFirst({
        cacheName: `protected-${category}`,
        plugins: [
          new ExpirationPlugin({
            maxAgeSeconds: THIRTY_DAYS_IN_SECONDS,
            purgeOnQuotaError: true,
          }),
        ],
      }),
    );
  });

  // Catch-all for protected assets that don't fit a known category
  registerRoute(
    ({ url }) =>
      url.href.startsWith(PROTECTED_IMAGE_PREFIX) &&
      !isProtectedCategoryUrl(url.href),
    new CacheFirst({
      cacheName: "protected-misc",
      plugins: [
        new ExpirationPlugin({
          maxAgeSeconds: THIRTY_DAYS_IN_SECONDS,
          purgeOnQuotaError: true,
        }),
      ],
    }),
  );

  // Game assets
  registerRoute(
    ({ url }) =>
      url.pathname.startsWith(GAME_ASSETS_PATH) &&
      !isProtectedCategoryUrl(url.href) &&
      !url.pathname.includes("map_extruded.png"),
    new CacheFirst({
      cacheName: `${gameAssetsCacheName}`,
      plugins: [
        new ExpirationPlugin({
          maxAgeSeconds: THIRTY_DAYS_IN_SECONDS,
          purgeOnQuotaError: true,
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
  const supported = await isSupported();

  console.log(
    "[firebase-messaging-sw.js] Firebase Messaging supported",
    supported,
  );

  if (supported) {
    const messaging = getMessaging();

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
