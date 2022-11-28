import { createMachine, Interpreter, assign } from "xstate";

import { wallet } from "lib/blockchain/wallet";
import { communityContracts } from "features/community/lib/communityContracts";

import { mintFrog, approve } from "../actions/mintFrog";
import { ErrorCode } from "lib/errors";
import { CONFIG } from "lib/config";

const frogAddress = CONFIG.FROG_CONTRACT;

export interface Context {
  state: {
    canMint?: boolean;
    approved?: boolean;
    minted?: boolean;
  };
  errorCode?: ErrorCode;
}

export type FrogEvent =
  | {
      type: "APPROVE";
    }
  | {
      type: "MINT";
    };

export type FrogState = {
  value:
    | "loading"
    | "check_token"
    | "blacklisted"
    | "check_whitelist"
    | "not_whitelisted"
    | "approve"
    | "approving"
    | "mint"
    | "minting"
    | "approved"
    | "minted"
    | "finished"
    | "error";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  FrogEvent,
  FrogState
>;

const assignFrogState = assign<Context, any>({
  state: (_, event) => event.data.state,
});

const assignErrorMessage = assign<Context, any>({
  errorCode: (_: Context, event: any) => event.data.message,
});

export const frogMachine = createMachine<Context, FrogEvent, FrogState>(
  {
    id: "frog",
    initial: "loading",
    context: {
      state: {},
    },
    states: {
      loading: {
        invoke: {
          src: async () => {
            const frogCount = await communityContracts
              .getFrog()
              .getTotalSupply();
            const isWhitelistEnabled = await communityContracts
              .getFrog()
              .isWhitelistingEnabled();
            const isWalletBlacklisted = await communityContracts
              .getFrog()
              .isWalletBlacklisted();

            return {
              canMint: frogCount < 520,
              isWhitelistEnabled,
              isWalletBlacklisted,
            };
          },
          onDone: [
            {
              target: "blacklisted",
              actions: assignFrogState,
              cond: (_, event) => event.data.isWalletBlacklisted,
            },
            {
              target: "check_whitelist",
              actions: assignFrogState,
              cond: (_, event) => event.data.isWhitelistEnabled,
            },
            {
              target: "check_token",
              actions: assignFrogState,
              cond: (_, event) => event.data.canMint,
            },
            {
              target: "finished",
              actions: assignFrogState,
            },
          ],
          onError: {
            target: "error",
            actions: assignErrorMessage,
          },
        },
      },
      check_whitelist: {
        invoke: {
          src: async () => {
            const isWalletWhitelisted = await communityContracts
              .getFrog()
              .isWalletWhitelisted();

            return { isWalletWhitelisted };
          },
          onDone: [
            {
              target: "check_token",
              cond: (_, event) => event.data.isWalletWhitelisted,
            },
            {
              target: "not_whitelisted",
            },
          ],
          onError: {
            target: "error",
            actions: assignErrorMessage,
          },
        },
      },
      check_token: {
        invoke: {
          src: async () => {
            const isTokenApproved = await wallet
              .getToken()
              .isTokenApprovedForContract(frogAddress);

            return { isTokenApproved };
          },
          onDone: [
            {
              target: "mint",
              cond: (_, event) => event.data.isTokenApproved,
            },
            {
              target: "approve",
            },
          ],
          onError: {
            target: "error",
            actions: assignErrorMessage,
          },
        },
      },
      approve: {
        on: {
          APPROVE: {
            target: "approving",
          },
        },
      },
      approving: {
        invoke: {
          src: async () => {
            const _approve = await approve(frogAddress);

            return { _approve };
          },
          onDone: {
            target: "check_token",
          },
          onError: {
            target: "error",
            actions: assignErrorMessage,
          },
        },
      },
      mint: {
        on: {
          MINT: {
            target: "minting",
          },
        },
      },
      minting: {
        invoke: {
          src: async () => {
            const farm = await wallet.getFarm()?.getFarms();
            const mint = await mintFrog({ farmId: Number(farm[0].tokenId) });

            return { mint };
          },
          onDone: {
            target: "minted",
          },
          onError: {
            target: "error",
            actions: assignErrorMessage,
          },
        },
      },
      minted: {},
      finished: {},
      error: {},
      blacklisted: {},
      not_whitelisted: {},
    },
  },
  {}
);
