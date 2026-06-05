import React from "react";
import classnames from "classnames";
import {
  pixelChipBorderStyle,
  pixelChipSelectedBorderStyle,
} from "features/game/lib/style";
import { SquareIcon } from "./SquareIcon";

interface Props {
  selected?: boolean;
  icon?: string;
  iconWidth?: number;
  onClick?: () => void;
  className?: string;
}

/**
 * A pressable "chip" used for filters and other toggleable selections.
 *
 * Unlike a {@link Label} - which players read as a static tag - a Chip carries
 * an extra layer of depth (pixel border + a small drop shadow below) so it
 * reads as clickable. Selected and unselected states use different colours,
 * keeping the reward-yellow Label free for actual rewards/prizes.
 */
export const Chip: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  selected = false,
  icon,
  iconWidth,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      // No handler means the chip is a static display, not interactive - mark
      // it disabled so native button semantics keep it out of the tab order.
      disabled={!onClick}
      className={classnames(
        className,
        "relative w-fit justify-center flex items-center text-xs transition-transform active:translate-y-[1px] cursor-pointer disabled:cursor-default",
      )}
      style={{
        ...(selected ? pixelChipSelectedBorderStyle : pixelChipBorderStyle),
        // Fill matches the flat centre of the 9-slice art so the element
        // background reads as one piece with the border.
        background: selected ? "#c0cbdc" : "#b86f50",
        color: selected ? "#181425" : "#ffffff",
        paddingLeft: icon ? "14px" : "5px",
        paddingRight: "5px",
      }}
    >
      {icon && (
        <SquareIcon
          icon={icon}
          width={iconWidth ?? 9}
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            height: `24px`,
            left: "-12px",
          }}
        />
      )}
      {children}
    </button>
  );
};
