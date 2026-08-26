import { CONFIG } from "lib/config";
import { fetchWithRetry } from "lib/fetchWithRetry";

type Request = {
  token: string;
  farmId: number;
};

type Referree = {
  id: number;
  username?: string;
  createdAt: number;
  flower?: number;
  vip?: boolean;
};

type Response = {
  data: {
    referrees: Referree[];
  };
};

export const getReferrees = async ({
  token,
  farmId,
}: Request): Promise<Response> => {
  const res = await fetchWithRetry(
    `${CONFIG.API_URL}/data?type=referralRewards&id=${farmId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const response = await res.json();

  return { ...response.data };
};
