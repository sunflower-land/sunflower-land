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

export const getFlowerDashboard = async (): Promise<
  FlowerDashboardData & { lastUpdated: number }
> => {
  const res = await fetch(`${CONFIG.API_URL}/flower-dashboard`);

  const response = await res.json();

  return {
    lastUpdated: response.lastUpdated,
    ...response.data,
  };
};
