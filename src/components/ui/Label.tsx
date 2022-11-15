import React from "react";
import classnames from "classnames";
import { pixelWhiteBorderStyle } from "features/game/lib/style";

interface Props {
  className?: string;
}
export const Label: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={classnames(
        "bg-silver-300 text-white text-xs object-contain justify-center items-center flex",
        className
      )}
      style={pixelWhiteBorderStyle}
    >
      <span>{children}</span>
    </div>
  );
};
