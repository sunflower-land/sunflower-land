import React, { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

export const MAX_AGING_SHED_RACK_SLOTS = 6;

export const EmptyAgingShedRackSlot: React.FC<{
  isInactive?: boolean;
  isLocked?: boolean;
  lockedTooltip?: string;
}> = ({ isInactive, isLocked, lockedTooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<
    { left: number; top: number } | undefined
  >();
  const slotRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!showTooltip || !slotRef.current || !tooltipRef.current) return;

    const slotRect = slotRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportPadding = PIXEL_SCALE * 2;
    const preferredLeft = slotRect.left + slotRect.width / 2;
    const left = Math.min(
      Math.max(preferredLeft, viewportPadding + tooltipRect.width / 2),
      window.innerWidth - viewportPadding - tooltipRect.width / 2,
    );

    setTooltipPosition({
      left,
      top: slotRect.bottom + PIXEL_SCALE,
    });
  }, [showTooltip, lockedTooltip]);

  return (
    <div
      ref={slotRef}
      className="relative flex flex-col items-center max-w-[72px]"
      onMouseEnter={() => isLocked && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className={classNames((isInactive || isLocked) && "opacity-40")}>
        <Box hideCount disabled>
          <div className="relative w-full h-full border border-dashed border-[#181425]/35 opacity-60 rounded-sm" />
        </Box>
      </div>
      {isLocked && (
        <img
          src={SUNNYSIDE.icons.lock}
          alt="Locked Aging Shed slot"
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 5}px`,
            right: `${PIXEL_SCALE * 5}px`,
            bottom: `${PIXEL_SCALE * 5}px`,
          }}
        />
      )}
      {isLocked &&
        showTooltip &&
        lockedTooltip &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed z-[9999] pointer-events-none"
            style={{
              left: tooltipPosition?.left ?? 0,
              top: tooltipPosition?.top ?? 0,
              transform: "translateX(-50%)",
              visibility: tooltipPosition ? "visible" : "hidden",
            }}
          >
            <Label type="default" className="text-xxs whitespace-nowrap">
              {lockedTooltip}
            </Label>
          </div>,
          document.body,
        )}
    </div>
  );
};
