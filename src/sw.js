/*
Copyright 2015, 2019, 2020, 2021 Google LLC. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
import { CONFIG } from "./lib/config";
const OFFLINE_VERSION = CONFIG.RELEASE_VERSION;
const OFFLINE_CACHE_NAME = `offline-v${OFFLINE_VERSION}`;
const OFFLINE_URL = "offline.html";

import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(OFFLINE_CACHE_NAME);
      await cache.addAll([
        new Request(OFFLINE_URL, { cache: "reload" }),
        "/src/assets/brand/sunflower_island_one.webp",
      ]);
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }

      // Clearing old caches.
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== OFFLINE_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })()
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) return preloadResponse;

          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log("Fetch failed; returning offline page instead.", error);

          const cache = await caches.open(OFFLINE_CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
  }
});
