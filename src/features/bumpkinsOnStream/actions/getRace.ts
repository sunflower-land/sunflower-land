import { CONFIG } from "lib/config";

export type ReadyRacers = {
  id: number[];
};

type Request = {
  token: string;
};

export type Race = {
  racers: ReadyRacers;
  startsAt: number;
  duration: number;
};

export const getRace = async ({ token }: Request): Promise<Race> => {
  const res = await fetch(`${CONFIG.API_URL}/data?type=getRace`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await res.json();

  return response.data;
};
