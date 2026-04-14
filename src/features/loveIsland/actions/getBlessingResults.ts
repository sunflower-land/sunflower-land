import { InventoryItemName } from "features/game/types/game";
import { CONFIG } from "lib/config";

type Request = {
  token: string;
  date: string;
};

type BlessingResults = {
  data?: {
    winnerCount: number;
    minimum: number;
    total: number;
    prize: InventoryItemName | "Flower" | "Coin";
    item: InventoryItemName;
    prizeAmount: number;
    participantCount: number;
    leaderboard: {
      rank: number;
      username: string;
      uri: string;
      amount: number;
      isWinner: boolean;
    }[];
  };
};

export const getBlessingResults = async ({
  token,
  date,
}: Request): Promise<BlessingResults & { lastUpdated: number }> => {
  const res = await fetch(
    `${CONFIG.API_URL}/data?type=blessingWinners&date=${date}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const response = await res.json();

  return response;
};
