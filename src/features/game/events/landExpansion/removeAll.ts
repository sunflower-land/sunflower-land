import { produce } from "immer";

import { removeBuilding } from "./removeBuilding";
import { removeBeehive } from "./removeBeehive";
import { removeCollectible } from "./removeCollectible";
import { removeCrimstone } from "./removeCrimstone";
import { removeFlowerBed } from "./removeFlowerBed";
import { removeFruitPatch } from "./removeFruitPatch";
import { removeGold } from "./removeGold";
import { removeIron } from "./removeIron";
import { removeLavaPit } from "./removeLavaPit";
import { removeOilReserve } from "./removeOilReserve";
import { removePlot } from "./removePlot";
import { removeStone } from "./removeStone";
import { removeSunstone } from "./removeSunstone";
import { removeTree } from "./removeTree";
import { removeNFT } from "./removeNFT";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { PlaceableLocation } from "features/game/types/collectibles";
import { GameState } from "features/game/types/game";

export type RemoveAllAction = {
  type: "items.removed";
  location: PlaceableLocation;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveAllAction;
  createdAt?: number;
};

export function removeAll({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    //   Remove Collectibles
    const collectibles =
      action.location === "home"
        ? stateCopy.home.collectibles
        : stateCopy.collectibles;

    getObjectEntries(collectibles).forEach(([name, collectibleGroup]) => {
      if (collectibleGroup) {
        collectibleGroup.forEach((collectible) => {
          try {
            stateCopy = removeCollectible({
              state: stateCopy,
              action: {
                type: "collectible.removed",
                name,
                id: collectible.id,
                location: action.location,
              },
              createdAt,
            });
          } catch (e) {
            // Ignore errors
          }
        });
      }
    });

    //   Remove Buds
    const buds = stateCopy.buds ?? {};
    Object.entries(buds)
      .filter(([, bud]) => bud.location === action.location)
      .forEach(([id]) => {
        try {
          stateCopy = removeNFT({
            state: stateCopy,
            action: {
              type: "nft.removed",
              id,
              nft: "Bud",
              location: action.location,
            },
            createdAt,
          });
        } catch (e) {
          // Ignore errors
        }
      });

    const pets = stateCopy.pets?.nfts ?? {};
    Object.entries(pets)
      .filter(([, bud]) => bud.location === action.location)
      .forEach(([id]) => {
        try {
          stateCopy = removeNFT({
            state: stateCopy,
            action: {
              type: "nft.removed",
              id,
              nft: "Pet",
              location: action.location,
            },
            createdAt,
          });
        } catch (e) {
          // Ignore errors
        }
      });

    //   Only remove farm items if the location is farm
    if (action.location === "farm") {
      //   Remove Beehives
      const beehives = stateCopy.beehives ?? {};
      Object.keys(beehives).forEach((id) => {
        try {
          stateCopy = removeBeehive({
            state: stateCopy,
            action: {
              type: "beehive.removed",
              id,
            },
            createdAt,
          });
        } catch (e) {
          // Ignore errors
        }
      });

      //   Remove Buildings
      const buildings = stateCopy.buildings ?? {};
      getObjectEntries(buildings).forEach(([name, buildingGroup]) => {
        if (
          name === "Town Center" ||
          name === "House" ||
          name === "Mansion" ||
          name === "Manor"
        ) {
          // Skip removing these buildings
          return;
        }

        if (buildingGroup) {
          buildingGroup.forEach((building) => {
            try {
              stateCopy = removeBuilding({
                state: stateCopy,
                action: { type: "building.removed", name, id: building.id },
                createdAt,
              });
            } catch (e) {
              // Ignore errors
            }
          });
        }
      });

      //   Remove Crimstone
      const crimstones = stateCopy.crimstones;
      Object.keys(crimstones).forEach((id) => {
        try {
          stateCopy = removeCrimstone({
            state: stateCopy,
            action: {
              type: "crimstone.removed",
              id,
            },
            createdAt,
          });
        } catch (e) {
          // Ignore errors
        }
      });

      //   Remove Flower Bed
      const flowerBeds = stateCopy.flowers.flowerBeds;
      Object.keys(flowerBeds).forEach((id) => {
        try {
          stateCopy = removeFlowerBed({
            state: stateCopy,
            action: {
              type: "flowerBed.removed",
              id,
            },
            createdAt,
          });
        } catch (e) {
          // Ignore errors
        }
      });

      //   Remove Fruit Patch
      const fruitPatches = stateCopy.fruitPatches;
      Object.keys(fruitPatches).forEach((id) => {
        try {
          stateCopy = removeFruitPatch({
            state: stateCopy,
            action: {
              type: "fruitPatch.removed",
              id,
            },
            createdAt,
          });
        } catch (e) {
          // Ignore errors
        }
      });

      //   Remove Gold
      const gold = stateCopy.gold;
      Object.keys(gold).forEach((id) => {
        try {
          stateCopy = removeGold({
            state: stateCopy,
            action: {
              type: "gold.removed",
              id,
            },
            createdAt,
          });
        } catch (e) {
          // Ignore errors
        }
      });

      //   Remove Iron
      const iron = stateCopy.iron;
      Object.keys(iron).forEach((id) => {
        try {
          stateCopy = removeIron({
            state: stateCopy,
            action: {
              type: "iron.removed",
              id,
            },
            createdAt,
          });
        } catch (e) {
          // Ignore errors
        }
      });

      //   Remove Lava Pit
      const lavaPits = stateCopy.lavaPits;
      Object.keys(lavaPits).forEach((id) => {
        try {
          stateCopy = removeLavaPit({
            state: stateCopy,
            action: {
              type: "lavaPit.removed",
              id,
            },
            createdAt,
          });
        } catch (e) {
          // Ignore errors
        }
      });

      //   Remove Oil Reserves
      const oilReserves = stateCopy.oilReserves;
      Object.keys(oilReserves).forEach((id) => {
        try {
          stateCopy = removeOilReserve({
            state: stateCopy,
            action: {
              type: "oilReserve.removed",
              id,
            },
            createdAt,
          });
        } catch (e) {
          // Ignore errors
        }
      });

      //   Remove Plots
      const crops = stateCopy.crops;
      Object.keys(crops).forEach((id) => {
        try {
          stateCopy = removePlot({
            state: stateCopy,
            action: {
              type: "plot.removed",
              id,
            },
            createdAt,
          });
        } catch (e) {
          // Ignore errors
        }
      });

      //   Remove Stone
      const stones = stateCopy.stones;
      Object.keys(stones).forEach((id) => {
        try {
          stateCopy = removeStone({
            state: stateCopy,
            action: {
              type: "stone.removed",
              id,
            },
            createdAt,
          });
        } catch (e) {
          // Ignore errors
        }
      });

      //   Remove Sunstone
      const sunstones = stateCopy.sunstones;
      Object.keys(sunstones).forEach((id) => {
        try {
          stateCopy = removeSunstone({
            state: stateCopy,
            action: {
              type: "sunstone.removed",
              id,
            },
            createdAt,
          });
        } catch (e) {
          // Ignore errors
        }
      });

      //   Remove Trees
      const trees = stateCopy.trees;
      Object.keys(trees).forEach((id) => {
        try {
          stateCopy = removeTree({
            state: stateCopy,
            action: {
              type: "tree.removed",
              id,
            },
            createdAt,
          });
        } catch (e) {
          // Ignore errors
        }
      });
    }

    return stateCopy;
  });
}
