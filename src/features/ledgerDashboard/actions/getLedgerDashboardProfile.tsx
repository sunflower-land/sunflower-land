import { CONFIG } from "lib/config";

type LedgerEntry = {
  type: string;
  createdAt: number;
  farmId: number;
  balance: number;
};

type LedgerDashboardProfileData = {
  ledger: LedgerEntry[];
  teamFees: {
    weeklyFees: number;
  };
};

export const getLedgerDashboardProfile = async (
  token: string,
  id: string,
): Promise<LedgerDashboardProfileData> => {
  const res = await fetch(`${CONFIG.API_URL}/ledger-dashboard/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();

  return json;
};
