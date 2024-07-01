import { wallet } from "lib/blockchain/wallet";
import { QuestName } from "features/game/types/quests";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { hasCompletedQuest, mintQuestItemOnChain } from "lib/blockchain/Quests";

async function waitForQuest(
  questId: number,
  bumpkinId: number,
  account: string,
): Promise<void> {
  const statuses = await hasCompletedQuest(
    wallet.web3Provider,
    account,
    [questId],
    bumpkinId,
  );

  if (statuses[0] === false) {
    await new Promise((res) => setTimeout(res, 5000));

    return waitForQuest(questId, bumpkinId, account);
  }
}

type Response = {
  signature: string;
  questId: number;
  bumpkinId: number;
  deadline: number;
  sender: string;
};

const API_URL = CONFIG.API_URL;

export async function questSignatureRequest(request: {
  farmId: number;
  questName: QuestName;
  token: string;
}): Promise<Response> {
  // Call backend list-trade
  const response = await window.fetch(
    `${API_URL}/bumpkin-quest/${request.farmId}`,
    {
      method: "POST",
      //mode: "no-cors",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${request.token}`,
        accept: "application/json",
      },
      body: JSON.stringify({
        item: request.questName,
      }),
    },
  );

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (response.status !== 200 || !response.ok) {
    throw new Error(ERRORS.LIST_TRADE_SERVER_ERROR);
  }

  const data = await response.json();

  return data;
}

export async function mintQuestItem({
  quest,
  jwt,
  farmId,
  account,
}: {
  quest: QuestName;
  jwt: string;
  farmId: number;
  account: string;
}) {
  await new Promise((res) => setTimeout(res, 1000));

  const { bumpkinId, deadline, questId, signature } =
    await questSignatureRequest({
      questName: quest,
      token: jwt,
      farmId,
    });

  await mintQuestItemOnChain({
    web3: wallet.web3Provider,
    account,
    bumpkinId,
    deadline,
    questId,
    signature,
  });

  await waitForQuest(questId, bumpkinId, account);

  return true;
}
