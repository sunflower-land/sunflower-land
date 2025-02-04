import React, { useState } from "react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import { useLongPress } from "lib/utils/hooks/useLongPress";
import { setPrecision } from "lib/utils/formatNumber";
import { isMobile } from "mobile-device-detect";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { CountLabel } from "components/ui/CountLabel";
import { LabelType } from "components/ui/Label";
import { ProgressType, ResizableBar } from "components/ui/ProgressBar";
import { SkillSquareIcon } from "./SkillSquareIcon";
import { NPCName } from "lib/npcs";
import { BumpkinSkillTier } from "features/game/types/bumpkinSkills";

const LABEL_RIGHT_SHIFT_PX = -5 * PIXEL_SCALE;
const LABEL_TOP_SHIFT_PX = -5 * PIXEL_SCALE;
export const INNER_CANVAS_WIDTH = 25;

export interface BoxProps {
  hideCount?: boolean;
  image?: any;
  secondaryImage?: any;
  isSelected?: boolean;
  count?: Decimal;
  countLabelType?: LabelType;
  onClick?: () => void;
  disabled?: boolean;
  locked?: boolean;
  canBeLongPressed?: boolean;
  /**
   * This can be used a different icon when there is no count passed in.
   * It will be placed in the top right corner of the box.
   */
  alternateIcon?: string;
  /**
   * When an NFT is minted it enters into a cooldown period where is cannot be withdrawn from the farm. We communicate
   * this as if the NFT is under construction.
   */
  cooldownInProgress?: boolean;
  showOverlay?: boolean;
  overlayIcon?: React.ReactNode;
  className?: string;
  iconClassName?: string;
  /**
   * The ref for the parent div of the boxes.
   * Used for shifting the item count label if it will be outside of the parent div.
   * Only need to set if div is scrollable.
   * Otherwise leave this unset so the shifting is done if the label is outside the viewport.
   */
  parentDivRef?: React.RefObject<HTMLElement>;
  /**
   * progress bar for the box, replaces the bottom left and bottom right
   */
  progress?: {
    label?: string;
    percentage: number;
    type: ProgressType;
  };
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  tier: BumpkinSkillTier;
  npc?: NPCName;
}

