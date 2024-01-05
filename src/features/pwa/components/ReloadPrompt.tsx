import React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { ReactPortal } from "components/ui/ReactPortal";
import { Button } from "components/ui/Button";
import classNames from "classnames";

const CHECK_FOR_UPDATE_INTERVAL = 60 * 60 * 1000;

export function ReloadPrompt() {
  // Periodic Service Worker Updates
  // https://vite-pwa-org.netlify.app/guide/periodic-sw-updates.html#handling-edge-cases
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      registration &&
        setInterval(async () => {
          if (!(!registration.installing && navigator)) return;

          if ("connection" in navigator && !navigator.onLine) return;

          const resp = await fetch(swUrl, {
            cache: "no-store",
            headers: {
              cache: "no-store",
              "cache-control": "no-cache",
            },
          });

          if (resp?.status === 200) await registration.update();
        }, CHECK_FOR_UPDATE_INTERVAL);
    },
  });

  return (
    <ReactPortal>
      <div
        className={classNames(
          "fixed inset-x-0 bottom-0 transition-all duration-500 delay-1000 bg-brown-300",
          {
            "translate-y-20": !needRefresh,
            "-translate-y-0": needRefresh,
          }
        )}
        style={{ zIndex: 10000 }}
      >
        {true && (
          <div className="mx-auto max-w-2xl flex p-2 items-center">
            <div className="p-1 flex flex-1">
              <span className="text-xs">
                New content available, click on reload button to update.
              </span>
            </div>
            <Button
              className="max-w-max h-10"
              onClick={() => updateServiceWorker(true)}
            >
              Reload
            </Button>
          </div>
        )}
      </div>
    </ReactPortal>
  );
}
