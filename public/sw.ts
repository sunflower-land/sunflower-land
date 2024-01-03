import { CONFIG } from "../src/lib/config";

const OFFLINE_VERSION = CONFIG.RELEASE_VERSION;

import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

registerRoute(
  new NavigationRoute(createHandlerBoundToURL("offline.html"), {
    allowlist: [/^\/offline$/],
  })
);

(self as any).skipWaiting();
clientsClaim();
