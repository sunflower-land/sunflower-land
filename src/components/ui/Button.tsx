import React from "react";
import classnames from "classnames";
import Decimal from "decimal.js-light";
import { useSound } from "lib/utils/hooks/useSound";
import { SUNNYSIDE } from "assets/sunnyside";

import secondaryButton from "assets/ui/secondary_button.png";

import { useLongPress } from "lib/utils/hooks/useLongPress";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | undefined;

  // Word for primary or secondary
  variant?: "primary" | "secondary";

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
  variant = "primary",
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

  const buttonImage =
    variant === "primary" ? SUNNYSIDE.ui.primaryButton : secondaryButton;
  const buttonPressedImage =
    variant === "primary" ? SUNNYSIDE.ui.primaryButtonPressed : secondaryButton;

  const buttonVariables = {
    "--button-image": `url(${buttonImage})`,
    "--button-pressed-image": `url(${buttonPressedImage})`,
  };
  return (
    <>
      <button
        className={classnames(
          `w-full p-1 text-sm object-contain justify-center items-center hover:brightness-90 cursor-pointer flex disabled:opacity-50 [border-image:var(--button-image)_3_3_4_3_fill] active:[border-image:var(--button-pressed-image)_3_3_4_3_fill] transition-transform hover:scale-[1.015] active:scale-[0.98]`,
          className,
          { "cursor-not-allowed": disabled },
        )}
        type={type}
        disabled={disabled}
        style={{
          ...buttonVariables,
          borderStyle: "solid",
          borderWidth: `8px 8px 10px 8px`,
          imageRendering: "pixelated",
          borderImageRepeat: "stretch",
          borderRadius: `${PIXEL_SCALE * 5}px`,
        }}
        {...clickEvents}
      >
        <div className="mb-1">{children}</div>
      </button>
    </>
  );
};
