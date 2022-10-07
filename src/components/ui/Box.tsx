import React, { useState, useEffect } from "react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import darkBorder from "assets/ui/panel/dark_border.png";
import selectBox from "assets/ui/select/select_box.png";
import { Label } from "./Label";
import timer from "assets/icons/timer.png";
import cancel from "assets/icons/cancel.png";
import { useLongPress } from "lib/utils/hooks/useLongPress";
import { shortenCount } from "lib/utils/formatNumber";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";

export interface BoxProps {
  hideCount?: boolean;
  image?: any;
  secondaryImage?: any;
  isSelected?: boolean;
  count?: Decimal;
  onClick?: () => void;
  disabled?: boolean;
  locked?: boolean;
  canBeLongPressed?: boolean;
  /**
   * When an NFT is minted it enters into a cooldown period where is cannot be withdrawn from the farm. We communicate
   * this as if the NFT is under construction.
   */
  cooldownInProgress?: boolean;
  showOverlay?: boolean;
  overlayIcon?: React.ReactNode;
  className?: string;
}

export const Box: React.FC<BoxProps> = ({
  hideCount = false,
  image,
  secondaryImage,
  isSelected,
  count,
  onClick,
  disabled,
  locked,
  canBeLongPressed,
  cooldownInProgress,
  showOverlay = false,
  overlayIcon,
  className = "",
}) => {
  const [isHover, setIsHover] = useState(false);
  const [shortCount, setShortCount] = useState("");
  const [isMobile] = useIsMobile();

  // re execute function on count change
  useEffect(() => setShortCount(shortenCount(count)), [count]);

  const canClick = !locked && !disabled;

  const longPressEvents = useLongPress(
    (e) => (canClick ? onClick?.() : undefined),
    count,
    {
      delay: 500,
      interval: 20,
    }
  );

  const clickEvents = canBeLongPressed
    ? longPressEvents
    : { onClick: canClick ? onClick : undefined };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHover(!isMobile)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className={classNames(
          "w-12 h-12 bg-brown-600  m-1.5 cursor-pointer flex items-center justify-center relative",
          {
            "bg-brown-600 cursor-not-allowed": disabled,
            "bg-brown-200": isSelected,
            "opacity-75": locked,
            "cursor-pointer": canClick,
          }
        )}
        {...clickEvents}
        // Custom styles to get pixellated border effect
        style={{
          borderStyle: "solid",
          borderWidth: "6px",
          borderImage: `url(${darkBorder}) 30 stretch`,
          borderImageSlice: "25%",
          imageRendering: "pixelated",
          borderImageRepeat: "repeat",
          borderRadius: "20px",
        }}
      >
        {secondaryImage ? (
          <div className="w-full flex">
            <img src={image} className="w-4/5 object-contain" alt="item" />

            <img
              src={secondaryImage}
              className="absolute right-0 bottom-1 w-1/2 h-1/2 object-contain"
              alt="crop"
            />
          </div>
        ) : (
          image && (
            <img
              src={image}
              className="h-full w-full object-contain"
              alt="item"
            />
          )
        )}

        {!locked && cooldownInProgress && (
          <>
            <div className="absolute h-full w-full object-contain bg-white opacity-30" />
            <div className="absolute flex items-center justify-center h-full w-full">
              <img src={timer} alt="item in cooldown period" className="w-4" />
            </div>
          </>
        )}

        {locked && (
          <img
            src={!cooldownInProgress ? cancel : timer}
            className="absolute w-6 -top-3 -right-3 px-0.5 z-20"
          />
        )}

        {!locked && !hideCount && !!count && count.greaterThan(0) && (
          <Label
            className={classNames(
              "absolute -top-4 -right-3 px-0.5 text-xs z-10",
              {
                "z-20": isHover,
              }
            )}
          >
            {isHover ? count.toString() : shortCount}
          </Label>
        )}
        {showOverlay && (
          <div className="absolute w-[38px] h-[38px] bg-overlay-white pointer-events-none flex justify-center items-center">
            {overlayIcon}
          </div>
        )}
      </div>

      {(isSelected || isHover) && !locked && !disabled && (
        <img
          className="absolute w-14 h-14 top-0.5 left-0.5 pointer-events-none"
          src={selectBox}
        />
      )}
    </div>
  );
};
