import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Revealed } from "features/game/components/Revealed";

import React, { useContext, useState } from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ChestRevealing } from "./ChestRevealing";
import { NPC_WEARABLES } from "lib/npcs";
import { Button } from "components/ui/Button";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";
import { secondsToString } from "lib/utils/time";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  onClose: () => void;
  setIsLoading?: (isLoading: boolean) => void;
}

export const PirateChest: React.FC<Props> = ({ onClose, setIsLoading }) => {
  const [tab, setTab] = useState(0);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;

  const { t } = useAppTranslation();

  // Just a prolonged UI state to show the shuffle of items animation
  const [isPicking, setIsPicking] = useState(false);

  const [isRevealing, setIsRevealing] = useState(false);

  const piratePotionEquipped = [
    ...Object.values(state.bumpkin?.equipped ?? {}),
    ...Object.values(state.farmHands.bumpkins).flatMap((bumpkin) =>
      Object.values(bumpkin.equipped),
    ),
  ].includes("Pirate Potion");

  const open = async () => {
    setIsLoading && setIsLoading(true);
    setIsPicking(true);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    gameService.send("REVEAL", {
      event: {
        type: "pirateChest.opened",
        createdAt: new Date(),
      },
    });
    setIsRevealing(true);
    setIsPicking(false);
    setIsLoading && setIsLoading(false);
  };

  const openedAt = state.pumpkinPlaza.pirateChest?.openedAt ?? 0;
  const hasOpened =
    !!openedAt &&
    new Date(openedAt).toISOString().substring(0, 10) ===
      new Date().toISOString().substring(0, 10);

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES["old salty"]}
      tabs={[
        { icon: ITEM_DETAILS["Pirate Bounty"].image, name: "Pirate Chest" },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      className="pt-1"
    >
      {tab === 0 &&
        (isPicking || (gameState.matches("revealing") && isRevealing) ? (
          <ChestRevealing type={t("pirate.chest")} />
        ) : gameState.matches("revealed") && isRevealing ? (
          <Revealed onAcknowledged={() => setIsRevealing(false)} />
        ) : !piratePotionEquipped ? (
          <>
            <div className="p-1">
              <Label type="danger" className="mb-1">
                {t("missing.pirate.potion")}
              </Label>
              <p className="mb-1 ml-1 text-left">
                {t("npcDialogues.oldSalty.missingPotion1")}
              </p>
              <p className="text-xs ml-1 text-left">
                {t("npcDialogues.oldSalty.missingPotion2")}
              </p>
            </div>
            <Button
              className="mt-2"
              onClick={open}
              disabled={!piratePotionEquipped}
            >
              {t("open")}
            </Button>
          </>
        ) : hasOpened ? (
          <>
            <div className="p-1">
              <div className="justify-between flex">
                <Label
                  type="success"
                  className="mb-1"
                  secondaryIcon={SUNNYSIDE.icons.confirm}
                >
                  {t("pirate.chest.opened")}
                </Label>
                <Label
                  className="text-right mb-1"
                  type="info"
                  icon={SUNNYSIDE.icons.stopwatch}
                >
                  {t("comeBackIn.time", {
                    timeToReset: secondsToString(secondsTillReset(), {
                      length: "short",
                    }),
                  })}
                </Label>
              </div>
              <p className="mb-1 ml-1 text-left">
                {t("npcDialogues.oldSalty.chestOpened1")}
              </p>
              <p className="text-xs mb-1 ml-1 text-left">
                {t("npcDialogues.oldSalty.chestOpened2")}
              </p>
            </div>
            <Button className="mt-2" onClick={open} disabled={hasOpened}>
              {t("open")}
            </Button>
          </>
        ) : (
          <>
            <div className="p-1">
              <Label
                type="success"
                className="mb-1 capitalize"
                secondaryIcon={SUNNYSIDE.icons.confirm}
              >
                {t("pirate.potion.equipped")}
              </Label>
              <p className="mb-1 ml-1 text-left">
                {t("npcDialogues.oldSalty.chestUnopened1")}
              </p>
              <p className="text-xs mb-1 ml-1 text-left">
                {t("npcDialogues.oldSalty.chestUnopened2")}
              </p>
            </div>
            <Button className="mt-2" onClick={open}>
              {t("open")}
            </Button>
          </>
        ))}
    </CloseButtonPanel>
  );
};
