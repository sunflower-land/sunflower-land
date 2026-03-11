import React from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { NoticeboardItems } from "./kingdom/KingdomNoticeboard";
import xpIcon from "assets/icons/xp.png";
import giftIcon from "assets/icons/gift.png";
import coinIcon from "assets/icons/coins.webp";
import flowerIcon from "assets/icons/flower_token.webp";
import powerupIcon from "assets/icons/level_up.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import confetti from "canvas-confetti";

interface Props {
  onClose: () => void;
}

export const FreeTrial: React.FC<Props> = ({ onClose }) => {
  const { gameService } = React.useContext(Context);
  const { t } = useAppTranslation();
  const handleStartTrial = () => {
    gameService.send("trial.started");
    confetti();
    onClose();
  };

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="p-1">
        <Label className="mb-1" type="warning">
          {t("freeTrial.foundReward")}
        </Label>
        <p className="text-sm mb-2">{t("freeTrial.description")}</p>
        <NoticeboardItems
          items={[
            { text: t("vip.benefit.expBoost"), icon: xpIcon },
            { text: t("vip.benefit.dailyGift"), icon: giftIcon },
            { text: t("vip.benefit.coinDiscount"), icon: coinIcon },
            { text: t("vip.benefit.more"), icon: powerupIcon },
          ]}
        />
      </div>
      <Button className="mt-2" onClick={handleStartTrial}>
        {t("freeTrial.startButton")}
      </Button>
    </CloseButtonPanel>
  );
};
