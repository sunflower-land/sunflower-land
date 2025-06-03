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
}: Request): Promise<{ racers: Racer[] }> => {
  return {
    racers: [
      {
        id: 3,
        username: "Spencer",
        tokenUri:
          "https://api.sunflower-land.com/bumpkins/metadata/3_v1_122_2_54_33_39_89_58_136_30_31_16",
        startYPercent: 0.027476993056333,
      },
      {
        id: 21,
        tokenUri:
          "https://api.sunflower-land.com/bumpkins/metadata/11544_v1_55_1_54_61_20_22_44",
        startYPercent: 0.5398968890391582,
      },
      {
        id: 202,
        tokenUri: "1_v1_32_1_5_13_18_22_23",
        startYPercent: 0.6833672690254047,
      },
    ],
  };
  const res = await fetch(`${CONFIG.API_URL}/data?type=getRacers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const response = await res.json();

  return response.data;
};
