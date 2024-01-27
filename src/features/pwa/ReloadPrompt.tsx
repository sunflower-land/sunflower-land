import React, { useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { ReactPortal } from "components/ui/ReactPortal";
import { Button } from "components/ui/Button";
import classNames from "classnames";
import { CONFIG } from "lib/config";

const CHECK_FOR_UPDATE_INTERVAL = 20 * 1000;

export function ReloadPrompt() {
  const [checking, setChecking] = useState(false);
  // Periodic Service Worker Updates
  // https://vite-pwa-org.netlify.app/guide/periodic-sw-updates.html#handling-edge-cases
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      registration &&
        setInterval(async () => {
          setChecking(true);
          // eslint-disable-next-line no-console
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
          setChecking(false);
        }, CHECK_FOR_UPDATE_INTERVAL);
    },
  });

  return (
    <ReactPortal>
      <div className="fixed top-28 safe-pt left-1/2 -translate-x-1/2 text-xs flex flex-col">
        <span>{`Checking for update: ${checking}`}</span>
        <span>{`Needs update: ${needRefresh}`}</span>
        <span>{`Release version: ${
          CONFIG.RELEASE_VERSION.length > 10
            ? CONFIG.RELEASE_VERSION.slice(-6)
            : CONFIG.RELEASE_VERSION
        }`}</span>
      </div>
      <div
        className={classNames(
          "fixed inset-x-0 bottom-0 transition-all duration-500 delay-1000 bg-brown-300 safe-pb safe-px",
          {
            "translate-y-20": !needRefresh,
            "-translate-y-0": needRefresh,
          }
        )}
        style={{ zIndex: 10000 }}
      >
        {needRefresh && (
          <div className="mx-auto max-w-2xl flex p-2 items-center safe-pb safe-px">
            <div className="p-1 flex flex-1">
              <span className="text-xs">
                New content available, click on reload button to update.
              </span>
            </div>
            <Button
              className="max-w-max h-10"
              onClick={() => {
                updateServiceWorker(true);
                // Safety net for if updateServiceWorker fails
                window.location.reload();
              }}
            >
              Reload
            </Button>
          </div>
        )}
      </div>
    </ReactPortal>
  );
}
