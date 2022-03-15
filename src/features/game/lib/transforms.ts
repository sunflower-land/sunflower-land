import Decimal from "decimal.js-light";
import { GameState, InventoryItemName, Rock, Tree } from "../types/game";

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
    balance: new Decimal(farm.balance),
    fields: farm.fields,
    id: farm.id,
  };
}

/**
 * Merges in server side changes into the local state
 */
export function updateGame(
  newGameState: GameState,
  oldGameState: GameState
): GameState {
  if (!newGameState) {
    return oldGameState;
  }

  // Only update random number values generated from the server
  return {
    ...oldGameState,
    // Update any random numbers from the server
    trees: Object.keys(oldGameState.trees).reduce((trees, treeId) => {
      const id = Number(treeId);
      const tree = oldGameState.trees[id];
      return {
        ...trees,
        [id]: {
          ...tree,
          wood: newGameState.trees[id].wood,
        },
      };
    }, {} as Record<number, Tree>),
    stones: Object.keys(oldGameState.stones).reduce((stones, treeId) => {
      const id = Number(treeId);
      const rock = oldGameState.stones[id];
      return {
        ...stones,
        [id]: {
          ...rock,
          amount: newGameState.stones[id].amount,
        } as Rock,
      };
    }, {} as Record<number, Rock>),
    iron: Object.keys(oldGameState.iron).reduce((iron, treeId) => {
      const id = Number(treeId);
      const rock = oldGameState.iron[id];
      return {
        ...iron,
        [id]: {
          ...rock,
          amount: newGameState.iron[id].amount,
        } as Rock,
      };
    }, {} as Record<number, Rock>),
    gold: Object.keys(oldGameState.gold).reduce((gold, treeId) => {
      const id = Number(treeId);
      const rock = oldGameState.gold[id];
      return {
        ...gold,
        [id]: {
          ...rock,
          amount: newGameState.gold[id].amount,
        } as Rock,
      };
    }, {} as Record<number, Rock>),
  };
}
