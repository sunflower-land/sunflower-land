import Decimal from "decimal.js-light";
import {
  FieldItem,
  GameState,
  InventoryItemName,
  Rock,
  Tree,
} from "../types/game";
import { PastAction } from "./gameMachine";
import { processEvent } from "./processEvent";

/**
 * Converts API response into a game state
 */
export function makeGame(farm: any): GameState {
  return {
    inventory: Object.keys(farm.inventory).reduce(
      (items, item) => ({
        ...items,
        [item]: new Decimal(farm.inventory[item]),
      }),
      {} as Record<InventoryItemName, Decimal>
    ),
    stock: Object.keys(farm.stock).reduce(
      (items, item) => ({
        ...items,
        [item]: new Decimal(farm.stock[item]),
      }),
      {} as Record<InventoryItemName, Decimal>
    ),
    trees: Object.keys(farm.trees).reduce(
      (items, item) => ({
        ...items,
        [item]: {
          ...farm.trees[item],
          wood: new Decimal(farm.trees[item].wood),
        },
      }),
      {} as Record<number, Tree>
    ),
    stones: Object.keys(farm.stones).reduce(
      (items, item) => ({
        ...items,
        [item]: {
          ...farm.stones[item],
          amount: new Decimal(farm.stones[item].amount),
        },
      }),
      {} as Record<number, Rock>
    ),
    iron: Object.keys(farm.iron).reduce(
      (items, item) => ({
        ...items,
        [item]: {
          ...farm.iron[item],
          amount: new Decimal(farm.iron[item].amount),
        },
      }),
      {} as Record<number, Rock>
    ),
    gold: Object.keys(farm.gold).reduce(
      (items, item) => ({
        ...items,
        [item]: {
          ...farm.gold[item],
          amount: new Decimal(farm.gold[item].amount),
        },
      }),
      {} as Record<number, Rock>
    ),
    skills: {
      farming: new Decimal(farm.skills.farming),
      gathering: new Decimal(farm.skills.gathering),
    },
    balance: new Decimal(farm.balance),
    fields: farm.fields,
    id: farm.id,
  };
}

/**
 * Reapply local events to the server version of the game
 */
export function updateGame(
  newGameState: GameState,
  actions: PastAction[],
  oldGameState: GameState
): GameState {
  newGameState.farmAddress = oldGameState.farmAddress;

  // // Lets not copy time based values from the server as users clocks are often not in sync
  newGameState.fields = Object.keys(newGameState.fields).reduce(
    (acc, fieldNumber) => {
      const id = Number(fieldNumber);

      return {
        [id]: {
          ...newGameState.fields[id],
          plantedAt:
            oldGameState.fields[id]?.plantedAt ||
            newGameState.fields[id].plantedAt,
        },
        ...acc,
      };
    },
    {} as GameState["fields"]
  );

  if (actions.length === 0) {
    return newGameState;
  }

  const updated = actions.reduce((state, action) => {
    return processEvent(state, action);
  }, newGameState);

  return updated;
}
