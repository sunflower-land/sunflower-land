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
          <ChestRevealing type={"Pirate Chest"} />
        ) : gameState.matches("revealed") && isRevealing ? (
          <Revealed onAcknowledged={() => setIsRevealing(false)} />
        ) : !piratePotionEquipped ? (
          <div className="p-2 flex flex-col items-start">
            <div className="mb-1">
              <Label type="danger" className="mb-1">
                {`Missing Pirate Potion`}
              </Label>
            </div>
            <p className="mb-1 ml-1 text-left">
              {`Ahoy maties! I am protecting this plunder for my crew of pirates.`}
            </p>
            <p className="text-xs ml-1 text-left">
              {`Come back when you have a body of a pirate!`}
            </p>
            <Button className="mt-2" onClick={open} disabled={true}>
              {t("open")}
            </Button>
          </div>
        ) : hasOpened ? (
          <div className="p-2 flex flex-col items-start">
            <div className="flex justify-between items-center w-full mb-1">
              <Label
                type="success"
                className="mb-1"
                secondaryIcon={SUNNYSIDE.icons.confirm}
              >
                {`Pirate Chest Opened`}
              </Label>
              <Label
                className="text-right mb-1"
                type="info"
                icon={SUNNYSIDE.icons.stopwatch}
              >
                {`${`Come back in`} - ${secondsToString(secondsTillReset(), {
                  length: "short",
                })}`}
              </Label>
            </div>
            <p className="mb-1 ml-1 text-left">
              {`You have opened the Pirate Chest Today`}
            </p>
            <p className="text-xs mb-1 ml-1 text-left">
              {`Come back tomorrow to open the Pirate Chest again`}
            </p>
            <Button className="mt-2" onClick={open} disabled={true}>
              {t("open")}
            </Button>
          </div>
        ) : (
          <div className="p-2 flex flex-col items-start">
            <div className="mb-1">
              <Label
                type="success"
                className="mb-1 mr-3 capitalize"
                secondaryIcon={SUNNYSIDE.icons.confirm}
              >
                {`Pirate Potion equipped`}
              </Label>
            </div>
            <p className="mb-1 ml-1 text-left">
              {`Ahoy maties! Looks like you're a fellow pirate too!`}
            </p>
            <p className="mb-1 ml-1 text-left">
              {`You are entitled to one treasure gift per day.`}
            </p>
            <Button className="mt-2" onClick={open}>
              {t("open")}
            </Button>
          </div>
        ))}
    </CloseButtonPanel>
  );
};
