import React from "react";
import classnames from "classnames";
import { useSound } from "lib/utils/hooks/useSound";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClick?: (event: React.PointerEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | undefined;
}

/**
 * A button which is trigger on touch, not release
 */
export const SensitiveButton: React.FC<Props> = ({
  children,
  onClick,
  disabled,
  className,
  type,
}) => {
  const button = useSound("button");

  const onPointerDownWithSound = (
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    button.play();
    onClick?.(event);
  };

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
        borderImage: `url(${SUNNYSIDE.ui.primaryButton})`,
        borderStyle: "solid",
        borderWidth: `8px 8px 10px 8px`,
        borderImageSlice: "3 3 4 3 fill",
        imageRendering: "pixelated",
        borderImageRepeat: "stretch",
        borderRadius: `${PIXEL_SCALE * 5}px`,
        color: "#674544",
      }}
      onPointerDown={onPointerDownWithSound}
    >
      <div className="mb-1">{children}</div>
    </button>
  );
};
