import { Player, PlayerUpdate } from "../types/types";

export const mergeResponse = (current: Player, update: PlayerUpdate) => {
  return {
    data: { ...current.data, ...update },
  } as Player;
};
