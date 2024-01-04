import { CONFIG } from "../src/lib/config";

const OFFLINE_VERSION = CONFIG.RELEASE_VERSION;

import { offlineFallback } from "workbox-recipes";
import { setDefaultHandler } from "workbox-routing";
import { NetworkOnly } from "workbox-strategies";

setDefaultHandler(new NetworkOnly());

offlineFallback();
