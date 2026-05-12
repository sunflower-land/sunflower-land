/* eslint-disable no-console */
/// <reference lib="webworker" />
/// <reference no-default-lib="true"/>

import "workbox-core";
import { googleFontsCache, offlineFallback } from "workbox-recipes";
import { registerRoute } from "workbox-routing";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
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
// Cache limits are intentionally conservative to prevent mobile browsers from
// evicting the entire origin's storage when quota is exceeded. A smaller cache
// that persists reliably is better than a large one the OS wipes between sessions.
// - 30 days: assets rarely change between chapters (~3 months); no need to expire sooner.
// - 300 entries: no category except "land" has more than ~150 unique assets.
// - 500 for land: it has ~420 unique tile/cloud/background sprites.
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;
const MAX_ENTRIES_DEFAULT = 300;
const MAX_ENTRIES_LAND = 500;

// Bump this version to trigger a one-time runtime cache purge on activation.
// This gives devices stuck with bloated caches a clean slate.
const CACHE_VERSION = 1;
// Resolve the protected asset base URL into a consistent origin/path pair so routing
// works whether the config is absolute (https://cdn/.../game-assets) or relative (/game-assets).
const normalizedProtectedUrl = (() => {
  try {
    return new URL(PROTECTED_IMAGE_PREFIX);
  } catch (error) {
    console.warn(
      "[service-worker] Falling back to current origin for protected asset matching",
      error,
    );
    return new URL(PROTECTED_IMAGE_PREFIX, self.location.origin);
  }
})();
// Trim any trailing slash so we avoid double-slashes when appending category segments.
const normalizedProtectedPath = normalizedProtectedUrl.pathname.replace(
  /\/+$/,
  "",
);
// Pre-compute both absolute (origin+path) and relative (pathname) prefixes for each category.
// This lets us match assets served from the expected CDN or the current host in preview builds.
const protectedCategoryMatchers = PROTECTED_IMAGE_CATEGORIES.map((category) => {
  const pathPrefix = `${normalizedProtectedPath}/${category}/`;
  return {
    category,
    urlPrefix: `${normalizedProtectedUrl.origin}${pathPrefix}`,
    pathPrefix,
  };
});

const hasProtectedPath = normalizedProtectedPath.length > 0;
const protectedBaseHref = hasProtectedPath
  ? `${normalizedProtectedUrl.origin}${normalizedProtectedPath}/`
  : null;

// Accept requests whose absolute URL or pathname aligns with a known protected category.
const isProtectedCategoryUrl = (url: URL) =>
  protectedCategoryMatchers.some(
    ({ urlPrefix, pathPrefix }) =>
      url.href.startsWith(urlPrefix) || url.pathname.startsWith(pathPrefix),
  );

const isWithinProtectedBasePath = (url: URL) => {
  if (!hasProtectedPath || !protectedBaseHref) return false;

  const pathnameWithSlash = `${normalizedProtectedPath}/`;
  return (
    url.href.startsWith(protectedBaseHref) ||
    url.pathname.startsWith(pathnameWithSlash)
  );
};

// Disable workbox logs => do not delete this static import: import "workbox-core";
self.__WB_DISABLE_DEV_LOGS = true;

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const versionCache = await caches.open("sw-cache-version");
      const versionResponse = await versionCache.match("version");
      const parsedVersion = versionResponse
        ? parseInt(await versionResponse.text(), 10)
        : 0;
      const storedVersion = Number.isFinite(parsedVersion) ? parsedVersion : 0;

      if (storedVersion < CACHE_VERSION) {
        const names = await caches.keys();
        await Promise.all(
          names
            .filter(
              (name) =>
                name.startsWith("protected-") ||
                name === "game-assets" ||
                name === "testnet-assets",
            )
            .map((name) => caches.delete(name)),
        );
        await versionCache.put("version", new Response(String(CACHE_VERSION)));
      }

      await self.clients.claim();
    })(),
  );
});

// Precaching strategy
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

if (import.meta.env.PROD) {
  // Private/protected assets per category
  protectedCategoryMatchers.forEach(({ category, urlPrefix, pathPrefix }) => {
    registerRoute(
      ({ url }) =>
        url.href.startsWith(urlPrefix) || url.pathname.startsWith(pathPrefix),
      new StaleWhileRevalidate({
        cacheName: `protected-${category}`,
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({
            maxAgeSeconds: THIRTY_DAYS_IN_SECONDS,
            maxEntries:
              category === "land" ? MAX_ENTRIES_LAND : MAX_ENTRIES_DEFAULT,
            purgeOnQuotaError: true,
          }),
        ],
      }),
    );
  });

  // Catch-all for protected assets that don't fit a known category
  if (hasProtectedPath) {
    registerRoute(
      ({ url }) =>
        isWithinProtectedBasePath(url) && !isProtectedCategoryUrl(url),
      new StaleWhileRevalidate({
        cacheName: "protected-misc",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({
            maxAgeSeconds: THIRTY_DAYS_IN_SECONDS,
            maxEntries: MAX_ENTRIES_DEFAULT,
            purgeOnQuotaError: true,
          }),
        ],
      }),
    );
  }

  // Game assets
  registerRoute(
    ({ url }) =>
      url.pathname.startsWith(GAME_ASSETS_PATH) &&
      !isProtectedCategoryUrl(url) &&
      !url.pathname.includes("map_extruded.png"),
    new StaleWhileRevalidate({
      cacheName: `${gameAssetsCacheName}`,
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({
          maxAgeSeconds: THIRTY_DAYS_IN_SECONDS,
          maxEntries: MAX_ENTRIES_DEFAULT,
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
