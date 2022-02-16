import { metamask } from "lib/blockchain/metamask";
import { ERRORS } from "lib/errors";
import { CharityAddress } from "../components/Donation";

type Request = {
  charity: string;
  donation: number;
  address: string;
  signature: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export async function signTransaction(request: Request) {
  const response = await window.fetch(`${API_URL}/farm`, {
    // learn more about this API here: https://graphql-pokemon2.vercel.app/
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      ...request,
    }),
  });

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  const { signature, charity, donation } = await response.json();

  return { signature, charity, donation };
}

type CreateFarmOptions = {
  charity: CharityAddress;
  donation: number;
  signature: string;
};

export async function createFarm({
  donation,
  charity,
  signature,
}: CreateFarmOptions) {
  const address = metamask.myAccount as string;
  const transaction = await signTransaction({
    donation,
    charity,
    address,
    signature,
  });

  const farm = metamask.getFarm().onCreated(address);

  await metamask.getBeta().createFarm(transaction);

  const newFarm = await farm;
  console.log({ newFarm });

  return newFarm;
}
