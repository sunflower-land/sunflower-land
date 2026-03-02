import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useGame } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import React, { useState } from "react";
import tradeIcon from "assets/icons/trade.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Welcome: React.FC = () => {
  const { gameService } = useGame();
  const { t } = useAppTranslation();

  const [showPrize, setShowPrize] = useState(false);
  const claim = () => {
    gameService.send({ type: "bonus.claimed", name: "welcome" });
    gameService.send({ type: "ACKNOWLEDGE" });
  };

  if (showPrize) {
    return (
      <div>
        <div className="p-1">
          <Label type="chill" className="mb-1" icon={SUNNYSIDE.icons.heart}>
            {t("welcome.messageFromTeam")}
          </Label>
          <p className="text-xs mb-2 px-1">{t("welcome.thanksForBeingHere")}</p>
          <p className="text-xs mb-2 px-1">{t("welcome.supportMessage")}</p>
        </div>
        <Button onClick={claim} className="relative">
          <Label
            type="warning"
            className="absolute -top-4 right-0"
            icon={ITEM_DETAILS.Gem.image}
          >
            {`50`}
          </Label>
          {t("welcome.claimGift")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="p-1">
        <div className="flex flex-wrap items-center justify-between">
          <Label type="chill" icon={SUNNYSIDE.icons.heart} className="mb-2">
            {t("welcome.label")}
          </Label>
          <Label type="vibrant" className="mb-2">
            {t("welcome.anniversary")}
          </Label>
        </div>

        <NoticeboardItems
          items={[
            {
              text: t("welcome.noticeboard.openSource"),
              icon: ITEM_DETAILS.Cheer.image,
            },
            {
              text: t("welcome.noticeboard.trade"),
              icon: tradeIcon,
            },
          ]}
        />
      </div>
      <Button onClick={() => setShowPrize(true)}>{t("continue")}</Button>
    </div>
  );
};
