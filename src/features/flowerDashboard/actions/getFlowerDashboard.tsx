import { CONFIG } from "lib/config";

type TopPlayer = {
  player: string;
  amount: number;
  tokenUri: string;
};

export type FlowerDashboardData = {
  sevenDayData: {
    totalSpent: number;
    uniqueSpenders: number;
    totalDeposits: number;
  };
  pools: {
    community: number;
    admin: number;
    rewards: number;
    auction: number;
  };
  tokenInfo: {
    liquidity: number;
    thirtyDayVolume: number;
    fdv: number;
    priceUsd: number;
    inGamePercent: number;
    inWalletsPercent: number;
  };
  totalHolders: number;
  teamFees: number;
  topEarners: TopPlayer[];
  topBurners: TopPlayer[];
  topGameBurns: Record<string, number>;
};

type Request = {
  farmId: number;
  token: string;
};

export const getFlowerDashboard = async ({
  farmId,
  token,
}: Request): Promise<FlowerDashboardData & { lastUpdated: number }> => {
  const res = await fetch(
    `${CONFIG.API_URL}/data?type=flowerDashboard&farmId=${farmId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const response = await res.json();

  return { lastUpdated: response.data.lastUpdated, ...response.data.data };
};
