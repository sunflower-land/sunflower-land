import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import { Label } from "./Label";
import selectBoxBL from "assets/ui/select/selectbox_bl.png";
import selectBoxBR from "assets/ui/select/selectbox_br.png";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import timer from "assets/icons/timer.png";
import cancel from "assets/icons/cancel.png";
import { useLongPress } from "lib/utils/hooks/useLongPress";
import { shortenCount } from "lib/utils/formatNumber";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { PIXEL_SCALE } from "features/game/lib/constants";

const LABEL_RIGHT_SHIFT_PX = -5 * PIXEL_SCALE;
const LABEL_TOP_SIHFT_PX = -6 * PIXEL_SCALE;

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
  const [showHiddenCountLabel, setShowHiddenCountLabel] = useState(false);
  const [shortCount, setShortCount] = useState("");
  const [isMobile] = useIsMobile();

  const labelRef = useRef<HTMLDivElement>(null);
  const labelCheckerRef = useRef<HTMLDivElement>(null);

  // re-execute function on count change
  useEffect(() => setShortCount(shortenCount(count)), [count]);

  const canClick = !locked && !disabled;

  const longPressEvents = useLongPress(
    (e) => (canClick ? onClick?.() : undefined),
    undefined,
    count,
    {
      delay: 500,
      interval: 20,
    }
  );

  const clickEvents = canBeLongPressed
    ? longPressEvents
    : { onClick: canClick ? onClick : undefined };

  const showCountLabel =
    !locked && !hideCount && !!count && count.greaterThan(0);

  // shift count label position to right if out of parent div or viewport bounds on hover
  // restore count label position when not on hover
  // hidden count label is needed to prevent flickering of the visible count label on hover
  useEffect(() => {
    setShowHiddenCountLabel(false);

    // restore count label position when not on hover
    if (!isHover && labelRef.current) {
      labelRef.current.style.right = `${LABEL_RIGHT_SHIFT_PX}px`;
      return;
    }

    // null check
    if (!labelRef.current || !labelCheckerRef.current) {
      return;
    }

    // get hidden count label and parent div/viewport bounding
    const hiddenCountLabelBounding =
      labelCheckerRef.current.getBoundingClientRect();
    const parentDivBounding = parentDivRef?.current?.getBoundingClientRect();

    // if parent div is defined,
    // shift count label to the right so left most bounds for count label touches that of the parent div
    if (
      parentDivBounding &&
      hiddenCountLabelBounding.left < parentDivBounding.left
    ) {
      labelRef.current.style.right = `${
        LABEL_RIGHT_SHIFT_PX +
        hiddenCountLabelBounding.left -
        parentDivBounding.left
      }px`;
      return;
    }

    // else shift count label to the right so left most bounds for count label touches that of the viewport
    if (hiddenCountLabelBounding?.left < 0) {
      labelRef.current.style.right = `${
        LABEL_RIGHT_SHIFT_PX + hiddenCountLabelBounding.left
      }px`;
    }
  }, [isHover]);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => {
        setShowHiddenCountLabel(true);
        setIsHover(true);
      }}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className={classNames("bg-brown-600 cursor-pointer relative", {
          "bg-brown-600 cursor-not-allowed": disabled,
          "bg-brown-200": isSelected,
          "opacity-75": locked,
          "cursor-pointer": canClick,
        })}
        {...clickEvents}
        style={{
          width: `${PIXEL_SCALE * 18}px`,
          height: `${PIXEL_SCALE * 18}px`,
          marginTop: `${PIXEL_SCALE * 3}px`,
          marginBottom: `${PIXEL_SCALE * 2}px`,
          marginLeft: `${PIXEL_SCALE * 2}px`,
          marginRight: `${PIXEL_SCALE * 3}px`,
          ...pixelDarkBorderStyle,
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
        {showCountLabel && (
          <div
            ref={labelRef}
            className={classNames("absolute", {
              "z-10": !isHover,
              "z-20": isHover,
            })}
            style={{
              right: `${LABEL_RIGHT_SHIFT_PX}px`,
              top: `${LABEL_TOP_SIHFT_PX}px`,
              pointerEvents: "none",
            }}
          >
            <Label className="px-0.5 text-xxs">
              {isHover && !showHiddenCountLabel ? count.toString() : shortCount}
            </Label>
          </div>
        )}

        {/* Transparent long count label to adjust the visible count label position on hover */}
        {showCountLabel && showHiddenCountLabel && (
          <div
            ref={labelCheckerRef}
            className="absolute opacity-0"
            style={{
              right: `${LABEL_RIGHT_SHIFT_PX}px`,
              top: `${LABEL_TOP_SIHFT_PX}px`,
              pointerEvents: "none",
            }}
          >
            <Label className="px-0.5 text-xxs">{count.toString()}</Label>
          </div>
        )}

        {/** Overlay icon */}
        {showOverlay && (
          <div
            className="absolute bg-overlay-white pointer-events-none flex justify-center items-center"
            style={{
              top: `${PIXEL_SCALE * 0}px`,
              left: `${PIXEL_SCALE * 0}px`,
              width: `${PIXEL_SCALE * 14}px`,
              height: `${PIXEL_SCALE * 14}px`,
            }}
          >
            {overlayIcon}
          </div>
        )}
      </div>

      {(isSelected || (isHover && !isMobile)) && canClick && (
        <>
          <img
            className="absolute pointer-events-none"
            src={selectBoxBL}
            style={{
              top: `${PIXEL_SCALE * 14}px`,
              left: `${PIXEL_SCALE * 0}px`,
              width: `${PIXEL_SCALE * 8}px`,
            }}
          />
          <img
            className="absolute pointer-events-none"
            src={selectBoxBR}
            style={{
              top: `${PIXEL_SCALE * 14}px`,
              left: `${PIXEL_SCALE * 14}px`,
              width: `${PIXEL_SCALE * 8}px`,
            }}
          />
          <img
            className="absolute pointer-events-none"
            src={selectBoxTL}
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              left: `${PIXEL_SCALE * 0}px`,
              width: `${PIXEL_SCALE * 8}px`,
            }}
          />
          <img
            className="absolute pointer-events-none"
            src={selectBoxTR}
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              left: `${PIXEL_SCALE * 14}px`,
              width: `${PIXEL_SCALE * 8}px`,
            }}
          />
        </>
      )}
    </div>
  );
};
