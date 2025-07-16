import { Player } from "../types/types";

export const mergeResponse = (current: Player, update: Partial<Player>) => {
  return {
    data: { ...current.data, ...update },
  } as Player;
};
