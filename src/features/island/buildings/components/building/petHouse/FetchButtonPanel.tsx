import React from "react";
import { ButtonPanel } from "components/ui/Panel";
import { PetResourceName } from "features/game/types/pets";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import Decimal from "decimal.js-light";

const INNER_CANVAS_WIDTH = 12;

export interface FetchButtonPanelProps {
  fetch: PetResourceName;
  inventoryCount: Decimal;
  energyRequired: number;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  locked?: boolean;
  className?: string;
}

export const FetchButtonPanel: React.FC<FetchButtonPanelProps> = ({
  fetch,
  inventoryCount,
  energyRequired,
  onClick,
  disabled,
  selected,
  locked,
  className,
}) => {
  const fetchImage = ITEM_DETAILS[fetch]?.image;

  return (
    <ButtonPanel
      className={classNames(
        "flex flex-row p-0 overflow-hidden items-center relative",
        { "cursor-pointer": !!onClick && !disabled },
        className,
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      selected={selected}
    >
      {locked && (
        <img
          src={SUNNYSIDE.icons.lock}
          alt="Locked"
          className="absolute top-0.5 right-0.5 w-4 h-4 object-contain z-10"
        />
      )}
      {/* Left: Fetch image */}
      <div
        className="flex items-center justify-center"
        style={{
          width: `${PIXEL_SCALE * INNER_CANVAS_WIDTH}px`,
          height: `${PIXEL_SCALE * INNER_CANVAS_WIDTH}px`,
        }}
      >
        {fetchImage && (
          <img
            src={fetchImage}
            alt={fetch}
            className="w-[85%] h-[85%] object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        )}
      </div>

      {/* Right: Stats */}
      <div className="flex flex-col justify-center gap-0.5 px-2 py-1 min-w-0 flex-1">
        <div className="flex items-center gap-1 text-xs">
          <img
            src={SUNNYSIDE.icons.basket}
            alt="Inventory"
            className="w-4 h-4 object-contain shrink-0"
          />
          <span className="text-brown-800">{inventoryCount.toString()}</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <img
            src={SUNNYSIDE.icons.lightning}
            alt="Energy"
            className="w-4 h-4 object-contain shrink-0"
          />
          <span className="text-brown-800">{energyRequired}</span>
        </div>
      </div>
    </ButtonPanel>
  );
};
