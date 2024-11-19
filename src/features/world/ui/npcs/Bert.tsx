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
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { CurrentObsession, InventoryItemName } from "features/game/types/game";

import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { secondsToString } from "lib/utils/time";
import { getSeasonalTicket } from "features/game/types/seasons";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { translate } from "lib/i18n/translate";
import { getImageUrl } from "lib/utils/getImageURLS";
import { OuterPanel } from "components/ui/Panel";

interface Props {
  onClose: () => void;
}

const obsessionDialogues = (itemName: string) => [
  `${translate("obsessionDialogue.line1", {
    itemName: itemName,
    seasonalTicket: getSeasonalTicket(),
  })}`,
  `${translate("obsessionDialogue.line2", {
    itemName: itemName,
    seasonalTicket: getSeasonalTicket(),
  })}`,
  `${translate("obsessionDialogue.line3", {
    itemName: itemName,
    seasonalTicket: getSeasonalTicket(),
  })}`,
  `${translate("obsessionDialogue.line4", {
    itemName: itemName,
    seasonalTicket: getSeasonalTicket(),
  })}`,
  `${translate("obsessionDialogue.line5", {
    itemName: itemName,
    seasonalTicket: getSeasonalTicket(),
  })}`,
];

export const Bert: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState(0);
  const [confirmAction, setConfirmAction] = useState(false);
  const dialogue = npcDialogues.bert || defaultDialogue;
  const intro = useRandomItem(dialogue.intro);

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
                text: t("obsession"),
                cb: () => handleConfirm(1),
              },
              {
                text: t("delivery"),
                cb: () => handleConfirm(0),
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
      container={tab === 0 ? OuterPanel : undefined}
      tabs={[
        { icon: SUNNYSIDE.icons.expression_chat, name: t("delivery") },
        { icon: SUNNYSIDE.icons.wardrobe, name: t("obsession") },
      ]}
      setCurrentTab={setTab}
      currentTab={tab}
    >
      {tab === 0 && <DeliveryPanelContent npc="bert" />}
      {tab === 1 && <BertObsession />}
    </CloseButtonPanel>
  );
};

const BertObsession: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const currentObsession = state.bertObsession;

  const obsessionDialogue = useRandomItem(
    obsessionDialogues(currentObsession?.name as string),
  );

  const obsessionName = state.bertObsession?.name;

  let isObsessionCollectible = state.bertObsession?.type === "collectible";
  if (ITEM_DETAILS[obsessionName as InventoryItemName] === undefined) {
    isObsessionCollectible = false;
  }

  const image = isObsessionCollectible
    ? ITEM_DETAILS[obsessionName as InventoryItemName].image
    : getImageUrl(ITEM_IDS[obsessionName as BumpkinItem]);

  const endDate = !currentObsession ? 0 : currentObsession.endDate;
  const resetSeconds = (endDate - new Date().getTime()) / 1000;

  return (
    <div className="w-full flex flex-col items-center pt-0.5">
      {!currentObsession && (
        <p className="text-center text-sm my-3">{t("no.obsessions")}</p>
      )}
      {currentObsession && (
        <div className="w-full flex flex-col items-center mx-auto">
          <p className="text-center text-sm mb-3">{obsessionDialogue}</p>

          <div className="relative mb-2">
            <img
              src={SUNNYSIDE.ui.grey_background}
              className="w-48 object-contain rounded-md"
            />
            <div className="absolute inset-0">
              <img
                src={image}
                className="absolute w-1/2 z-20 object-cover mb-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>
          <Label type="info" className="mb-2" icon={SUNNYSIDE.icons.stopwatch}>
            {`${t("offer.end")} ${secondsToString(resetSeconds, {
              length: "medium",
              removeTrailingZeros: true,
            })}`}
          </Label>
        </div>
      )}
      <CompleteObsession
        isObsessionCollectible={isObsessionCollectible}
        obsessionName={obsessionName}
        currentObsession={currentObsession}
      />
    </div>
  );
};

const CompleteObsession: React.FC<{
  isObsessionCollectible: boolean;
  obsessionName?: string;
  currentObsession?: CurrentObsession;
}> = ({ isObsessionCollectible, obsessionName, currentObsession }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const obsessionCompletedAt = state.npcs?.bert?.questCompletedAt;
  const reward = state.bertObsession?.reward ?? 0;

  const hasItem = isObsessionCollectible
    ? state.inventory[obsessionName as InventoryItemName]?.greaterThan(0)
    : state.wardrobe[obsessionName as BumpkinItem];
  const canCompleteObsession = () => {
    if (!hasItem) return false;
    if (!currentObsession) return false;

    if (!obsessionCompletedAt) return true;

    return obsessionCompletedAt < currentObsession.startDate;
  };

  if (!currentObsession) {
    return null;
  }

  if (
    obsessionCompletedAt &&
    obsessionCompletedAt >= currentObsession.startDate &&
    obsessionCompletedAt <= currentObsession.endDate
  ) {
    return (
      <Label type="success" icon={SUNNYSIDE.icons.confirm}>
        {t("alr.completed")}
      </Label>
    );
  }

  return (
    <>
      <Button
        disabled={!canCompleteObsession()}
        onClick={() => gameService.send("bertObsession.completed")}
      >
        {`${t("claim")} ${reward} ${getSeasonalTicket()}${
          reward > 1 ? "s" : ""
        }`}
      </Button>
      <span className="text-xs text-center">
        {t("bert.day", { seasonalTicket: getSeasonalTicket() })}
      </span>
    </>
  );
};
