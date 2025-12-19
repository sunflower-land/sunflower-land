import { GameState } from "../../types/game";

export type PickupTrapAction = {
  type: "waterTrap.pickedUp";
  trapId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: PickupTrapAction;
  createdAt?: number;
};

export function pickupTrap({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return state;
}
