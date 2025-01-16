import { isAndroid, isIOS, isBrowser } from "mobile-device-detect";

export const useGetDeviceType = () => {
  if (isAndroid) return "android";

  if (isIOS) return "ios";

  if (isBrowser) return "browser";

  return "unknown";
};
