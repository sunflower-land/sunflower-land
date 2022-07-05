import { createMachine } from "xstate";
import { loadTradingPost } from "./actions/loadTradingPost";

export interface Context {
  farmId: number;
  token: string;
}

export type BlockchainEvent = {
  type: "LIST";
};

export type BlockchainState = {
  value: "loading" | "trading" | "error";
  context: Context;
};

export const tradingPostMachine = createMachine<
  Context,
  BlockchainEvent,
  BlockchainState
>({
  initial: "loading",
  states: {
    loading: {
      invoke: {
        src: async (context) => {
          const farmSlots = await loadTradingPost(52);

          return { farmSlots };
        },
      },
    },
  },
});
