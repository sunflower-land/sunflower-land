import { metamask } from "lib/blockchain/metamask";
import { CharityAddress } from "../components/Donation";

type Request = {
  charity: string;
  donation: number;
  address: string;
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

  const { signature, charity, donation } = await response.json();
  return { signature, charity, donation };
}

export async function createFarm(charity: CharityAddress, donation: number) {
  const { signature, donation: amount } = await signTransaction({
    donation,
    charity,
    address: metamask.myAccount as string,
  });

  await metamask.getBeta().createFarm({
    signature,
    amount,
    charity,
  });
}
