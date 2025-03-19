import { CONFIG } from "lib/config";

type LedgerEntry = {
  type: string;
  createdAt: number;
  farmId: number;
  balance: number;
};

type FlowerDashboardProfileData = {
  ledger: LedgerEntry[];
  teamFees: {
    weeklyFees: number;
  };
};

export const getFlowerDashboardProfile = async (
  token: string,
  id: string,
): Promise<FlowerDashboardProfileData> => {
  const res = await fetch(`${CONFIG.API_URL}/flower-dashboard/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();

  return json;
};
