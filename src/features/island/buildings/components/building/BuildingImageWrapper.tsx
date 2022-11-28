import React from "react";
import classNames from "classnames";
import { Bar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import expressionAlerted from "assets/icons/expression_alerted.png";

/**
 * BuildingImageWrapper props
 * @param nonInteractible if the building is non interactable
 * @param crafting if the building is in the process of crafting
 * @param ready if the building crafting process is ready
 * @param itemName the item name currently crafting/crafted
 * @param craftingSeconds the number of seconds needed to craft the item
 * @param secondsTillReady the number of seconds needed till the crafting is ready
 * @param onClick on click event
 */
interface Props {
  nonInteractible?: boolean;
  crafting?: boolean;
  ready?: boolean;
  craftingSeconds?: number;
  secondsTillReady?: number;
  onClick: () => void;
}

export const BuildingImageWrapper: React.FC<Props> = ({
  nonInteractible,
  crafting,
  ready,
  craftingSeconds,
  secondsTillReady,
  onClick,
  children,
}) => {
  return (
    <>
      {/* building */}
      <div
        className={classNames(
          "relative w-full h-full",
          nonInteractible ? "" : "cursor-pointer hover:img-highlight"
        )}
        onClick={onClick}
      >
        {children}
      </div>

      {/* Progress bar */}
      {crafting &&
        craftingSeconds !== undefined &&
        secondsTillReady !== undefined && (
          <div
            className="flex justify-center absolute w-full pointer-events-none"
            style={{
              bottom: `${PIXEL_SCALE * 3}px`,
              paddingRight: `${PIXEL_SCALE * 1}px`,
            }}
          >
            <Bar
              percentage={100 - (secondsTillReady / craftingSeconds) * 100}
              type="progress"
            />
          </div>
        )}

      {/* Ready indicator */}
      {ready && (
        <div
          className="flex justify-center absolute w-full pointer-events-none z-30"
          style={{
            top: `${PIXEL_SCALE * -12}px`,
          }}
        >
          <img
            src={expressionAlerted}
            className="ready"
            style={{
              width: `${PIXEL_SCALE * 4}px`,
            }}
          />
        </div>
      )}
    </>
  );
};
