import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { secondsLeftInSeason } from "features/game/types/seasons";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";
import React from "react";

export const AuctionsComingSoon: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="p-2 flex flex-col items-center">
      <p>{t("auction.const")}</p>
      <img src={SUNNYSIDE.npcs.goblin_hammering} className="w-1/3" />
      <Label className="my-2" type="info" icon={SUNNYSIDE.icons.timer}>
        {secondsToString(secondsLeftInSeason(), { length: "full" })}
      </Label>
      <a
        href="https://docs.sunflower-land.com/player-guides/auctions"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs underline"
      >
        {t("read.more")}
      </a>
    </div>
  );
};
