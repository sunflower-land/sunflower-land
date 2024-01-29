import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useState } from "react";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { FlowerTrade } from "./FlowerTrade";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { useRandomItem } from "lib/utils/hooks/useRandomItem";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";

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

const _springBlossom = (week: number) => (state: MachineState) =>
  state.context.state.springBlossom[week];
const _inventory = (state: MachineState) => state.context.state.inventory;

interface Props {
  onClose: () => void;
}
export const FlowerShop: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const seasonWeek = getSeasonWeek();
  const springBlossom = useSelector(gameService, _springBlossom(seasonWeek));
  const inventory = useSelector(gameService, _inventory);

  const [tab, setTab] = useState(0);

  const [confirmAction, setConfirmAction] = useState(false);

  const desiredFlowerDialogue = useRandomItem(
    desiredFlowerDialogues(springBlossom?.weeklyFlower)
  );
  const lostPagesDialogue = useRandomItem(lostPagesDialogues);

  if (!springBlossom?.weeklyFlower) {
    return (
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.poppy}
        message={[
          {
            text: `I'm sorry, I don't have any flowers to trade right now.`,
            actions: [
              {
                text: "Close",
                cb: () => onClose(),
              },
            ],
          },
        ]}
      />
    );
  }

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
            text: `Do you have a ${springBlossom.weeklyFlower} you would trade me?`,

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
      {tab === 0 && (
        <FlowerTrade
          alreadyComplete={!!springBlossom.tradedFlowerShop}
          desiredFlower={springBlossom.weeklyFlower}
          flowerCount={(
            inventory[springBlossom.weeklyFlower] ?? new Decimal(0)
          ).toNumber()}
        />
      )}
    </CloseButtonPanel>
  );
};
