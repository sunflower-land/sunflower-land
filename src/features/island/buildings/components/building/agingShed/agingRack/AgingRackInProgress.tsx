import React from "react";

import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { Box } from "components/ui/Box";
import type { AgingRackSlot } from "features/game/lib/agingShed";
import { getAgingSaltCost, getFishBaseXP } from "features/game/types/aging";
import type { AgedFishName } from "features/game/types/fishing";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";

type Props = {
  slot: AgingRackSlot;
  now: number;
  onCollect: () => void;
  canCollect: boolean;
  collectError?: string;
};

export const AgingRackInProgress: React.FC<Props> = ({
  slot,
  now,
  onCollect,
  canCollect,
  collectError,
}) => {
  const { t } = useAppTranslation();
  const timeRemainingMs = Math.max(0, slot.readyAt - now);
  const isReady = timeRemainingMs <= 0;

  const agedName: AgedFishName = `Aged ${slot.fish}`;
  const outputLabel = ITEM_DETAILS[agedName]?.translatedName ?? agedName;
  const saltCost = getAgingSaltCost(getFishBaseXP(slot.fish));

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex justify-between items-start">
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
          {/* TODO: Replace filter tint with dedicated aged fish sprites */}
          <div
            style={{ filter: "sepia(0.4) hue-rotate(10deg) brightness(0.9)" }}
          >
            <Box image={ITEM_DETAILS[agedName]?.image} />
          </div>
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
