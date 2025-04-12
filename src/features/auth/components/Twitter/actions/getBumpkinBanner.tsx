import { CONFIG } from "lib/config";

export const getBumpkinBanner = async (
  token: string,
): Promise<{ url: string }> => {
  const res = await fetch(`${CONFIG.API_URL}/banner/progress`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();

  return json;
};
