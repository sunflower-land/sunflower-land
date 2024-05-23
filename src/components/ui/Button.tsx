import React from "react";
import classnames from "classnames";
import { pixelLightBorderStyle } from "features/game/lib/style";
import { useLongPress } from "lib/utils/hooks/useLongPress";
import Decimal from "decimal.js-light";
import { useSound } from "lib/utils/hooks/useSound";

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
    }
  );

  const button = useSound("button");

  const onClickWithSound = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
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
        "bg-brown-200 w-full p-1 text-xs object-contain justify-center items-center hover:bg-brown-300 cursor-pointer flex disabled:opacity-50",
        className
      )}
      type={type}
      disabled={disabled}
      style={pixelLightBorderStyle}
      {...clickEvents}
    >
      <div className="mb-1">{children}</div>
    </button>
  );
};
