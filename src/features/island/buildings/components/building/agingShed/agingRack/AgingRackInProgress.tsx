import React, { useState } from "react";

import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { Box } from "components/ui/Box";
import type { AgingRackSlot } from "features/game/lib/agingShed";
import { getFishBaseXP } from "features/game/types/aging";
import { getBoostedAgingSaltCost } from "features/game/types/agingFormulas";
import type { AgedFishName } from "features/game/types/fishing";
import type { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { Consumable, CONSUMABLES } from "features/game/types/consumables";
import { getFoodExpBoost } from "features/game/expansion/lib/boosts";
import Decimal from "decimal.js-light";
import classNames from "classnames";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";

type Props = {
  slot: AgingRackSlot;
  now: number;
  onCollect: () => void;
  canCollect: boolean;
  collectError?: string;
  game: GameState;
};

export const AgingRackInProgress: React.FC<Props> = ({
  slot,
  now,
  onCollect,
  canCollect,
  collectError,
  game,
}) => {
  const { t } = useAppTranslation();
  const [showBoosts, setShowBoosts] = useState(false);
  const timeRemainingMs = Math.max(0, slot.readyAt - now);
  const isReady = timeRemainingMs <= 0;

  const agedName: AgedFishName = `Aged ${slot.fish}`;
  const outputLabel = ITEM_DETAILS[agedName]?.translatedName ?? agedName;
  const saltCost = getBoostedAgingSaltCost(getFishBaseXP(slot.fish), game);
  const food: Consumable = CONSUMABLES[agedName];
  const baseXp = food.experience;
  const boostedXp = getFoodExpBoost({ food, game, createdAt: now });

  const isXpBoosted = boostedXp.boostsUsed.length > 0;

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex justify-between items-start flex-wrap">
          <Label type="default" className="text-xs">
            {outputLabel}
          </Label>
          <Label
            type={isReady ? "success" : "info"}
            className="ml-1"
            icon={isReady ? SUNNYSIDE.icons.confirm : SUNNYSIDE.icons.stopwatch}
          >
            {isReady
              ? t("agingShed.agingRack.ready")
              : `${t("ready.in")}: ${secondsToString(timeRemainingMs / 1000, {
                  length: "medium",
                  removeTrailingZeros: true,
                })}`}
          </Label>
        </div>
        <div className="flex items-center">
          <Box image={ITEM_DETAILS[agedName]?.image} />
          <div className="flex flex-wrap p-2 gap-2 items-center">
            <Label
              type="default"
              className="text-xs"
              icon={ITEM_DETAILS["Salt"].image}
            >
              {`${saltCost} Salt`}
            </Label>
            <RequirementLabel
              type="time"
              waitSeconds={Math.max(0, (slot.readyAt - slot.startedAt) / 1000)}
            />
            <div
              className={classNames("flex flex-row items-center", {
                "cursor-pointer": isXpBoosted,
              })}
              onClick={() =>
                isXpBoosted ? setShowBoosts(!showBoosts) : undefined
              }
            >
              {isXpBoosted && (
                <RequirementLabel type="xp" xp={boostedXp.boostedExp} boosted />
              )}
              {baseXp !== undefined && (
                <RequirementLabel
                  type="xp"
                  xp={new Decimal(baseXp)}
                  strikethrough={!!isXpBoosted}
                />
              )}
              {isXpBoosted && showBoosts && (
                <BoostsDisplay
                  boosts={boostedXp.boostsUsed}
                  show={showBoosts}
                  state={game}
                  onClick={() => setShowBoosts(!showBoosts)}
                />
              )}
            </div>
          </div>
        </div>

        {collectError && (
          <Label type="danger" className="text-xs mb-2 mx-2">
            {collectError}
          </Label>
        )}
      </InnerPanel>

      <Button disabled={!canCollect} onClick={onCollect}>
        {t("agingShed.agingRack.collect")}
      </Button>
    </>
  );
};
