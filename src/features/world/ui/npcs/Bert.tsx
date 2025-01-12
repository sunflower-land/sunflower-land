import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useState } from "react";
import { DeliveryPanelContent } from "../deliveries/DeliveryPanelContent";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { useRandomItem } from "lib/utils/hooks/useRandomItem";
import { defaultDialogue, npcDialogues } from "../deliveries/dialogues";
import { ITEM_DETAILS } from "features/game/types/images";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import {
  CurrentObsession,
  GameState,
  InventoryItemName,
} from "features/game/types/game";

import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { secondsToString } from "lib/utils/time";
import { getSeasonalTicket } from "features/game/types/seasons";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { translate } from "lib/i18n/translate";
import { getImageUrl } from "lib/utils/getImageURLS";
import { OuterPanel } from "components/ui/Panel";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `bert-read.${host}-${window.location.pathname}`;

function acknowledgeIntroRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

function hasReadIntro() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

interface Props {
  onClose: () => void;
}

const _state = (state: MachineState) => state.context.state;

const obsessionDialogues = (itemName: string) => [
  `${translate("obsessionDialogue.line1", {
    itemName: itemName,
    seasonalTicket: getSeasonalTicket().toLowerCase(),
  })}`,
  `${translate("obsessionDialogue.line2", {
    itemName: itemName,
    seasonalTicket: getSeasonalTicket().toLowerCase(),
  })}`,
  `${translate("obsessionDialogue.line3", {
    itemName: itemName,
    seasonalTicket: getSeasonalTicket().toLowerCase(),
  })}`,
  `${translate("obsessionDialogue.line4", {
    itemName: itemName,
    seasonalTicket: getSeasonalTicket().toLowerCase(),
  })}`,
  `${translate("obsessionDialogue.line5", {
    itemName: itemName,
    seasonalTicket: getSeasonalTicket().toLowerCase(),
  })}`,
];

export const Bert: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState(0);
  const [showIntro, setShowIntro] = useState(!hasReadIntro());
  const dialogue = npcDialogues.bert || defaultDialogue;
  const intro = useRandomItem(dialogue.intro);
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const handleIntro = (tab: number) => {
    setShowIntro(false);
    acknowledgeIntroRead();
    setTab(tab);
  };

  if (showIntro) {
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
                cb: () => handleIntro(1),
              },
              {
                text: t("delivery"),
                cb: () => handleIntro(0),
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
      {tab === 1 && <BertObsession gameService={gameService} state={state} />}
    </CloseButtonPanel>
  );
};

export const BertObsession: React.FC<{
  readonly?: boolean;
  gameService: MachineInterpreter;
  state: GameState;
}> = ({ readonly, gameService, state }) => {
  const { t } = useAppTranslation();
  const currentObsession = state.bertObsession;
  const obsessionCompletedAt = state.npcs?.bert?.questCompletedAt;

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
  const reward = state.bertObsession?.reward ?? 0;

  if (!currentObsession) {
    return (
      <div className="w-full flex flex-col items-center pt-0.5">
        <div className="flex flex-row justify-between w-full my-1">
          <Label type="default">{"Bert's Obsession"}</Label>
        </div>
        <p className="text-center text-sm my-3">{t("no.obsessions")}</p>
      </div>
    );
  }

  if (readonly) {
    return (
      <BertObsessionReadonly
        resetSeconds={resetSeconds}
        isObsessionCollectible={isObsessionCollectible}
        image={image}
        reward={reward}
        obsessionName={obsessionName}
        obsessionCompletedAt={obsessionCompletedAt}
        currentObsession={currentObsession}
      />
    );
  }

  return (
    <div className="w-full flex flex-col items-center pt-0.5">
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
        gameService={gameService}
        state={state}
      />
    </div>
  );
};

const CompleteObsession: React.FC<{
  isObsessionCollectible: boolean;
  obsessionName?: string;
  currentObsession?: CurrentObsession;
  gameService: MachineInterpreter;
  state: GameState;
}> = ({
  isObsessionCollectible,
  obsessionName,
  currentObsession,
  gameService,
  state,
}) => {
  const { t } = useAppTranslation();
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

const BertObsessionReadonly: React.FC<{
  resetSeconds: number;
  isObsessionCollectible: boolean;
  image: string;
  reward: number;
  obsessionName?: string;
  obsessionCompletedAt?: number;
  currentObsession: CurrentObsession;
}> = ({
  resetSeconds,
  isObsessionCollectible,
  image,
  reward,
  obsessionName,
  obsessionCompletedAt,
  currentObsession,
}) => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col items-center space-y-2 mb-2">
      <div className="flex flex-row justify-between w-full my-1">
        <Label type="default">{"Bert's Obsession"}</Label>
        <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
          {`${t("offer.end")} ${secondsToString(resetSeconds, {
            length: "medium",
            removeTrailingZeros: true,
          })}`}
        </Label>
      </div>
      <div className="w-full mb-1 mx-1">
        <div className="flex">
          <div
            className="relative min-w-[40%] rounded-md overflow-hidden shadow-md mx-2 flex justify-center items-center w-32 h-32 md:w-64 md:h-64"
            style={
              isObsessionCollectible
                ? {
                    backgroundImage: `url(${SUNNYSIDE.ui.grey_background})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}
            }
          >
            <img
              src={image}
              className="absolute w-1/2 z-20 object-cover mb-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <div className="flex flex-col space-y-2 justify-between">
            <span className="text-xs leading-none">
              {t("obsessionDialogue.codex", {
                itemName: obsessionName ?? "",
                seasonalTicket: getSeasonalTicket().toLowerCase(),
              })}
            </span>
            <div className="flex flex-row flex-wrap gap-1">
              <Label
                className="whitespace-nowrap font-secondary relative"
                type="default"
              >
                {`Reward: ${reward} ${getSeasonalTicket()}s`}
              </Label>
              {obsessionCompletedAt &&
                obsessionCompletedAt >= currentObsession.startDate &&
                obsessionCompletedAt <= currentObsession.endDate && (
                  <Label type="success" icon={SUNNYSIDE.icons.confirm}>
                    {t("alr.completed")}
                  </Label>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
