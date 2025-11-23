import { CONFIG } from "lib/config";

export interface EconomyBatchCursor {
  reportDate: string;
  batchNumber: number;
}

export interface EconomyBatchResult {
  reportDate: string;
  batchNumber: number;
  farmCount: number;
  totals: Record<string, string>;
  holders: Record<string, number>;
  skills: Record<string, number>;
  islands: Record<string, number>;
  dailyActiveUsers: number;
  startedAt: string;
  completedAt: string;
  cursor?: EconomyBatchCursor;
}

export interface EconomyReportSummary {
  reportDate: string;
  farmCount: number;
  totals: Record<string, string>;
  holders: Record<string, number>;
  batches: number[];
  skills: Record<string, number>;
  islands: Record<string, number>;
  activityTotals?: Record<string, number>;
  coinsTotal?: string;
  balanceTotal?: string;
  xsollaUsdTotal?: string;
  newUsers?: number;
  retention?: {
    d1: number;
    d7: number;
    d30: number;
  };
  dailyActiveUsers: number;
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
  batches: EconomyBatchResult[];
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

    const latestSummary =
      entries.length > 0 ? entries[entries.length - 1].summary : null;

    return {
      summary: latestSummary,
      batches: [],
      reports: entries,
    };
  }

  const data = response.data ?? response;

  if (data.summary && data.stats) {
    return {
      summary: data.summary,
      batches: data.batches ?? [],
      reports: [
        {
          summary: data.summary,
          stats: data.stats,
        },
      ],
    };
  }

  const summary = data.summary ?? null;
  const batches = data.batches ?? [];
  const reports: EconomyReportEntry[] =
    data.reports ??
    (batches.length > 0
      ? (batches.map((batch: EconomyBatchResult) => ({
          summary: {
            reportDate: batch.reportDate,
            farmCount: batch.farmCount,
            totals: batch.totals,
            holders: batch.holders,
            batches: [batch.batchNumber],
            skills: batch.skills ?? {},
            islands: batch.islands ?? {},
            dailyActiveUsers: batch.dailyActiveUsers ?? 0,
          },
        })) as EconomyReportEntry[])
      : []);

  return {
    summary,
    batches,
    reports,
  };
};
