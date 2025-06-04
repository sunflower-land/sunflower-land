import { CONFIG } from "lib/config";

export type Racer = {
  id: number;
  username?: string;
  tokenUri: string;
  startYPercent: number;
};

type Request = {
  token: string;
};

export const getRacers = async ({
  token,
}: Request): Promise<{ racers: Racer[]; closesAt: number }> => {
  const res = await fetch(`${CONFIG.API_URL}/data?type=getRacers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await res.json();

  return response.data;
};
