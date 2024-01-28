import { useState } from "react";

export interface RegisterSWOptions {
  immediate?: boolean;
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
  /**
   * Called once the service worker is registered (requires version `0.12.8+`).
   *
   * @param swScriptUrl The service worker script url.
   * @param registration The service worker registration if available.
   */
  onRegisteredSW?: (
    swScriptUrl: string,
    registration: ServiceWorkerRegistration | undefined
  ) => void;
  onRegisterError?: (error: unknown) => void;
  /**
   * Called when the service worker is installing for the first time.
   *
   * This callback will also be called when the service worker is installed (no service worker param provided).
   *
   * @param state true when the service worker is installing for first time and false when installed.
   * @param sw The service worker instance.
   */
  onInstalling?: (state: boolean, sw?: ServiceWorker) => void;
  /**
   * Called when a new service worker version is found and it is installing.
   *
   * This callback will also be called when the service worker is installed (no service worker param provided).
   *
   * @param state true when the service worker is installing and false when installed.
   * @param sw The service worker instance.
   */
  onUpdateFound?: (state: boolean, sw?: ServiceWorker) => void;
}

export function useRegisterServiceWorker(options: RegisterSWOptions = {}) {
  const {
    immediate = true,
    onNeedRefresh,
    onOfflineReady,
    onRegisteredSW,
    onRegisterError,
    onInstalling,
    onUpdateFound,
  } = options;

  // for first sw installation: will be set to false once the sw activates for the first time
  const [installing, setInstalling] = useState(false);
  // for updatefound sw installation: will be set to false once the sw activates
  const [updating, setUpdating] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  const updateServiceWorker = DISABLE_REGISTER_SW
    ? () => Promise.resolve()
    : registerSW({
        immediate,
        onNeedRefresh() {
          setNeedRefresh(true);
          onNeedRefresh?.();
        },
        onOfflineReady() {
          setOfflineReady(true);
          onOfflineReady?.();
        },
        onRegisteredSW,
        onRegisterError,
        onInstalling(state, sw) {
          setInstalling(state);
          onInstalling?.(state, sw);
        },
        onUpdateFound(state, sw) {
          setUpdating(state);
          onUpdateFound?.(state, sw);
        },
      });

  // TODO: change this using sw registration state suing the code in the reload prompt (pwa-creation branch)
  function checkForWaitingServiceWorkers() {
    return new Promise((resolve) => {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        let waitingSWs = 0;
        for (const registration of registrations) {
          if (registration.waiting) {
            waitingSWs++;
          }
        }
        // eslint-disable-next-line no-console
        console.log("waitingSWs", waitingSWs);
        resolve(waitingSWs);
      });
    });
  }

  return {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    installing: [installing, setInstalling],
    updating: [updating, setUpdating],
    checkForWaitingServiceWorkers,
    updateServiceWorker,
  };
}

function registerSW(options: RegisterSWOptions) {
  const {
    immediate = false,
    onNeedRefresh,
    onOfflineReady,
    onRegisteredSW,
    onRegisterError,
    onInstalling,
    onUpdateFound,
  } = options;

  let wb: import("@vite-pwa/workbox-window").Workbox | undefined;
  // eslint-disable-next-line prefer-const
  let registerPromise: Promise<void>;

  async function updateServiceWorker() {
    await registerPromise;
    // Send a message to the waiting service worker,
    // instructing it to activate.
    // Note: for this to work, you have to add a message
    // listener in your service worker. See below.
    wb?.messageSkipWaiting();
  }

  async function register() {
    if ("serviceWorker" in navigator) {
      wb = await import("@vite-pwa/workbox-window")
        .then(({ Workbox }) => {
          return new Workbox(__SW__, {
            scope: __SW_SCOPE__,
            type: __SW_TYPE__,
          });
        })
        .catch((e) => {
          onRegisterError?.(e);
          return undefined;
        });

      if (!wb) return;

      if (!AUTO_DESTROY_SW) {
        let onNeedRefreshCalled = false;
        const showSkipWaitingPrompt = (
          event?: import("@vite-pwa/workbox-window").WorkboxLifecycleWaitingEvent
        ) => {
          if (event && onNeedRefreshCalled && event.isExternal === true)
            window.location.reload();

          onNeedRefreshCalled = true;
          // \`event.wasWaitingBeforeRegister\` will be false if this is
          // the first time the updated service worker is waiting.
          // When \`event.wasWaitingBeforeRegister\` is true, a previously
          // updated service worker is still waiting.
          // You may want to customize the UI prompt accordingly.

          // Assumes your app has some sort of prompt UI element
          // that a user can either accept or reject.
          // Assuming the user accepted the update, set up a listener
          // that will reload the page as soon as the previously waiting
          // service worker has taken control.
          wb?.addEventListener("controlling", (event) => {
            if (process.env.NODE_ENV === "development") {
              // eslint-disable-next-line no-console
              console.log("controlling::prompt", {
                isUpdate: event.isUpdate,
                isExternal: event.isExternal,
              });
            }
            if (event.isUpdate === true || event.isExternal === true)
              window.location.reload();
          });

          onNeedRefresh?.();
        };
        wb.addEventListener("installing", (event) => {
          if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
            console.log("installing::prompt", {
              isUpdate: event.isUpdate,
              isExternal: event.isExternal,
            });
          }
          event.isUpdate === true || event.isExternal === true
            ? onUpdateFound?.(true, event.sw)
            : onInstalling?.(true, event.sw);
        });
        wb.addEventListener("installed", (event) => {
          if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
            console.log("installed::prompt", {
              isUpdate: event.isUpdate,
              isExternal: event.isExternal,
            });
          }
          event.isUpdate === true || event.isExternal === true
            ? onUpdateFound?.(false, event.sw)
            : onInstalling?.(false, event.sw);
          if (typeof event.isUpdate === "undefined") {
            if (typeof event.isExternal !== "undefined") {
              if (event.isExternal) showSkipWaitingPrompt();
              else if (!onNeedRefreshCalled) onOfflineReady?.();
            } else {
              if (event.isExternal) window.location.reload();
              else if (!onNeedRefreshCalled) onOfflineReady?.();
            }
          } else if (!event.isUpdate) {
            onOfflineReady?.();
          }
        });
        // Add an event listener to detect when the registered
        // service worker has installed but is waiting to activate.
        wb.addEventListener("waiting", showSkipWaitingPrompt);
      }

      // register the service worker
      wb.register({ immediate })
        .then((r) => {
          if (onRegisteredSW) onRegisteredSW(__SW__, r);
        })
        .catch((e) => {
          onRegisterError?.(e);
        });
    }
  }

  registerPromise = register();

  return updateServiceWorker;
}
