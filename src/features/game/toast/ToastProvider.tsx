import React, { createContext, useCallback, useRef, useState } from "react";
import { randomID } from "lib/utils/random";
import {
  addToasts,
  getToastChanges,
  removeToasts,
  type Toast,
  type ToastState,
} from "./toastChanges";

export type { Toast, ToastItem } from "./toastChanges";

/**
 * The context of the toast provider.
 * @param toastList The toasts list for the toast panel.
 * @param setToastState Sets the latest state of the amounts the toast panel tracks.
 */
export const ToastContext = createContext<{
  toastsList: Toast[];
  setToastState: (state: ToastState) => void;
}>({
  toastsList: [],
  // eslint-disable-next-line no-console
  setToastState: console.log,
});

/**
 * The toast timeout in milliseconds.
 * A toast is removed after the timeout if no action has updated it.
 */
const TOAST_TIMEOUT_MS = 5000;

/**
 * The toast provider for setting the toast list for the toast panel.
 */
export const ToastProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [toastsList, setToastsList] = useState<Toast[]>([]);

  const toastState = useRef<ToastState>(undefined);

  /**
   * Sets the new state and adds a toast for every amount that differs from the state before it.
   * @param state The new state.
   */
  const setToastState = useCallback((state: ToastState) => {
    const previous = toastState.current;
    toastState.current = state;

    // if there is no state before this one, skip the toast logic because it is the first time setting the state
    if (!previous) return;

    const toasts = getToastChanges(previous, state).map((change) => ({
      ...change,
      id: `${randomID()}-${change.item}`,
    }));

    if (toasts.length === 0) return;

    setToastsList((toastList) => addToasts(toastList, toasts));

    // remove the toasts after the timeout, unless a later action has updated them
    window.setTimeout(() => {
      setToastsList((toastList) =>
        removeToasts(
          toastList,
          toasts.map(({ id }) => id),
        ),
      );
    }, TOAST_TIMEOUT_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ toastsList, setToastState }}>
      {children}
    </ToastContext.Provider>
  );
};
