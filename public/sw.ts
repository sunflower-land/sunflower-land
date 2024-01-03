import { CONFIG } from "../src/lib/config";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

const OFFLINE_VERSION = CONFIG.RELEASE_VERSION;

declare const self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
