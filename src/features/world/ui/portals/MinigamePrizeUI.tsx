import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";

import coins from "assets/icons/coins.webp";
import giftIcon from "assets/icons/gift.png";

import { SUNNYSIDE } from "assets/sunnyside";
import type {
  InventoryItemName,
  MinigameHistory,
  MinigamePrize,
} from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { getKeys } from "lib/object";
import { ITEM_DETAILS } from "features/game/types/images";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { getMinigamePrizeReward } from "features/game/events/minigames/claimMinigamePrize";

export const MinigamePrizeUI: React.FC<{
  prize?: MinigamePrize;
  history?: MinigameHistory;
  mission: string;
  /** Shown alongside server prize items (e.g. VIP-only bonuses not in `prize.items`). */
  extraItems?: Partial<Record<InventoryItemName, number>>;
}> = ({ prize, history, mission, extraItems }) => {
  const { t } = useAppTranslation();
  const { totalSeconds } = useCountdown(prize?.endAt ?? 0);

  if (!prize) {
    return (
      <OuterPanel>
        <div className="px-1">
          <Label type="danger" icon={SUNNYSIDE.icons.sad}>
            {t("minigame.noPrizeAvailable")}
          </Label>
        </div>
      </OuterPanel>
    );
  }

  const isComplete = !!history && !!getMinigamePrizeReward({ prize, history });

  return (
    <OuterPanel>
      <div className="px-1">
        <span className="text-xs mb-2">{mission}</span>
        <div className="flex justify-between items-start mt-2 flex-wrap">
          {isComplete ? (
            <Label type="success" icon={SUNNYSIDE.icons.confirm}>
              {t("minigame.completed")}
            </Label>
          ) : (
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {secondsToString(totalSeconds, { length: "medium" })}
            </Label>
          )}

          {prize.tiers ? (
            <div className="flex flex-col items-end space-y-1">
              {prize.tiers.map((tier) =>
                getKeys(tier.items).map((item) => (
                  <Label
                    key={`${tier.score}-${item}`}
                    type="warning"
                    icon={ITEM_DETAILS[item].image}
                  >
                    {`${tier.score}+: ${tier.items[item]} x ${item}`}
                  </Label>
                )),
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {getKeys(prize.items).map((item) => (
                <Label
                  key={item}
                  type="warning"
                  icon={ITEM_DETAILS[item].image}
                >
                  {`${prize.items[item]} x ${item}`}
                </Label>
              ))}
              {extraItems &&
                getKeys(extraItems).map((item) => (
                  <Label
                    key={`extra-${item}`}
                    type="warning"
                    icon={ITEM_DETAILS[item].image}
                  >
                    {`${extraItems[item]} x ${item}`}
                  </Label>
                ))}
              {getKeys(prize.wearables).map((item) => (
                <Label key={item} type="warning" icon={giftIcon}>
                  {`${prize.wearables[item]} x ${item}`}
                </Label>
              ))}
              {!!prize.coins && (
                <Label type="warning" icon={coins}>
                  {prize.coins}
                </Label>
              )}
            </div>
          )}
        </div>
      </div>
    </OuterPanel>
  );
};
