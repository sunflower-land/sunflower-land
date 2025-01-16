import Decimal from "decimal.js-light";
import { INITIAL_STOCK, StockableName } from "features/game/lib/constants";
import { getKeys } from "features/game/types/decorations";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type ShipmentRestockAction = {
  type: "shipment.restocked";
};

type Options = {
  state: Readonly<GameState>;
  action: ShipmentRestockAction;
  createdAt?: number;
};

export const SHIPMENT_STOCK: Partial<Record<StockableName, number>> = {
  // Basic Crops
  "Sunflower Seed": 100,
  "Potato Seed": 50,
  "Rhubarb Seed": 50,
  "Pumpkin Seed": 30,
  "Zuchinni Seed": 30,
  // Medium Crops
  "Carrot Seed": 20,
  "Yam Seed": 20,
  "Cabbage Seed": 20,
  "Brocolli Seed": 20,
  "Soybean Seed": 20,
  "Beetroot Seed": 20,
  "Pepper Seed": 20,
  "Cauliflower Seed": 20,
  "Parsnip Seed": 10,
  // Tools
  Axe: 50,
  Pickaxe: 15,
  "Stone Pickaxe": 5,
  "Iron Pickaxe": 1,
  Rod: 10,
  // Sand Shovel
  "Sand Shovel": 5,
};

export function canRestockShipment({
  game,
  now = Date.now(),
}: {
  game: GameState;
  now?: number;
}) {
  const restockedAt = new Date(game.shipments.restockedAt ?? 0)
    .toISOString()
    .slice(0, 10);
  const today = new Date(now).toISOString().slice(0, 10);

  return restockedAt !== today;
}

export function nextShipmentAt(): number {
  // TODO - new players get as soon as out of stock (first time)

  const currentTime = Date.now();

  // Calculate the time until the next day in milliseconds
  const nextDay = new Date(currentTime);
  nextDay.setUTCHours(24, 0, 0, 0);

  return nextDay.getTime();
}

export function shipmentRestock({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!canRestockShipment({ game, now: createdAt })) {
      throw new Error("Already restocked today");
    }

    game.stock = getKeys(INITIAL_STOCK(game)).reduce((acc, name) => {
      let remainingStock = game.stock[name] ?? new Decimal(0);
      const totalStock = INITIAL_STOCK(game)[name];
      const shipmentAmount = SHIPMENT_STOCK[name] ?? 0;

      // If shipment amount will exceed total stock
      if (remainingStock.add(shipmentAmount).gt(totalStock)) {
        // return the difference between total and remaining stock
        remainingStock = remainingStock.add(totalStock.sub(remainingStock));
      } else {
        // else return shipment stock
        remainingStock = remainingStock.add(shipmentAmount);
      }

      return {
        ...acc,
        [name]: remainingStock,
      };
    }, {});

    game.shipments.restockedAt = createdAt;

    return game;
  });
}
