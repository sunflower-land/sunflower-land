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
  xsollaUsdTotal?: string;
}

export interface EconomyReportStats {
  reportDate: string;
  flowerWithdrawals: {
    total: number;
    uniqueFarms: number;
  };
  flowerDeposits: {
    total: number;
    uniqueFarms: number;
  };
  processedFees: {
    totalUsd: number;
    breakdown: Record<string, number>;
  };
}

export interface EconomyReportEntry {
  summary: EconomyReportSummary;
  stats?: EconomyReportStats;
}

export interface EconomyDataResponse {
  summary: EconomyReportSummary | null;
  reports: EconomyReportEntry[];
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

  const response = await res.json();

  if (Array.isArray(response.data)) {
    const entries = (
      response.data as Array<{
        summary: EconomyReportSummary;
        stats?: EconomyReportStats;
      }>
    ).map((entry) => ({
      summary: entry.summary,
      stats: entry.stats,
    }));

    return {
      summary: entries.length > 0 ? entries[entries.length - 1].summary : null,
      reports: entries,
    };
  }

  const data = response.data ?? response;

  if (data.summary && data.stats) {
    return {
      summary: data.summary,
      reports: [
        {
          summary: data.summary,
          stats: data.stats,
        },
      ],
    };
  }

  const summary = data.summary ?? null;
  const reports: EconomyReportEntry[] = data.reports ?? [];

  return {
    summary,
    reports,
  };
};
