import { CONFIG } from "lib/config";
import { randomID } from "lib/utils/random";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

type MetaCustomParams = Record<string, string | number | boolean | null>;

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&")}=([^;]*)`,
    ),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function getMetaBrowserIdentifiers(): {
  fbp?: string;
  fbc?: string;
} {
  const fbp = getCookie("_fbp");
  const fbc = getCookie("_fbc");

  return {
    fbp: fbp || undefined,
    fbc: fbc || undefined,
  };
}

export function initMetaPixel() {
  const pixelId = (CONFIG as any).META_PIXEL_ID as string | undefined;
  if (!pixelId) return;
  if (typeof window === "undefined") return;

  // Already initialised
  if (window.fbq) {
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
    return;
  }

  // Meta Pixel bootstrap (slightly adapted to TS / linting)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  const fbq: any = function (...args: any[]) {
    fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args);
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;
  w.fbq = fbq;
  w._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", pixelId);
  fbq("track", "PageView");
}

export function trackMetaCustomEvent(
  eventName: string,
  params?: MetaCustomParams,
  eventId?: string,
) {
  if (!CONFIG || typeof window === "undefined") return;
  if (!window.fbq) return;

  const id = eventId ?? randomID();

  // For custom events: fbq('trackCustom', name, params, { eventID })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window.fbq as any)("trackCustom", eventName, params ?? {}, { eventID: id });
}
