// MoonForge Web SDK — analytics pipeline (POST /api/send).
import {
  clearUserProps,
  collectAutoFields,
  getConfig,
  getDistinctId,
  getSessionId,
  getUserProps,
  isReady,
  markIdentified,
  postEvent,
  removeUserProp,
  resetAll,
  setDistinctId,
  setUserProp,
  unixSeconds,
  warnLog,
} from "./core.js";

function ensure() {
  if (!isReady()) {
    warnLog("call MoonForgeAnalytics.init() before tracking.");
    return false;
  }
  return true;
}

export function trackEvent(name, data = {}, opts = {}) {
  if (!ensure()) return undefined;
  return postEvent(
    {
      type: "event",
      payload: {
        ...collectAutoFields(),
        name,
        data: { ...getUserProps(), ...data },
      },
    },
    opts,
  );
}
export function trackScreenView(name, opts = {}) {
  if (!ensure()) return undefined;
  const auto = collectAutoFields();
  return postEvent(
    {
      type: "event",
      payload: {
        ...auto,
        name: "screen_view",
        title: name || auto.title,
        data: { ...getUserProps(), screen_name: name },
      },
    },
    opts,
  );
}
export function identify(userId, traits = {}) {
  if (!ensure()) return undefined;
  // Both are gated on a real userId. Marking identified without one would
  // flush the buffer under the anonymous id, which is exactly what buffering
  // exists to avoid.
  if (userId) {
    setDistinctId(userId);
    markIdentified();
  }
  return postEvent({
    type: "identify",
    payload: {
      game: getConfig().gameId,
      id: userId ?? getDistinctId(),
      data: traits,
      timestamp: unixSeconds(),
    },
  });
}
export function setUserProperty(k, v) {
  setUserProp(k, v);
}
export function removeUserProperty(k) {
  removeUserProp(k);
}
export function clearUserProperties() {
  clearUserProps();
}
export { getDistinctId, getSessionId };
export function reset() {
  resetAll();
}
export function flush() {
  return Promise.resolve(true);
}
