import { CONFIG } from "lib/config";
import { fetchWithRetry } from "lib/fetchWithRetry";

/***
 * For Debugging Purpose
 * Set to True when testing Banner Generation
 * */
process.env.DEBUG_BANNER = "false";

export const getBumpkinBanner = async (
  token: string,
  type: "flower" | "progress",
): Promise<{ url: string }> => {
  const res = await fetchWithRetry(`${CONFIG.API_URL}/banner/${type}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (process.env.DEBUG_BANNER === "false") {
    const json = await res.json();
    return json;
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  return { url };
};
