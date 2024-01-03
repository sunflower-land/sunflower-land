import { CONFIG } from "../src/lib/config";
import { cleanupOutdatedCaches } from "workbox-precaching";
import { setDefaultHandler, setCatchHandler } from "workbox-routing";

const OFFLINE_VERSION = CONFIG.RELEASE_VERSION;

declare const self: ServiceWorkerGlobalScope;

// turn off logging
(self as any).__WB_DISABLE_DEV_LOGS = true;

cleanupOutdatedCaches();

import { warmStrategyCache } from "workbox-recipes";

import { CacheFirst, NetworkOnly } from "workbox-strategies";

// Fallback assets to cache
const FALLBACK_HTML_URL = "/offline.html";
const FALLBACK_ASSETS = ["/offline/ocean.webp", "/offline/logo_v2_large.png"];
const FALLBACK_STRATEGY = new CacheFirst();

// Warm the runtime cache with a list of asset URLs
warmStrategyCache({
  urls: [FALLBACK_HTML_URL, ...FALLBACK_ASSETS],
  strategy: FALLBACK_STRATEGY,
});

// Use a stale-while-revalidate strategy to handle requests by default.
setDefaultHandler(new NetworkOnly());

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
setCatchHandler(async ({ event, request }) => {
  // The warmStrategyCache recipe is used to add the fallback assets ahead of
  // time to the runtime cache, and are served in the event of an error below.
  // Use `event`, `request`, and `url` to figure out how to respond, or
  // use request.destination to match requests for specific resource types.
  if (request.destination === "document") {
    return FALLBACK_STRATEGY.handle({ event, request: FALLBACK_HTML_URL });
  }

  if (request.destination === "image") {
    const asset = `/${request.url.split(request.referrer)[1]}`;

    if (FALLBACK_ASSETS.includes(asset)) {
      return FALLBACK_STRATEGY.handle({ event, request: asset });
    }
  }

  return Response.error();
});
