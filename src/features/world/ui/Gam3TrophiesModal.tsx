import React, { useContext } from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { BONUSES } from "features/game/types/bonuses";
import { getWearableImage } from "features/game/lib/getWearableImage";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import confetti from "canvas-confetti";

interface Props {
  onClose: () => void;
}

export const Gam3TrophiesModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const hasClaimed = BONUSES["gam3s-cap"].isClaimed(gameState.context.state);
  const { t } = useAppTranslation();

  const claim = () => {
    if (hasClaimed) return;

    gameService.send("bonus.claimed", { name: "gam3s-cap" });

    confetti();
  };

  return (
    <CloseButtonPanel title={t("gam3.trophies.title")} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <p className="text-sm mx-1">{t("gam3.trophies.body1")}</p>
        </div>
        <div className="flex gap-2 items-center">
          <img
            src={getWearableImage("Gam3s Cap")}
            className="w-16"
            alt="Gam3s Cap"
          />
          <p className="text-sm">{t("gam3.trophies.body2")}</p>
        </div>
        <p className="text-xs text-center">{t("gam3.trophies.tip")}</p>
        <Button onClick={claim} disabled={hasClaimed}>
          {hasClaimed
            ? t("gam3.trophies.button.claimed")
            : t("gam3.trophies.button.claim")}
        </Button>
      </div>
    </CloseButtonPanel>
  );
};
