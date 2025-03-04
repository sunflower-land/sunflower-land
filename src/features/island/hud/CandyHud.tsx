import React from "react";

import candy from "public/world/candy_icon.png";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useGame } from "features/game/GameProvider";
import {
  DAILY_CANDY,
  getDayOfChristmas,
} from "features/game/events/landExpansion/collectCandy";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const CandyHUD: React.FC = () => {
  const { state } = useGame();
  const { t } = useAppTranslation();

  const { dayOfChristmas } = getDayOfChristmas(state);

  const candyCollected = state.christmas2024?.day[dayOfChristmas]?.candy ?? 0;

  const remaining = DAILY_CANDY - candyCollected;

  return (
    <InnerPanel>
      {remaining > 0 && (
        <Label type="vibrant" icon={candy} className="ml-1.5">
          {t("candy.remaining", { candies: remaining })}
        </Label>
      )}
      {remaining === 0 && (
        <Label
          type="vibrant"
          icon={candy}
          secondaryIcon={SUNNYSIDE.icons.confirm}
          className="ml-1.5"
        >
          {t("chores.complete")}
        </Label>
      )}
    </InnerPanel>
  );
};
