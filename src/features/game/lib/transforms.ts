import Decimal from "decimal.js-light";
import { getKeys } from "../types/craftables";
import {
  FieldItem,
  GameState,
  Inventory,
  InventoryItemName,
  LandExpansion,
  LandExpansionPlot,
  LandExpansionRock,
  LandExpansionTree,
  Rock,
  Tree,
} from "../types/game";

/**
 * Converts API response into a game state
 */
export function makeGame(farm: any): GameState {
  console.log({ farm });
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
    chickens: farm.chickens || {},
    stockExpiry: farm.stockExpiry || {},
    skills: {
      farming: new Decimal(farm.skills.farming),
      gathering: new Decimal(farm.skills.gathering),
    },
    balance: new Decimal(farm.balance),
    fields: farm.fields,
    id: farm.id,
    tradeOffer: farm.tradeOffer
      ? {
          ...farm.tradeOffer,
          ingredients: farm.tradeOffer.ingredients.map((ingredient: any) => ({
            ...ingredient,
            amount: new Decimal(ingredient.amount),
          })),
        }
      : undefined,
    grubOrdersFulfilled: farm.grubOrdersFulfilled,
    grubShop: farm.grubShop
      ? {
          ...farm.grubShop,
          orders: farm.grubShop.orders.map((order: any) => ({
            ...order,
            sfl: new Decimal(order.sfl),
          })),
        }
      : undefined,
    tradedAt: farm.tradedAt,
    plots: farm.plots,
    expansions: farm.expansions,
    expansionRequirements: farm.expansionRequirements
      ? {
          resources: farm.expansionRequirements.resources.map(
            (resource: any) => ({
              item: resource.item,
              amount: new Decimal(resource.amount),
            })
          ),
          sfl: new Decimal(farm.expansionRequirements.sfl),
          seconds: farm.expansionRequirements.seconds,
          bumpkinLevel: farm.expansionRequirements.bumpkinLevel,
        }
      : undefined,
    bumpkin: farm.bumpkin,
    buildings: farm.buildings,
    airdrops: farm.airdrops,
    collectibles: farm.collectibles,
    warCollectionOffer: farm.warCollectionOffer,
    mysteryPrizes: farm.mysteryPrizes,
  };
}

type Rocks = Record<number, Rock>;

/**
 * Updates a rock with the new amount of mineral inside of it
 */
function updateRocks(oldRocks: Rocks, newRocks: Rocks): Rocks {
  return Object.keys(oldRocks).reduce((rocks, rockId) => {
    const id = Number(rockId);
    const rock = oldRocks[id];
    return {
      ...rocks,
      [id]: {
        ...rock,
        amount: newRocks[id].amount,
      } as Rock,
    };
  }, {} as Record<number, Rock>);
}

function updatePlots(
  oldPlots: Record<number, LandExpansionPlot>,
  newPlots: Record<number, LandExpansionPlot>
) {
  return getKeys(oldPlots).reduce((plots, plotId) => {
    const { crop: oldCrop } = oldPlots[plotId];
    const { crop: newCrop } = newPlots[plotId];

    const hasCrop = oldCrop && newCrop;

    return {
      ...plots,
      [plotId]: {
        ...oldPlots[plotId],
        ...(hasCrop && {
          crop: {
            ...oldCrop,
            amount: newCrop.amount,
            ...(newCrop.reward && { reward: newCrop.reward }),
          },
        }),
      },
    };
  }, {} as Record<number, LandExpansionPlot>);
}

function updateTrees(
  oldTrees: Record<number, LandExpansionTree>,
  newTrees: Record<number, LandExpansionTree>
) {
  return getKeys(oldTrees).reduce((trees, treeId) => {
    const { wood } = oldTrees[treeId];
    const nextDropAmount = newTrees[treeId].wood?.amount;
    const reward = newTrees[treeId].wood?.reward;

    return {
      ...trees,
      [treeId]: {
        ...oldTrees[treeId],
        ...(wood && {
          wood: {
            ...wood,
            amount: nextDropAmount,
            ...(reward && { reward }),
          },
        }),
      },
    };
  }, {} as Record<number, LandExpansionTree>);
}

