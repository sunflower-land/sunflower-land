import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { secondsLeftInChapter } from "features/game/types/chapters";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { secondsToString } from "lib/utils/time";
import React from "react";

export const AuctionsComingSoon: React.FC = () => {
  const { t } = useAppTranslation();
  const now = useNow({ live: true });
  return (
    <div className="p-2 flex flex-col items-center">
      <p>{t("auction.const")}</p>
      <img src={SUNNYSIDE.npcs.goblin_hammering} className="w-1/3" />
      <Label className="my-2" type="info" icon={SUNNYSIDE.icons.timer}>
        {secondsToString(secondsLeftInChapter(now), { length: "full" })}
      </Label>
      <a
        href="https://docs.sunflower-land.com/getting-started/crypto-and-digital-collectibles"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs underline"
      >
        {t("read.more")}
      </a>
    </div>
  );
};
