import {
  InventoryItemName,
  Minigame,
  MinigamePrize,
} from "features/game/types/game";
import { CONFIG } from "lib/config";
import { MinigameName } from "features/game/types/minigames";

type Request = {
  token: string;
  name: MinigameName;
  farmId: number;
};

export type MinigameResult = {
  data?: {
    progress: Minigame;
    prize?: MinigamePrize;
  };
};

export const getMinigame = async ({
  token,
  name,
  farmId,
}: Request): Promise<MinigameResult> => {
  const res = await fetch(
    `${CONFIG.API_URL}/data?type=minigameProgress&name=${name}&farmId=${farmId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const response = await res.json();

  return response;
};
