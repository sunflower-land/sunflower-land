import { BUMPKIN_QUEST_IDS, QuestName } from "features/game/types/quests";
import { wallet } from "lib/blockchain/wallet";

export async function loadQuests(quests: QuestName[], bumpkinId: number) {
  const IDS = quests.map((name) => BUMPKIN_QUEST_IDS[name]);

  const statuses = await wallet.getQuests().hasCompletedQuest(IDS, bumpkinId);
  console.log({ statuses });
  return quests.map((name, index) => ({
    name,
    isComplete: statuses[index],
  }));
}
