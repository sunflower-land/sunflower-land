import React from "react";
import classnames from "classnames";
import Decimal from "decimal.js-light";
import { useSound } from "lib/utils/hooks/useSound";

import primaryButton from "assets/ui/light_button.png";

import { useLongPress } from "lib/utils/hooks/useLongPress";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | undefined;
  longPress?: boolean;
  longPressInterval?: number;
}
export const Button: React.FC<Props> = ({
  children,
  onClick,
  disabled,
  className,
  type,
  longPress = false,
  longPressInterval = 50,
}) => {
  const longPressEvents = useLongPress(
    (e) =>
      !disabled
        ? onClick?.(e as React.MouseEvent<HTMLButtonElement, MouseEvent>)
        : undefined,
    new Decimal(1000000),
    {
      delay: 500,
      interval: longPressInterval,
    },
  );

  const button = useSound("button");

  const onClickWithSound = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    button.play();
    onClick?.(event);
  };

  const clickEvents = longPress
    ? longPressEvents
    : { onClick: !disabled ? onClickWithSound : undefined };

  return (
    <button
      className={classnames(
        "w-full p-1 text-sm object-contain justify-center items-center hover:brightness-90 cursor-pointer flex disabled:opacity-50",
        className,
        { "cursor-not-allowed": disabled },
      )}
      type={type}
      disabled={disabled}
      style={{
        borderImage: `url(${primaryButton})`,
        borderStyle: "solid",
        borderWidth: `8px 8px 10px 8px`,
        borderImageSlice: "3 3 4 3 fill",
        imageRendering: "pixelated",
        borderImageRepeat: "stretch",
        borderRadius: `${PIXEL_SCALE * 5}px`,
        color: "#674544",
      }}
      {...clickEvents}
    >
      <div className="mb-1">{children}</div>
    </button>
  );
};
