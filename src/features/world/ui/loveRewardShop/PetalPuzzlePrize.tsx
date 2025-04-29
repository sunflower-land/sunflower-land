import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { hasClaimedPetalPrize } from "features/game/events/landExpansion/claimPetalPrize";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

export const PetalPuzzlePrize: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameState, gameService } = useGame();
  const state = gameState.context.state;

  const { t } = useAppTranslation();

  const hasClaimed = hasClaimedPetalPrize({
    state,
    createdAt: Date.now(),
  });

  const onClaim = () => {
    gameService.send({
      type: "petalPuzzle.solved",
    });

    onClose();
  };

  if (hasClaimed) {
    return (
      <Panel>
        <Label type="danger" className="mb-1">
          {t("petalPuzzle.alreadyClaimed")}
        </Label>
        <p className="text-sm mb-2 mx-1">{t("petalPuzzle.comeBackTomorrow")}</p>
        <Button onClick={onClose}>{t("close")}</Button>
      </Panel>
    );
  }

  return (
    <Panel>
      <ClaimReward
        onClaim={onClaim}
        reward={{
          message: t("petalPuzzle.congratulations"),
          createdAt: Date.now(),
          id: "bronze-love-box",
          items: {
            "Bronze Love Box": 1,
          },
          wearables: {},
          sfl: 0,
          coins: 0,
        }}
        onClose={onClose}
      />
    </Panel>
  );
};
