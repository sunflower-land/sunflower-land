import React from "react";
import { Box } from "components/ui/Box";
import { ResizableBar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import type { SaltHarvestSlotUi } from "./getSaltModalState";

type Props = {
  slot: SaltHarvestSlotUi;
};

export const SaltHarvestInProgress: React.FC<Props> = ({ slot }) => {
  const { t } = useAppTranslation();
  const { totalSeconds: secondsTillReady } = useCountdown(slot.readyAt);

  const totalSeconds = Math.max(
    1,
    Math.round((slot.readyAt - slot.startedAt) / 1000),
  );
  const isReady = secondsTillReady <= 0;
  const percentage = isReady
    ? 100
    : Math.min(100, (1 - secondsTillReady / totalSeconds) * 100);

  return (
    <div className="flex flex-col mb-2 w-full">
      <Label
        className="mr-3 ml-2 mb-1"
        icon={SUNNYSIDE.icons.stopwatch}
        type="default"
      >
        {t("in.progress")}
      </Label>
      <div className="flex items-center justify-between">
        <Box image={ITEM_DETAILS.Salt.image} />
        <div
          className="relative flex flex-col w-full"
          style={{
            marginTop: `${PIXEL_SCALE * 3}px`,
            marginBottom: `${PIXEL_SCALE * 2}px`,
          }}
        >
          <span className="text-xs mb-1">
            {isReady
              ? t("ready")
              : secondsToString(secondsTillReady, { length: "medium" })}
          </span>
          <ResizableBar percentage={percentage} type="progress" />
        </div>
        {/* Spacer: kitchen InProgressInfo uses gem button width */}
        <div className="w-36 sm:w-44 shrink-0 mr-[6px]" aria-hidden />
      </div>
    </div>
  );
};