export const SkillBox: React.FC<BoxProps> = ({
  hideCount = false,
  image,
  secondaryImage,
  isSelected,
  count,
  countLabelType = "default",
  onClick,
  disabled,
  locked,
  canBeLongPressed,
  cooldownInProgress,
  showOverlay = false,
  overlayIcon,
  className = "",
  iconClassName = "",
  parentDivRef,
  alternateIcon,
  progress,
  onDragOver,
  onDrop,
  tier,
  npc,
}) => {
  const [isHover, setIsHover] = useState(false);

  const precisionCount = setPrecision(count ?? 0, 2);

  const canClick = !locked && !disabled && !!onClick;

  const longPressEvents = useLongPress(
    () => (canClick ? onClick?.() : undefined),
    precisionCount,
    {
      delay: 500,
      interval: 20,
    },
  );

  const clickEvents = canBeLongPressed
    ? longPressEvents
    : { onClick: canClick ? onClick : undefined };

  const showCountLabel = !locked && !hideCount && precisionCount.greaterThan(0);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className={classNames("bg-brown-600 relative", {
          "bg-brown-600 cursor-not-allowed opacity-75": disabled,
          "cursor-pointer": canClick,
        })}
        {...clickEvents}
        style={{
          width: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
          height: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
          marginTop: `${PIXEL_SCALE * 3}px`,
          marginBottom: `${PIXEL_SCALE * 2}px`,
          marginLeft: `${PIXEL_SCALE * 2}px`,
          marginRight: `${PIXEL_SCALE * 3}px`,
          ...pixelDarkBorderStyle,
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div
          className={classNames(
            "absolute flex justify-center items-center w-full h-full",
            {
              "opacity-75": locked,
            },
          )}
        >
          <SkillSquareIcon
            tier={tier}
            icon={image}
            width={INNER_CANVAS_WIDTH}
            className={iconClassName}
            npc={npc}
          />
          {secondaryImage && (
            <img
              src={secondaryImage}
              className="absolute left-0 top-0 w-2/5 h-2/5 object-contain"
              alt="crop"
            />
          )}
        </div>

        {/* Cool down in process overlay */}
        {!locked && cooldownInProgress && (
          <>
            <div className="absolute flex justify-center w-full h-full pointer-events-none">
              <div className="absolute object-contain bg-overlay-white w-full h-full opacity-50" />
              <img
                src={SUNNYSIDE.icons.timer}
                alt="item in cooldown period"
                className="relative object-contain"
                style={{
                  width: `${PIXEL_SCALE * 8}px`,
                }}
              />
            </div>
          </>
        )}

        {/* Locked icon */}
        {locked && (
          <img
            src={
              cooldownInProgress
                ? SUNNYSIDE.icons.timer
                : SUNNYSIDE.icons.cancel
            }
            className="absolute z-20"
            style={{
              right: `${PIXEL_SCALE * (cooldownInProgress ? -5 : -6)}px`,
              top: `${PIXEL_SCALE * (cooldownInProgress ? -6 : -6)}px`,
              width: `${PIXEL_SCALE * (cooldownInProgress ? 8 : 11)}px`,
            }}
          />
        )}

        {/* Count label */}
        {showCountLabel && (
          <CountLabel
            isHover={isHover}
            count={precisionCount}
            labelType={countLabelType}
            rightShiftPx={LABEL_RIGHT_SHIFT_PX}
            topShiftPx={LABEL_TOP_SHIFT_PX}
            parentDivRef={parentDivRef}
          />
        )}

        {/** Show alternate Icon */}
        {!showCountLabel && alternateIcon && (
          <CountLabel
            isHover={isHover}
            count={precisionCount}
            labelType={countLabelType}
            rightShiftPx={LABEL_RIGHT_SHIFT_PX}
            topShiftPx={LABEL_TOP_SHIFT_PX}
            parentDivRef={parentDivRef}
          />
        )}

        {/** Overlay icon */}
        {showOverlay && (
          <div className="absolute flex justify-center w-full h-full pointer-events-none">
            <div className="absolute object-contain bg-overlay-white w-full h-full opacity-50" />
            {overlayIcon}
          </div>
        )}

        {progress && (
          <div
            className="absolute flex flex-col items-center"
            style={{
              top: `${PIXEL_SCALE * INNER_CANVAS_WIDTH}px`,
              left: `-5px`,
            }}
          >
            <ResizableBar
              percentage={progress.percentage}
              type={progress.type}
              outerDimensions={{
                width: INNER_CANVAS_WIDTH + 4,
                height: 7,
              }}
            />
          </div>
        )}
      </div>

      {/** Selected / hover indicator */}
      {(isSelected || (isHover && !isMobile)) && canClick && (
        <>
          {/* {!progress && ( */}
          <>
            <img
              className="absolute pointer-events-none"
              src={SUNNYSIDE.ui.selectBoxBL}
              style={{
                top: `${PIXEL_SCALE * INNER_CANVAS_WIDTH}px`,
                left: `${PIXEL_SCALE * 0}px`,
                width: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <img
              className="absolute pointer-events-none"
              src={SUNNYSIDE.ui.selectBoxBR}
              style={{
                top: `${PIXEL_SCALE * INNER_CANVAS_WIDTH}px`,
                left: `${PIXEL_SCALE * INNER_CANVAS_WIDTH}px`,
                width: `${PIXEL_SCALE * 8}px`,
              }}
            />
          </>
          {/* )} */}

          <img
            className="absolute pointer-events-none"
            src={SUNNYSIDE.ui.selectBoxTL}
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              left: `${PIXEL_SCALE * 0}px`,
              width: `${PIXEL_SCALE * 8}px`,
            }}
          />
          <img
            className="absolute pointer-events-none"
            src={SUNNYSIDE.ui.selectBoxTR}
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              left: `${PIXEL_SCALE * INNER_CANVAS_WIDTH}px`,
              width: `${PIXEL_SCALE * 8}px`,
            }}
          />
        </>
      )}
      {progress?.label && (
        <div className="flex justify-center pt-2">
          <span className="text-xxs whitespace-nowrap">{progress.label}</span>
        </div>
      )}
    </div>
  );
};
