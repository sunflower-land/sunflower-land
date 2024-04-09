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
import { translate } from "lib/i18n/translate";

const desiredFlowerDialogues = (desiredFlowerName: string) => [
  `${translate("flowerShop.desired.dreaming", {
    desiredFlowerName: desiredFlowerName,
  })}`,
  `${translate("flowerShop.desired.delightful", {
    desiredFlowerName: desiredFlowerName,
  })}`,
  `${translate("flowerShop.desired.wonderful", {
    desiredFlowerName: desiredFlowerName,
  })}`,
  `${translate("flowerShop.desired.setMyHeart", {
    desiredFlowerName: desiredFlowerName,
  })}`,
];

const lostPagesDialogues = [
  `${translate("flowerShop.missingPages.alas")}.`,
  `${translate("flowerShop.missingPages.cantBelieve")}`,
  `${translate("flowerShop.missingPages.inABind")}`,
  `${translate("flowerShop.missingPages.sadly")}`,
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
            text: `${translate("flowerShop.noFlowers.noTrade")}.`,
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
            text: `${translate("flowerShop.do.have.trade", {
              desiredFlower: springBlossom.weeklyFlower,
            })}`,

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
