import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { Revealed } from "features/game/components/Revealed";

import React, { useContext, useState } from "react";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ChestRevealing } from "./ChestRevealing";
import { Button } from "components/ui/Button";
import { secondsToString } from "lib/utils/time";
import { isWearableActive } from "features/game/lib/wearables";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPC_WEARABLES } from "lib/npcs";
import { Modal } from "components/ui/Modal";
import { secondsTillReset } from "lib/utils/time";

interface PirateChestContentProps {
  setIsLoading?: (isLoading: boolean) => void;
  isPicking: boolean;
  setIsPicking: (picking: boolean) => void;
  isRevealing: boolean;
  setIsRevealing: (revealing: boolean) => void;
}
const PirateChestContent: React.FC<PirateChestContentProps> = ({
  setIsLoading,
  isPicking,
  setIsPicking,
  isRevealing,
  setIsRevealing,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;

  const piratePotionEquipped = isWearableActive({
    game: state,
    name: "Pirate Potion",
  });

  const openedAt = state.pumpkinPlaza.pirateChest?.openedAt ?? 0;
  const hasOpened =
    !!openedAt &&
    new Date(openedAt).toISOString().substring(0, 10) ===
      new Date().toISOString().substring(0, 10);

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

  if (isPicking || (gameState.matches("revealing") && isRevealing)) {
    return <ChestRevealing type={"Pirate Chest"} />;
  }

  if (gameState.matches("revealed") && isRevealing) {
    return <Revealed onAcknowledged={() => setIsRevealing(false)} />;
  }

  if (!piratePotionEquipped) {
    return (
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
    );
  }

  if (hasOpened) {
    return (
      <>
        <div className="p-1">
          <div className="flex gap-1 mb-1 flex-col md:justify-between md:flex-row">
            <Label
              type="success"
              className="md:mb-0"
              secondaryIcon={SUNNYSIDE.icons.confirm}
            >
              {t("pirate.chest.opened")}
            </Label>
            <Label
              className="text-right"
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
    );
  }

  return (
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
  );
};

interface Props {
  onClose: () => void;
  setIsLoading?: (isLoading: boolean) => void;
  show: boolean;
}

export const PirateChestModal: React.FC<Props> = ({
  onClose,
  setIsLoading,
  show,
}) => {
  const { t } = useAppTranslation();

  const [isPicking, setIsPicking] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  return (
    <Modal
      onHide={
        isPicking ||
        (isRevealing &&
          (gameState.matches("revealing") || gameState.matches("revealed")))
          ? undefined
          : onClose
      }
      show={show}
    >
      <CloseButtonPanel
        onClose={
          isPicking ||
          (isRevealing &&
            (gameState.matches("revealing") || gameState.matches("revealed")))
            ? undefined
            : onClose
        }
        bumpkinParts={NPC_WEARABLES["old salty"]}
        tabs={[
          {
            icon: ITEM_DETAILS["Pirate Bounty"].image,
            name: t("pirate.chest"),
          },
        ]}
        className="pt-1"
      >
        <PirateChestContent
          setIsLoading={setIsLoading}
          isPicking={isPicking}
          setIsPicking={setIsPicking}
          isRevealing={isRevealing}
          setIsRevealing={setIsRevealing}
        />
      </CloseButtonPanel>
    </Modal>
  );
};
