import { CONFIG } from "lib/config";

type RewardsDashboardData = {
  globalPoolCounters: { pool: string; count: number }[];
};

export const getRewardsDashboard = async (
  token: string,
): Promise<RewardsDashboardData> => {
  const res = await fetch(`${CONFIG.API_URL}/rewards-dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();

  return json;
};
