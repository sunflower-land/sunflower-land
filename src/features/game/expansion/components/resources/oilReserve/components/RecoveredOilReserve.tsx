import React, { useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import fullOilReserve from "assets/resources/oil/oil_reserve_full.webp";
import spurtingWell from "assets/resources/oil/spurting_well.webp";

// Native sprite sizes in game pixels. The reserve art is a 30x21 ellipse centred
// in the 2x2 (32x32) tile, so its base sits (32 - 21) / 2 px above the tile
// floor. The spurting well is taller (29x38) and its art reaches the bottom of
// its own canvas, so anchoring it to that same base line seats the well in the
// reserve and lets the gusher extend upward out of the node.
const RESERVE_WIDTH = 30;
const RESERVE_HEIGHT = 21;
const SPURTING_WELL_WIDTH = 29;
const SPURTING_WELL_HEIGHT = 38;
// Oil Reserve is a 2x2 resource.
const TILE_SIZE = 32;
const RESERVE_BASE_OFFSET = (TILE_SIZE - RESERVE_HEIGHT) / 2;

// Fine positioning of the well within the reserve, in game pixels, relative to
// centring the two canvases and seating the well on the reserve's base line.
// Tuned by eye: the well's pool is not symmetric within its own canvas, so
// centring the canvases alone reads as off-centre against the symmetric rim.
const SPURTING_WELL_NUDGE_X = -0.5;
const SPURTING_WELL_LIFT_Y = 3;
const SPURTING_WELL_LEFT =
  (TILE_SIZE - SPURTING_WELL_WIDTH) / 2 + SPURTING_WELL_NUDGE_X;
const SPURTING_WELL_BOTTOM = RESERVE_BASE_OFFSET + SPURTING_WELL_LIFT_Y;

interface Props {
  bonusDrill: boolean;
  hasDrill: boolean;
  onDrill: () => void;
}

export const RecoveredOilReserve: React.FC<Props> = ({
  bonusDrill,
  hasDrill,
  onDrill,
}) => {
  const [showDrillWarning, setShowDrillWarning] = useState(false);
  const { t } = useAppTranslation();

  const handleMouseEnter = () => {
    if (!hasDrill) {
      setShowDrillWarning(true);
    }
  };

  const handleMouseLeave = () => {
    if (showDrillWarning) setShowDrillWarning(false);
  };

  return (
    <div
      className={classNames(
        "absolute w-full h-full flex justify-center items-center",
        {
          "cursor-pointer hover:img-highlight": !showDrillWarning,
          "cursor-not-allowed": showDrillWarning,
        },
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={fullOilReserve}
        style={{
          width: `${PIXEL_SCALE * RESERVE_WIDTH}px`,
        }}
        alt="Full oil reserve"
        onClick={onDrill}
      />
      {/* Every 3rd drill is the bonus one - the well spurts out of the reserve.
          The spurt art carries no rim of its own, so it layers over the reserve
          rather than replacing it, leaving the rim showing around the gusher.
          Not a click target: its plume overhangs the tile, and making that
          overhang clickable would steal clicks from whatever sits above. Purely
          decorative, so it stays out of the accessibility tree - the reserve
          underneath is the thing you interact with. */}
      {bonusDrill && (
        <img
          src={spurtingWell}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * SPURTING_WELL_WIDTH}px`,
            height: `${PIXEL_SCALE * SPURTING_WELL_HEIGHT}px`,
            left: `${PIXEL_SCALE * SPURTING_WELL_LEFT}px`,
            bottom: `${PIXEL_SCALE * SPURTING_WELL_BOTTOM}px`,
          }}
          alt=""
          aria-hidden
        />
      )}
      {/* No tool warning */}
      {showDrillWarning && (
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -12}px`,
          }}
        >
          <InnerPanel className="absolute whitespace-nowrap w-fit z-50">
            <div className="text-xs mx-1 p-1">
              <span>{`${t("craft")} oil drill`}</span>
            </div>
          </InnerPanel>
        </div>
      )}
    </div>
  );
};
