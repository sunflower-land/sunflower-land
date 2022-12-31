import { createNewAccount } from "lib/blockchain/AccountMinter";
import { getNewFarm } from "lib/blockchain/Farm";
import { BuildingName } from "features/game/types/buildings";
import { getKeys } from "features/game/types/craftables";
import { GameState, Inventory } from "features/game/types/game";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { CharityAddress } from "../components/CreateFarm";

type TrialRequest = {
  balance: string;
  experience: number;
  // TODO string numierc?
  inventory: Inventory;
  buildings: {
    name: BuildingName;
    x: number;
    y: number;
  }[];
};

type Request = {
  charity: string;
  token: string;
  captcha: string;
  trialProgress?: GameState;
  transactionId: string;
};

const API_URL = CONFIG.API_URL;

function prepareTrialProgress(game: GameState): TrialRequest {
  return {
    balance: game.balance.toString(),
    experience: game.bumpkin?.experience ?? 0,
    inventory: game.inventory,
    buildings: getKeys(game.buildings).reduce(
      (acc, name) => [
        ...acc,
        {
          name,
          x: game.buildings[name]?.[0].coordinates.x ?? 0,
          y: game.buildings[name]?.[0].coordinates.y ?? 0,
        },
      ],
      [] as TrialRequest["buildings"]
    ),
  };
}

export async function signTransaction(request: Request) {
  const body: Pick<Request, "charity" | "captcha"> & {
    trialProgress?: TrialRequest;
  } = {
    charity: request.charity,
    captcha: request.captcha,
  };

  if (request.trialProgress) {
    body.trialProgress = prepareTrialProgress(request.trialProgress);
  }

  const response = await window.fetch(`${API_URL}/account`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      "X-Transaction-ID": request.transactionId,
    },
    body: JSON.stringify(body),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.CREATE_ACCOUNT_SERVER_ERROR);
  }

  const {
    signature,
    charity,
    deadline,
    fee,
    bumpkinWearableIds,
    bumpkinTokenUri,
  } = await response.json();

  return {
    signature,
    charity,
    deadline,
    fee,
    bumpkinWearableIds,
    bumpkinTokenUri,
  };
}

type CreateFarmOptions = {
  charity: CharityAddress;
  token: string;
  captcha: string;
  transactionId: string;
  trialProgress?: GameState;
};

export async function createAccount({
  charity,
  token,
  captcha,
  transactionId,
  trialProgress,
}: CreateFarmOptions) {
  const transaction = await signTransaction({
    charity,
    token,
    captcha,
    transactionId,
    trialProgress,
  });

  await createNewAccount({
    ...transaction,
    web3: wallet.web3Provider,
    account: wallet.myAccount,
  });

  const farm = await getNewFarm(wallet.web3Provider, wallet.myAccount);

  return farm;
}
