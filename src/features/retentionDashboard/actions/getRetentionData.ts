import { CONFIG } from "lib/config";

export type RetentionRecord = {
  signups?: number;
  d1?: number;
  d7?: number;
  d30?: number;
  marketplaceFlower?: number;
  usd?: number;
  gemFlower?: number;
  totalDays?: number;
};

export type RetentionEntry = RetentionRecord & { date: string };

export type FunnelActivityCounts = Partial<Record<string, number>>;

export type RetentionDataResponse = {
  reportDate?: string;
  maus?: number;
  entries: RetentionEntry[];
  referred?: RetentionEntry[];
  paid?: RetentionEntry[];
  funnels?: Record<string, FunnelActivityCounts>;
};

const recordToEntries = (
  raw: Record<string, RetentionRecord | undefined>,
): RetentionEntry[] =>
  Object.entries(raw ?? {})
    .map(([date, record]) => ({ date, ...record }))
    .filter((entry) => Boolean(entry.date));

const RETENTION_API_URL = `${CONFIG.API_URL}/data`;

export const getRetentionData = async ({
  token,
}: {
  token: string;
}): Promise<RetentionDataResponse> => {
  const url = new URL(RETENTION_API_URL);
  url.searchParams.set("type", "retention");

  const res = await window.fetch(url.toString(), {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(errorMessage || "Failed to fetch retention data");
  }

  const response = (await res.json()) as {
    data?: {
      reportDate?: string;
      dates?: Record<string, RetentionRecord | undefined>;
      referred?: Record<string, RetentionRecord | undefined>;
      paid?: Record<string, RetentionRecord | undefined>;
      funnels?: Record<string, FunnelActivityCounts>;
      maus?: number;
      mau?: number;
      activeUsers?: number;
    };
  };

  const rawDates = response.data?.dates ?? {};
  const entries = recordToEntries(rawDates);
  const referred = response.data?.referred
    ? recordToEntries(response.data.referred)
    : undefined;
  const paid = response.data?.paid
    ? recordToEntries(response.data.paid)
    : undefined;

  return {
    reportDate: response.data?.reportDate,
    maus:
      response.data?.maus ?? response.data?.mau ?? response.data?.activeUsers,
    entries,
    referred,
    paid,
    funnels: response.data?.funnels,
  };
};
