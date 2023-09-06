import { createNewAccount } from "lib/blockchain/AccountMinter";
import { getNewFarm } from "lib/blockchain/Farm";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { CharityAddress } from "../components/CreateFarm";
import { hasFeatureAccess } from "lib/flags";

type Request = {
  charity: string;
  token: string;
  captcha: string;
  transactionId: string;
  referrerId?: number;
  guestKey?: string;
  type?: "MATIC" | "USDC";
};

const API_URL = CONFIG.API_URL;

export async function signTransaction(request: Request) {
  const response = await window.fetch(`${API_URL}/account`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      "X-Transaction-ID": request.transactionId,
    },
    body: JSON.stringify({
      charity: request.charity,
      captcha: request.captcha,
      referrerId: request.referrerId,
      guestKey: request.guestKey,
      type: request.type,
    }),
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
    referrerId,
    referrerAmount,
    conversionRate,
  } = await response.json();

  return {
    signature,
    charity,
    deadline,
    fee,
    bumpkinWearableIds,
    bumpkinTokenUri,
    referrerId,
    referrerAmount,
    conversionRate,
  };
}

export async function signUp(request: Request) {
  const response = await window.fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${request.token}`,
      "X-Transaction-ID": request.transactionId,
    },
    body: JSON.stringify({
      charity: request.charity,
      captcha: request.captcha,
      referrerId: request.referrerId,
    }),
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.CREATE_ACCOUNT_SERVER_ERROR);
  }

  return await response.json();
}

type CreateFarmOptions = {
  charity: CharityAddress;
  token: string;
  captcha: string;
  transactionId: string;
  account: string;
  hasEnoughMatic: boolean;
  guestKey?: string;
};

export async function createAccount({
  charity,
  token,
  captcha,
  transactionId,
  account,
  guestKey,
  hasEnoughMatic,
}: CreateFarmOptions) {
  const referrerId = getReferrerId();

  if (hasFeatureAccess({}, "NEW_FARM_FLOW") && !hasEnoughMatic) {
    await signUp({
      charity,
      captcha,
      referrerId,
      token,
      transactionId,
    });
  } else {
    const transaction = await signTransaction({
      charity,
      token,
      captcha,
      transactionId,
      referrerId,
      guestKey,
      type: "MATIC",
    });

    await createNewAccount({
      ...transaction,
      web3: wallet.web3Provider,
      account,
      type: "MATIC",
    });
  }

  // For new farm mints always query with alchemy
  await wallet.overrideProvider();
  await getNewFarm(wallet.web3Provider, account);
}

const host = window.location.host.replace(/^www\./, "");
const REFERRER_LS_KEY = `sb_wiz.ref-key.v.${host}`;

export function saveReferrerId(id: string) {
  localStorage.setItem(REFERRER_LS_KEY, id);
}

export function getReferrerId() {
  const item = localStorage.getItem(REFERRER_LS_KEY);

  if (!item) {
    return undefined;
  }

  return Number(item);
}
