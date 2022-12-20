import { wallet } from "lib/blockchain/wallet";
import { BUMPKIN_QUEST_IDS, QuestName } from "features/game/types/quests";

async function waitForItem(id: number): Promise<void> {
  const balance = await wallet.getBumpkinItems().balanceOf(id);

  if (balance <= 1) {
    await new Promise((res) => setTimeout(res, 5000));

    return waitForItem(id);
  }
}

export async function mintQuestItem(quest: QuestName) {
  await new Promise((res) => setTimeout(res, 1000));

  // Wait for item to exist in wallet.
  const id = BUMPKIN_QUEST_IDS[quest];
  await waitForItem(id);

  return true;
}
