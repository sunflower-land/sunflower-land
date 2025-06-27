import { CONFIG } from "lib/config";

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
  const res = await fetch(
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
