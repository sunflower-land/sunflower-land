import React from "react";
import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Revealed } from "features/game/components/Revealed";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";
import { useContext, useState } from "react";
import { ChestRevealing } from "../chests/ChestRevealing";
import { Context } from "features/game/GameProvider";
import giftIcon from "assets/icons/gift.png";

export const PlayerGift: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { pumpkinPlaza } = gameState.context.state;

  const [isRevealing, setIsRevealing] = useState(false);

  // Just a prolonged UI state to show the shuffle of items animation
  const [isPicking, setIsPicking] = useState(false);

  const { t } = useAppTranslation();

  const open = async () => {
    setIsPicking(true);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    gameService.send("REVEAL", {
      event: {
        type: "giftGiver.opened",
        createdAt: new Date(),
      },
    });
    setIsRevealing(true);
    setIsPicking(false);
  };

  const openedAt = pumpkinPlaza.giftGiver?.openedAt ?? 0;

  // Have they opened one today already?
  const hasOpened =
    !!openedAt &&
    new Date(openedAt).toISOString().substring(0, 10) ===
      new Date().toISOString().substring(0, 10);

  if (isPicking || (gameState.matches("revealing") && isRevealing)) {
    return <ChestRevealing type={"Gift Giver"} />;
  }

  if (gameState.matches("revealed") && isRevealing) {
    return (
      <Revealed
        onAcknowledged={() => {
          setIsRevealing(false);
        }}
      />
    );
  }

  return (
    <>
      <div className="ml-1 mb-2">
        <div className="flex justify-between items-center px-1 mb-2">
          <Label type="success" icon={giftIcon}>
            {t("giftGiver.label")}
          </Label>
          {hasOpened && (
            <Label type="success" icon={SUNNYSIDE.icons.confirm}>
              {`${t("budBox.opened")} - ${secondsToString(secondsTillReset(), {
                length: "short",
              })}`}
            </Label>
          )}
        </div>
        <p className="text-sm">{t("giftGiver.description")}</p>
      </div>
      <Button onClick={open} disabled={hasOpened}>
        {t("open")}
      </Button>
    </>
  );
};
