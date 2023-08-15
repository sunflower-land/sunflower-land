import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useState } from "react";
import { DeliveryPanelContent } from "../deliveries/DeliveryPanelContent";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { useRandomItem } from "lib/utils/hooks/useRandomItem";
import { defaultDialogue, npcDialogues } from "../deliveries/dialogues";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { InventoryItemName } from "features/game/types/game";
import bg from "assets/ui/brown_background.png";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";

interface Props {
  onClose: () => void;
}

const obsessionDialogues = (itemName: string) => [
  `Ah, the ${itemName}! Such a fascinating item. I don't wish to own it, merely to admire. Share it with me, and Crow Feathers will be your reward.`,
  `So you've come with the ${itemName}? I've longed to see one up close. Show it to me, and Crow Feathers shall be yours in gratitude.`,
  `Embarking on an adventure with the ${itemName}, are we? Just a glimpse is all I ask. In return, you'll receive a handful of Crow Feathers.`,
  `The ${itemName}! A marvel to behold. Let me just take a moment to admire its beauty. And for your patience, I offer Crow Feathers.`,
  `You've chosen to share the ${itemName} with me? Wise decision! I won't keep it, just a fleeting look. And in thanks, Crow Feathers will be bestowed upon you.`,
];

export const Bert: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const game = gameState.context.state;
  const [tab, setTab] = useState(0);
  const [confirmAction, setConfirmAction] = useState(false);
  const dialogue = npcDialogues.bert || defaultDialogue;
  const intro = useRandomItem(dialogue.intro);

  const currentObsession = game.bertObsession;
  const obsessionCompletedAt = game.npcs?.bert?.questCompletedAt;

  const isObsessionCollectible = !!game.bertObsession?.collectibleName;

  const obsessionDialogue = useRandomItem(
    obsessionDialogues(
      (currentObsession?.collectibleName ??
        currentObsession?.wearableName) as string
    )
  );

  const obsessionName = isObsessionCollectible
    ? currentObsession?.collectibleName
    : currentObsession?.wearableName;

  const image = isObsessionCollectible
    ? ITEM_DETAILS[obsessionName as InventoryItemName].image
    : getImageUrl(ITEM_IDS[obsessionName as BumpkinItem]);

  const hasItem = isObsessionCollectible
    ? game.inventory[obsessionName as InventoryItemName]?.greaterThan(0)
    : game.wardrobe[obsessionName as BumpkinItem];

  const canCompleteObsession = () => {
    const { npcs } = game;
    const questCompletedAt = npcs?.bert?.questCompletedAt;

    if (!hasItem) return false;
    if (!currentObsession) return false;

    if (!questCompletedAt) return true;

    return (
      questCompletedAt >= currentObsession.startDate &&
      questCompletedAt <= currentObsession.endDate
    );
  };

  const completeObsession = () => {
    if (
      currentObsession &&
      obsessionCompletedAt &&
      currentObsession.startDate &&
      currentObsession.endDate &&
      obsessionCompletedAt >= currentObsession.startDate &&
      obsessionCompletedAt <= currentObsession.endDate
    ) {
      return <Label type="info">Already completed</Label>;
    }

    if (!currentObsession) {
      return null;
    }

    return (
      <Button
        disabled={!canCompleteObsession()}
        onClick={() => gameService.send("bertObsession.completed")}
      >
        Complete obsession
      </Button>
    );
  };

  const handleConfirm = (tab: number) => {
    setConfirmAction(true);
    setTab(tab);
  };

  if (!confirmAction) {
    return (
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.bert}
        message={[
          {
            text: intro,
            actions: [
              {
                text: "Delivery",
                cb: () => handleConfirm(0),
              },
              {
                text: "Obsessions",
                cb: () => handleConfirm(1),
              },
            ],
          },
        ]}
      />
    );
  }

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.bert}
      tabs={[
        { icon: SUNNYSIDE.icons.expression_chat, name: "Delivery" },
        { icon: SUNNYSIDE.icons.wardrobe, name: "Obsession" },
      ]}
      setCurrentTab={setTab}
      currentTab={tab}
    >
      {tab === 0 && (
        <DeliveryPanelContent npc="bert" skipIntro onClose={onClose} />
      )}
      {tab === 1 && (
        <div className="w-full flex flex-col items-center">
          <div className="w-full flex flex-col items-center mx-auto">
            <p className="text-center text-sm mb-3">{obsessionDialogue}</p>

            <div className="relative mb-2">
              <img src={bg} className="w-48 object-contain rounded-md" />
              <div className="absolute inset-0">
                <img
                  src={image}
                  className="absolute w-1/2 z-20 object-cover mb-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
              </div>
            </div>
          </div>

          {completeObsession()}
        </div>
      )}
    </CloseButtonPanel>
  );
};
