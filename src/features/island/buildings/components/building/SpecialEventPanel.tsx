import React, { useState } from "react";
import Decimal from "decimal.js-light";
import { isMobile } from "mobile-device-detect";

import { ButtonPanel } from "components/ui/Panel";
import { CountLabel } from "components/ui/CountLabel";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { setPrecision } from "lib/utils/formatNumber";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { secondsToString } from "lib/utils/time";

const CORNER_PX = PIXEL_SCALE * 8;
// Push the corner brackets slightly outside the panel edges (like the Box).
const CORNER_INSET = PIXEL_SCALE * 1;
// Keep the count label inside the panel's right edge so it isn't clipped.
const LABEL_RIGHT_SHIFT_PX = PIXEL_SCALE * 2;
const LABEL_TOP_SHIFT_PX = -5 * PIXEL_SCALE;

/**
 * A full-width "special event" panel used across the market (buy/sell) and the
 * Fire Pit to surface a limited-time crop / recipe. Uses the same background as
 * the marketplace cards ({@link ButtonPanel}). Shows the item icon on the left,
 * a title with a time-remaining countdown, the amount owned in the top-right
 * (like a Box), and a select-box border on hover / when selected.
 */
export const SpecialEventPanel: React.FC<{
  image: string;
  title: string;
  endDate: Date;
  isSelected: boolean;
  onSelect: () => void;
  count?: Decimal;
}> = ({ image, title, endDate, isSelected, onSelect, count }) => {
  const { t } = useAppTranslation();
  const now = useNow({ live: true, autoEndAt: endDate.getTime() });
  const [isHover, setIsHover] = useState(false);

  // Largest unit only ("3days", "23hrs", "5mins"), like the other event
  // countdowns, so the final day counts down instead of sitting on "1 day".
  const secondsLeft = Math.max(0, (endDate.getTime() - now) / 1000);

  const showSelectBox = isSelected || (isHover && !isMobile);

  const precisionCount = setPrecision(count ?? new Decimal(0), 2);
  const showCount = precisionCount.greaterThan(0);

  return (
    <div
      className="relative w-full mb-2"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <ButtonPanel variant="card" className="w-full" onClick={onSelect}>
        <div className="flex items-center">
          <img src={image} className="h-8 mr-3" alt={title} />
          <div className="flex flex-col">
            <span className="text-xs">{title}</span>
            <div className="flex items-center whitespace-nowrap">
              <img
                src={SUNNYSIDE.icons.stopwatch}
                className="h-3 mr-1"
                alt="timer"
              />
              <span className="text-xxs">
                {`${secondsToString(secondsLeft, { length: "short" })} ${t("time.left")}`}
              </span>
            </div>
          </div>
        </div>
      </ButtonPanel>

      {/* Amount owned (top-right, like a Box) */}
      {showCount && (
        <CountLabel
          isHover={isHover}
          count={precisionCount}
          rightShiftPx={LABEL_RIGHT_SHIFT_PX}
          topShiftPx={LABEL_TOP_SHIFT_PX}
        />
      )}

      {/* Selected / hover indicator (matches the Box component) */}
      {showSelectBox && (
        <>
          <img
            className="absolute pointer-events-none"
            src={SUNNYSIDE.ui.selectBoxTL}
            style={{
              top: -CORNER_INSET,
              left: -CORNER_INSET,
              width: `${CORNER_PX}px`,
            }}
          />
          <img
            className="absolute pointer-events-none"
            src={SUNNYSIDE.ui.selectBoxTR}
            style={{
              top: -CORNER_INSET,
              right: -CORNER_INSET,
              width: `${CORNER_PX}px`,
            }}
          />
          <img
            className="absolute pointer-events-none"
            src={SUNNYSIDE.ui.selectBoxBL}
            style={{
              bottom: -CORNER_INSET,
              left: -CORNER_INSET,
              width: `${CORNER_PX}px`,
            }}
          />
          <img
            className="absolute pointer-events-none"
            src={SUNNYSIDE.ui.selectBoxBR}
            style={{
              bottom: -CORNER_INSET,
              right: -CORNER_INSET,
              width: `${CORNER_PX}px`,
            }}
          />
        </>
      )}
    </div>
  );
};
