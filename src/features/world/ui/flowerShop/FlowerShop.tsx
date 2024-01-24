import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useState } from "react";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { FlowerTrade } from "./FlowerTrade";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { useRandomItem } from "lib/utils/hooks/useRandomItem";

const DESIRED_FLOWER = "Flower 1";

const desiredFlowerDialogues = (desiredFlowerName: string) => [
  `Oh, I've been dreaming of cultivating a ${desiredFlowerName}!`,
  `How delightful it would be to have a ${desiredFlowerName}.`,
  `How wonderful it would be to have a ${desiredFlowerName}!`,
  `I've set my heart on growing a ${desiredFlowerName}.`,
];

const lostPagesDialogues = [
  `But alas! I've misplaced the pages of my cross-breeding book! They must be in the plaza somewhere.`,
  `But I can't believe it, the pages with my best hybrid flower recipes are missing. They must be in the plaza somewhere.`,
  `However, I'm in a bit of a bind – the pages containing my cross-breeding techniques seem to have disappeared. They must be in the plaza somewhere.`,
  `Sadly, my cross-breeding notes are gone! I'm sure they're somewhere around here. They must be in the plaza somewhere.`,
];

interface Props {
  onClose: () => void;
}
export const FlowerShop: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const [tab, setTab] = useState(0);

  const [confirmAction, setConfirmAction] = useState(false);

  const desiredFlowerDialogue = useRandomItem(
    desiredFlowerDialogues(DESIRED_FLOWER)
  );
  const lostPagesDialogue = useRandomItem(lostPagesDialogues);

  if (!confirmAction) {
    return (
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.poppy}
        message={[
          {
            text: desiredFlowerDialogue,
          },
          {
            text: lostPagesDialogue,
          },
          {
            text: `Do you have a ${DESIRED_FLOWER} you would trade me?`,

            actions: [
              {
                text: "Close",
                cb: () => onClose(),
              },
              {
                text: "Trade",
                cb: () => setConfirmAction(true),
              },
            ],
          },
        ]}
      />
    );
  }

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.poppy}
      tabs={[{ icon: SUNNYSIDE.icons.seedling, name: "Flower Trade" }]}
      onClose={onClose}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === 0 && <FlowerTrade desiredFlower={DESIRED_FLOWER} />}
    </CloseButtonPanel>
  );
};
