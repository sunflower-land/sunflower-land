import React, { useState } from "react";
import classNames from "classnames";
import { InnerPanel } from "components/ui/Panel";
import { Bar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";
import { secondsToString } from "lib/utils/time";
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
  itemName?: InventoryItemName;
  craftingSeconds?: number;
  secondsTillReady?: number;
  onClick: () => void;
}

export const BuildingImageWrapper: React.FC<Props> = ({
  nonInteractible,
  crafting,
  ready,
  itemName,
  craftingSeconds,
  secondsTillReady,
  onClick,
  children,
}) => {
  const [showHover, setShowHover] = useState(false);
  const [isMobile] = useIsMobile();

  const onMouseEnter = () => {
    true && setShowHover(true);
  };

  const onMouseLeave = () => {
    setShowHover(false);
  };

  // time to complete popup
  // only shows on PC on hover
  const TimeToComplete = () => {
    if (
      !crafting ||
      !itemName ||
      secondsTillReady === undefined ||
      secondsTillReady < 0
    ) {
      return <></>;
    }

    return (
      <InnerPanel
        className={classNames(
          "absolute transition-opacity whitespace-nowrap w-fit p-1 z-50 pointer-events-none",
          {
            "opacity-100": showHover,
            "opacity-0": !showHover,
          }
        )}
      >
        <div className="flex flex-col text-xxs text-white text-shadow ml-2 mr-2">
          <div className="flex flex-1 items-center justify-center">
            <img src={ITEM_DETAILS[itemName].image} className="w-4 mr-1" />
            <span>{itemName}</span>
          </div>
          <span className="flex-1">
            {secondsToString(secondsTillReady, {
              length: "medium",
            })}
          </span>
        </div>
      </InnerPanel>
    );
  };

  return (
    <>
      {/* building */}
      <div
        className={classNames(
          "relative w-full h-full",
          nonInteractible ? "" : "cursor-pointer hover:img-highlight"
        )}
        onClick={onClick}
        onMouseEnter={isMobile ? undefined : onMouseEnter}
        onMouseLeave={isMobile ? undefined : onMouseLeave}
      >
        {children}
      </div>

      {/* Time to complete popup */}
      <div
        className="flex justify-center absolute w-full pointer-events-none"
        style={{
          top: `${PIXEL_SCALE * -24}px`,
        }}
      >
        <TimeToComplete />
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
