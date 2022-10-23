import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import { Label } from "./Label";
import darkBorder from "assets/ui/panel/dark_border.png";
import selectBox from "assets/ui/select/select_box.png";
import timer from "assets/icons/timer.png";
import cancel from "assets/icons/cancel.png";
import { useLongPress } from "lib/utils/hooks/useLongPress";
import { shortenCount } from "lib/utils/formatNumber";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";

const LABEL_RIGHT_SIHFT_PX = -13;
const LABEL_TOP_SIHFT_PX = -17;

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
  /**
   * The ref for the parent div of the boxes.
   * Used for shifting the item count label if it will be outside of the parent div.
   * Only need to set if div is scrollable.
   * Otherwise leave this unset so the shifting is done if the label is outside the viewport.
   */
  parentDivRef?: React.RefObject<HTMLElement>;
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
  parentDivRef,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [showLabelChecker, setShowLabelChecker] = useState(false);
  const [shortCount, setShortCount] = useState("");
  const [isMobile] = useIsMobile();

  const labelRef = useRef<HTMLDivElement>(null);
  const labelCheckerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (isHover) {
      const labelCheckerBounding =
        labelCheckerRef.current?.getBoundingClientRect();
      const parentDivBounding = parentDivRef?.current?.getBoundingClientRect();

      // shift label to the right so it will not be outside of the parent div
      if (labelRef.current && labelCheckerBounding) {
        if (
          parentDivBounding &&
          labelCheckerBounding.left < parentDivBounding.left
        ) {
          labelRef.current.style.right = `${
            LABEL_RIGHT_SIHFT_PX +
            labelCheckerBounding.left -
            parentDivBounding.left
          }px`;
        } else if (labelCheckerBounding?.left < 0) {
          labelRef.current.style.right = `${
            LABEL_RIGHT_SIHFT_PX + labelCheckerBounding.left
          }px`;
        }
      }
    } else {
      // restore label position
      if (labelRef.current) {
        labelRef.current.style.right = `${LABEL_RIGHT_SIHFT_PX}px`;
      }
    }

    setShowLabelChecker(false);
  }, [isHover]);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => {
        setShowLabelChecker(true);
        setIsHover(true);
      }}
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

        {/* Count label */}
        {!locked && !hideCount && !!count && count.greaterThan(0) && (
          <div
            ref={labelRef}
            className={classNames("absolute z-10", {
              "z-20": isHover,
            })}
            style={{
              right: `${LABEL_RIGHT_SIHFT_PX}px`,
              top: `${LABEL_TOP_SIHFT_PX}px`,
              pointerEvents: "none",
            }}
          >
            <Label className="px-0.5 text-xxs">
              {isHover && !showLabelChecker ? count.toString() : shortCount}
            </Label>
          </div>
        )}

        {/* Transparent long count label to adjust the count label position on hover */}
        {!locked &&
          !hideCount &&
          !!count &&
          count.greaterThan(0) &&
          showLabelChecker && (
            <div
              ref={labelCheckerRef}
              className="absolute opacity-0"
              style={{
                right: `${LABEL_RIGHT_SIHFT_PX}px`,
                top: `${LABEL_TOP_SIHFT_PX}px`,
                pointerEvents: "none",
              }}
            >
              <Label className="px-0.5 text-xxs">{count.toString()}</Label>
            </div>
          )}
        {showOverlay && (
          <div className="absolute w-[38px] h-[38px] bg-overlay-white pointer-events-none flex justify-center items-center">
            {overlayIcon}
          </div>
        )}
      </div>

      {(isSelected || (isHover && !isMobile)) && !locked && !disabled && (
        <img
          className="absolute w-14 h-14 top-0.5 left-0.5 pointer-events-none"
          src={selectBox}
        />
      )}
    </div>
  );
};
