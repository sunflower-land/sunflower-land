import { createMachine, Interpreter, assign } from "xstate";

import { communityContracts } from "features/community/lib/communityContracts";

import {
  incubateTadpole,
  removeIncubator,
  claimIncubator,
} from "../actions/incubateTadpole";
import { ErrorCode } from "lib/errors";
import { CONFIG } from "lib/config";

const frogAddress = CONFIG.FROG_CONTRACT;
const incubatorAddress = CONFIG.INCUBATOR_CONTRACT;

export interface Context {
  state: {
    hasTadpoleOrIncubator?: boolean;
    isFrogApproved?: boolean;
    isTadpoleApproved?: boolean;
  };
  errorCode?: ErrorCode;
  selectedFrog?: number;
  selectedTadpole?: number;
  incubated?: boolean;
}

export type TadpoleEvent =
  | {
      type: "APPROVE_FROG";
    }
  | {
      type: "APPROVE_TADPOLE";
    }
  | {
      type: "INCUBATE";
    }
  | {
      type: "REMOVE";
    }
  | {
      type: "CLAIM";
    };

export type TadpoleState = {
  value:
    | "loading"
    | "check_frog_approve"
    | "check_tadpole_approve"
    | "approve_frog"
    | "approve_tadpole"
    | "approving_frog"
    | "approving_tadpole"
    | "display_vaults"
    | "incubate"
    | "incubating"
    | "incubated"
    | "remove"
    | "removing"
    | "removed"
    | "claim"
    | "claiming"
    | "claimed"
    | "unapproved"
    | "no_tadpole_or_incubator"
    | "error";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  TadpoleEvent,
  TadpoleState
>;

const assignTadpoleState = assign<Context, any>({
  state: (_, event) => event.data.state,
});

const assignErrorMessage = assign<Context, any>({
  errorCode: (_: Context, event: any) => event.data.message,
});

export const incubateMachine = createMachine<
  Context,
  TadpoleEvent,
  TadpoleState
>(
  {
    id: "incubator",
    initial: "loading",
    context: {
      state: {},
    },
    states: {
      loading: {
        invoke: {
          src: async () => {
            const tadpoleCount = await communityContracts
              .getIncubator()
              .getTadpoleIds();

            const incubatorCount = await communityContracts
              .getIncubator()
              .incubatorIds();

            const hasTadpoleOrIncubator =
              tadpoleCount.length >= 1 || incubatorCount.length >= 1;

            return { hasTadpoleOrIncubator };
          },
          onDone: [
            {
              target: "check_frog_approve",
              cond: (_, event) => event.data.hasTadpoleOrIncubator,
            },
            {
              target: "no_tadpole_or_incubator",
            },
          ],
          onError: {
            target: "error",
            actions: assignErrorMessage,
          },
        },
      },
      check_frog_approve: {
        invoke: {
          src: async () => {
            const isFrogApproved = await communityContracts
              .getFrog()
              .isApprovedForAll(incubatorAddress);

            return { isFrogApproved };
          },
          onDone: [
            {
              target: "check_tadpole_approve",
              cond: (_, event) => event.data.isFrogApproved,
            },
            {
              target: "approve_frog",
            },
          ],
        },
      },
      approve_frog: {
        on: {
          APPROVE_FROG: {
            target: "approving_frog",
          },
        },
      },
      approving_frog: {
        invoke: {
          src: async () => {
            const _approve_frogs = await communityContracts
              .getFrog()
              .setApprovalAllFrogs(incubatorAddress, true);

            return { _approve_frogs };
          },
          onDone: {
            target: "check_tadpole_approve",
          },
          onError: {
            target: "error",
            actions: assignErrorMessage,
          },
        },
      },
      check_tadpole_approve: {
        invoke: {
          src: async () => {
            const isTadpoleApproved = await communityContracts
              .getTadpole()
              .isApprovedForAll(incubatorAddress);

            return { isTadpoleApproved };
          },
          onDone: [
            {
              target: "display_vaults",
              cond: (_, event) => event.data.isTadpoleApproved,
            },
            {
              target: "approve_tadpole",
            },
          ],
        },
      },
      approve_tadpole: {
        on: {
          APPROVE_TADPOLE: {
            target: "approving_tadpole",
          },
        },
      },
      approving_tadpole: {
        invoke: {
          src: async () => {
            const _approve_tadpole = await communityContracts
              .getTadpole()
              .setApprovalAllTadpoles(incubatorAddress, true);

            return { _approve_tadpole };
          },
          onDone: {
            target: "check_tadpole_approve",
          },
          onError: {
            target: "error",
            actions: assignErrorMessage,
          },
        },
      },
      incubate: {
        on: {
          INCUBATE: {
            target: "incubating",
          },
        },
      },
      remove: {
        on: {
          REMOVE: {
            target: "removing",
          },
        },
      },
      claim: {
        on: {
          CLAIM: {
            target: "claiming",
          },
        },
      },
      incubating: {
        invoke: {
          src: async (request: Context, event: any) => {
            const { frogId, tadpoleId } = event;

            const req = {
              frogId,
              tadpoleId,
            };
            const incubated = await incubateTadpole(req);

            return { incubated };
          },
          onDone: {
            target: "incubated",
          },
          onError: {
            target: "error",
            actions: assignErrorMessage,
          },
        },
      },
      display_vaults: {
        on: {
          INCUBATE: {
            target: "incubating",
          },
          REMOVE: {
            target: "removing",
          },
          CLAIM: {
            target: "claiming",
          },
        },
      },
      claiming: {
        invoke: {
          src: async (request: Context, event: any) => {
            const { incubatorId } = event;
            const claimed = await claimIncubator(incubatorId);

            return { claimed };
          },
          onDone: {
            target: "claimed",
          },
          onError: {
            target: "error",
            actions: assignErrorMessage,
          },
        },
      },
      removing: {
        invoke: {
          src: async (request: Context, event: any) => {
            const { incubatorId } = event;
            const removed = await removeIncubator(incubatorId);

            return { removed };
          },
          onDone: {
            target: "removed",
          },
          onError: {
            target: "error",
            actions: assignErrorMessage,
          },
        },
      },
      incubated: {},
      removed: {},
      claimed: {},
      unapproved: {},
      no_tadpole_or_incubator: {},
      error: {},
    },
  },
  {}
);
