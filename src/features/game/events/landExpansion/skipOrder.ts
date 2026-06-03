import type { GameState } from "features/game/types/game";
import { populateOrders } from "./deliver";
import { getDayOfYear } from "lib/utils/time";
import { produce } from "immer";

export type SkipOrderAction = {
  type: "order.skipped";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: SkipOrderAction;
  createdAt?: number;
};

export function skipOrder({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const order = game.delivery.orders.find((order) => order.id === action.id);

    if (!order) throw new Error(`Order ${action.id} not found`);

    if (order.completedAt) throw new Error(`Order already completed`);

    if (order.readyAt > createdAt)
      throw new Error(`Order ${action.id} is not ready yet`);

    if (
      getDayOfYear(new Date(createdAt)) ===
        getDayOfYear(new Date(order.createdAt)) &&
      new Date(createdAt).getFullYear() ===
        new Date(order.createdAt).getFullYear()
    ) {
      throw new Error(
        `Order skipped within 24 hours; time now ${createdAt}, time of last skip ${order.createdAt}`,
      );
    }

    game.delivery.orders = game.delivery.orders.filter(
      (order) => order.id !== action.id,
    );

    game.delivery.orders = populateOrders(game, createdAt, true);

    game.delivery.skippedAt = createdAt;
    game.delivery.skippedCount = (game.delivery.skippedCount ?? 0) + 1;

    const npcs = game.npcs ?? {};
    const npc = npcs[order.from] ?? { deliveryCount: 0 };
    npc.skippedCount = (npc.skippedCount ?? 0) + 1;

    game.npcs = {
      ...npcs,
      [order.from]: npc,
    };

    return game;
  });
}
