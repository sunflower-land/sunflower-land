import { CONFIG } from "lib/config";

export const getBumpkinBanner = async (
  token: string,
  type: "flower" | "progress",
): Promise<{ url: string }> => {
  const res = await fetch(`${CONFIG.API_URL}/banner/${type}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();

  return json;
};