function updateStones(
  oldStones: Record<number, LandExpansionRock>,
  newStones: Record<number, LandExpansionRock>
) {
  return getKeys(oldStones).reduce((stones, stoneId) => {
    const { stone } = oldStones[stoneId];
    const nextDropAmount = newStones[stoneId].stone?.amount;

    return {
      ...stones,
      [stoneId]: {
        ...oldStones[stoneId],
        ...(stone && {
          stone: {
            ...stone,
            amount: nextDropAmount,
          },
        }),
      },
    };
  }, {} as Record<number, LandExpansionRock>);
}

export function updateExpansions(
  oldExpansions: LandExpansion[],
  newExpansions: LandExpansion[]
): LandExpansion[] {
  // TODO: Add Fruit and Mines when they're implemented
  return oldExpansions.map((expansion, index) => {
    const {
      plots: oldPlots,
      trees: oldTrees,
      stones: oldStones,
      gold: oldGold,
      iron: oldIron,
    } = expansion;
    const {
      plots: newPlots,
      trees: newTrees,
      stones: newStones,
      gold: newGold,
      iron: newIron,
    } = newExpansions[index];

    const hasPlots = oldPlots && newPlots;
    const hasTrees = oldTrees && newTrees;
    const hasStones = oldStones && newStones;
    const hasGold = oldGold && newGold;
    const hasIron = oldIron && newIron;

    return {
      ...expansion,
      ...(hasPlots && { plots: updatePlots(oldPlots, newPlots) }),
      ...(hasTrees && { trees: updateTrees(oldTrees, newTrees) }),
      ...(hasStones && { stones: updateStones(oldStones, newStones) }),
      ...(hasGold && { gold: updateStones(oldGold, newGold) }),
      ...(hasIron && { iron: updateStones(oldIron, newIron) }),
    };
  });
}

/**
 * Merge RNG from server
 */
export function updateGame(
  newGameState: GameState,
  oldGameState: GameState
): GameState {
  if (!newGameState) {
    return oldGameState;
  }

  // TODO: How to handle expansions????

  // Only update random number values generated from the server
  try {
    return {
      ...oldGameState,
      // Update random reward
      fields: Object.keys(oldGameState.fields).reduce((fields, fieldId) => {
        const id = Number(fieldId);
        const field = oldGameState.fields[id];
        return {
          ...fields,
          [id]: {
            ...field,
            reward: newGameState.fields[id].reward,
          },
        };
      }, {} as Record<number, FieldItem>),
      // Update tree with the random amount of wood from the server
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
      stones: updateRocks(oldGameState.stones, newGameState.stones),
      iron: updateRocks(oldGameState.iron, newGameState.iron),
      gold: updateRocks(oldGameState.gold, newGameState.gold),
      skills: newGameState.skills,
      chickens: newGameState.chickens,
      expansions: updateExpansions(
        oldGameState.expansions,
        newGameState.expansions
      ),
    };
  } catch (e) {
    console.log({ e });
    return oldGameState;
  }
}

/**
 * Returns the lowest values out of 2 game states
 */
export function getLowestGameState({
  first,
  second,
}: {
  first: GameState;
  second: GameState;
}) {
  const balance = first.balance.lt(second.balance)
    ? first.balance
    : second.balance;

  const items = [
    ...new Set([
      ...(Object.keys(first.inventory) as InventoryItemName[]),
      ...(Object.keys(second.inventory) as InventoryItemName[]),
    ]),
  ];

  const inventory: Inventory = items.reduce((inv, name) => {
    const firstAmount = first.inventory[name] || new Decimal(0);
    const secondAmount = second.inventory[name] || new Decimal(0);

    const amount = firstAmount.lt(secondAmount) ? firstAmount : secondAmount;

    if (amount.eq(0)) {
      return inv;
    }

    return {
      ...inv,
      [name]: amount,
    };
  }, {});

  return {
    balance,
    inventory,
  };
}
