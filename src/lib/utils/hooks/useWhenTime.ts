import { useEffect } from "react";

type UseWhenTimeOptions = {
  /**
   * Target time in milliseconds since epoch.
   * When the current time reaches or passes this value, `callback` will run.
   */
  targetTime: number;

  /**
   * Function to call when the time condition is met.
   * Will run at most once per hook usage.
   */
  callback: () => void;

  /**
   * Whether the hook is active.
   * - true  (default): schedule the callback
   * - false: do nothing and clear any existing timeout
   */
  enabled?: boolean;
};

/**
 * Calls a callback once when real time reaches a target timestamp.
 *
 * This hook:
 * - Schedules a `setTimeout` for `targetTime - Date.now()` ms.
 * - If `targetTime` is already in the past when the effect runs, it calls
 *   `callback` immediately.
 * - Cleans up any existing timeout when `targetTime` or `enabled` changes,
 *   or when the component unmounts.
 *
 * The `enabled` flag lets you always call the hook (Rules of Hooks)
 * while turning the behavior on/off declaratively.
 *
 * @example
 * // Auto-close a modal at `readyAt`
 * useWhenTime({
 *   targetTime: readyAt,
 *   callback: onClose,
 * });
 *
 * @example
 * // Only auto-close when the panel is actually visible
 * useWhenTime({
 *   targetTime: readyAt,
 *   callback: onClose,
 *   enabled: isOpen,
 * });
 *
 * @example
 * // Guard for async-loaded times
 * useWhenTime({
 *   targetTime: readyAt ?? 0,
 *   callback: onClose,
 *   enabled: readyAt !== null,
 * });
 */

export function useWhenTime({
  targetTime,
  callback,
  enabled = true,
}: UseWhenTimeOptions) {
  useEffect(() => {
    if (!enabled) return;

    const now = Date.now();
    const delay = targetTime - now;

    // If already in the past, fire immediately
    if (delay <= 0) {
      callback();
      return;
    }

    const id = window.setTimeout(callback, delay);

    return () => {
      clearTimeout(id);
    };
  }, [targetTime, callback, enabled]);
}
