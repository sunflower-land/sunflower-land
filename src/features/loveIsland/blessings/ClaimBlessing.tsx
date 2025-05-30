import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useAuth } from "features/auth/lib/Provider";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { useGame } from "features/game/GameProvider";
import {
  blessingIsReady,
  GUARDIAN_PENDING_MS,
} from "features/game/lib/blessings";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";
import React from "react";

interface Props {
  onClose: () => void;
}
export const ClaimBlessingReward: React.FC<Props> = ({ onClose }) => {
  const { gameState, gameService } = useGame();
  const { authState } = useAuth();

  const { t } = useAppTranslation();

  const { offered, reward } = gameState.context.state.blessing;

  const seekBlessing = () => {
    gameService.send("blessing.seeked", {
      effect: {
        type: "blessing.seeked",
      },
      authToken: authState.context.user.rawToken as string,
    });
  };

  const claimBlessing = () => {
    gameService.send("blessing.claimed");
    onClose();
  };

  if (!offered && !reward) {
    return (
      <div>
        <Label type="default" className="mb-1">
          {t("blessing.missingOffering")}
        </Label>
        <p className="text-xs mb-1">{t("blessing.visitGuardians")}</p>
        <Button onClick={onClose}>{t("close")}</Button>
      </div>
    );
  }

  if (reward) {
    return (
      <ClaimReward
        onClaim={claimBlessing}
        reward={{
          message: t("blessing.godsBlessed"),
          createdAt: Date.now(),
          id: "guardian-reward",
          items: reward.items ?? {},
          wearables: {},
          sfl: 0,
          coins: reward.coins,
        }}
      />
    );
  }

  const isReady = blessingIsReady({ game: gameState.context.state });

  if (!isReady) {
    const offeredDate = new Date(offered!.offeredAt).toISOString().slice(0, 10);

    const readyIn =
      new Date(offeredDate).getTime() + GUARDIAN_PENDING_MS - Date.now();

    return (
      <div>
        <Label type="default" className="mb-1">
          {t("blessing.prayToGuardians")}
        </Label>
        <p className="text-sm m-1">{t("blessing.thankYouOffering")}</p>
        <Label
          type="transparent"
          icon={SUNNYSIDE.icons.stopwatch}
          className="ml-4 my-2"
        >
          {secondsToString(readyIn / 1000, { length: "medium" })}{" "}
          {t("blessing.left")}
        </Label>
        <Button onClick={onClose}>{t("close")}</Button>
      </div>
    );
  }

  return (
    <div>
      <Label type="warning" className="mb-1">
        {t("blessing.youHaveBeenBlessed")}
      </Label>
      <p className="text-sm mb-2">{t("blessing.godsThankFaithful")}</p>
      <Button onClick={seekBlessing}>{t("blessing.claimBlessing")}</Button>
    </div>
  );
};
