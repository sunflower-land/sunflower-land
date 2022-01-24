import { metamask } from "lib/blockchain/metamask";

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

  const { signature } = await response.json();
  return signature;
}

export async function createFarm() {
  const signature = await signTransaction({
    donation: 0,
    charity: "0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377",
    address: metamask.myAccount as string,
  });

  console.log({
    signature,
    donation: 0,
    charity: "0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377",
    address: metamask.myAccount as string,
  });

  await metamask.getSunflowerLand().createFarm({
    signature,
    amount: 0,
    charity: "0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377",
  });

  console.log("Created!");
}
