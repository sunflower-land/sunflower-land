import { CONFIG } from "lib/config";

export interface EconomyFarmCollectibles {
  totals: Record<string, string>;
  holders: Record<string, number>;
}

export interface EconomyFarmSkills {
  totals: Record<string, number>;
}

export interface EconomyFarmActivity {
  totals: Record<string, number>;
  holders: Record<string, number>;
}

export interface EconomyFarmCoins {
  total: number;
}

export interface EconomyFarmSnapshot {
  collectibles: EconomyFarmCollectibles;
  skills: EconomyFarmSkills;
  activity: EconomyFarmActivity;
  coins: EconomyFarmCoins;
  daus: number;
  maus: number;
}

export interface EconomyReportSummary {
  reportDate: string;
  farmCount: number;
  batches: number[];
  farm: EconomyFarmSnapshot;
}

export interface EconomyDataResponse {
  reports: EconomyReportSummary[];
}

export type EconomyDataRequest = {
  startDate: string;
  endDate: string;
};

export const getEconomyData = async ({
  startDate,
  endDate,
  token,
}: {
  startDate: string;
  endDate: string;
  token: string;
}): Promise<EconomyDataResponse> => {
  const url = new URL(`${CONFIG.API_URL}/data`);
  url.searchParams.set("type", "economy");
  url.searchParams.set("startDate", startDate.toString());
  url.searchParams.set("endDate", endDate.toString());

  const res = await window.fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(errorMessage || "Failed to fetch economy data");
  }

  const response = (await res.json()) as {
    data: EconomyReportSummary[];
  };

  const reports: EconomyReportSummary[] = response.data ?? [];

  return {
    reports,
  };
};
