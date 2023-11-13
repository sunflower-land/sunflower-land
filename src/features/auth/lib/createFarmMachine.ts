import { wallet } from "lib/blockchain/wallet";
import { randomID } from "lib/utils/random";
import { assign, createMachine, Interpreter } from "xstate";
import { escalate } from "xstate/lib/actions";
import { signTransaction } from "../actions/createAccount";
import { CharityAddress } from "../components";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { estimateAccountGas } from "lib/blockchain/AccountMinter";
import { toWei } from "web3-utils";

export interface Context {
  token?: string;
  transactionId?: string;
  maticFee?: number;
  estimatedGas?: number;
  estimatedGasUSD?: number;
  maticBalance?: number;
}

type PickCharityEvent = {
  type: "PICK_CHARITY";
  charity: CharityAddress;
};

type TickEvent = {
  type: "TICK";
  balance: number;
};

type CreateFarmEvent = {
  type: "CREATE_FARM";
};

export type BlockchainEvent = PickCharityEvent | TickEvent | CreateFarmEvent;

export type CreateFarmMachineState = {
  value: "loading" | "hasEnoughMatic" | "notEnoughMatic";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  CreateFarmMachineState
>;

export const createFarmMachine = createMachine<
  Context,
  BlockchainEvent,
  CreateFarmMachineState
>(
  {
    id: "createFarmMachine",
    initial: "loading",
    context: {},
    states: {
      loading: {
        entry: "setTransactionId",
        invoke: {
          src: "loadBalance",
          onDone: [
            {
              target: "hasEnoughMatic",
              cond: (_, event) => event.data.maticBalance > event.data.maticFee,
              actions: "assignFee",
            },
            {
              target: "notEnoughMatic",
              actions: "assignFee",
            },
          ],
          onError: {
            actions: escalate((_, event) => ({
              message: event.data.message,
            })),
          },
        },
      },
      notEnoughMatic: {
        entry: () => onboardingAnalytics.logEvent("not_enough_matic"),
        invoke: {
          src: "updateBalance",
          onDone: [
            {
              target: "hasEnoughMatic",
              cond: (context: Context, event) => {
                if (context.maticFee === undefined) return true;

                return event.data.maticBalance > context.maticFee;
              },
            },
          ],
          onError: {
            actions: escalate((_, event) => ({
              message: event.data.message,
            })),
          },
        },
        after: {
          1000: "notEnoughMatic",
        },
      },
      hasEnoughMatic: {
        entry: () => onboardingAnalytics.logEvent("wallet_funded"),
      },
    },
  },
  {
    services: {
      loadBalance: async (context) => {
        const { fee, conversionRate, ...transaction } = await signTransaction({
          charity: CharityAddress.TheWaterProject,
          token: context.token as string,
          captcha: context.transactionId as string,
          transactionId: context.transactionId as string,
          type: "MATIC",
        });
        const maticBalance = await wallet.getMaticBalance();

        let estimatedGas = await estimateAccountGas({
          ...transaction,
          fee,
          web3: wallet.web3Provider,
          account: wallet.myAccount as string,
        });
        // Hard code 1 MATIC (~0.5USD) as required gas for the transaction
        // Somehow players are not able to mint without this in their wallet even
        // if gas is enough
        estimatedGas += Number(toWei("1"));

        const maticFee = Number(estimatedGas);
        const estimatedGasUSD = Number(estimatedGas) / Number(conversionRate);
        // eslint-disable-next-line no-console
        console.log({ estimatedGas, estimatedGasUSD, conversionRate });

        return { maticFee, maticBalance, estimatedGasUSD };
      },
      updateBalance: async () => {
        const maticBalance = await wallet.getMaticBalance();

        return { maticBalance: maticBalance.toNumber() };
      },
    },
    actions: {
      assignFee: assign<Context, any>({
        maticFee: (_, event) => event.data.maticFee,
        estimatedGasUSD: (_, event) => event.data.estimatedGasUSD,
      }),
      setTransactionId: assign<Context, any>({
        transactionId: () => randomID(),
      }),
    },
  }
);
