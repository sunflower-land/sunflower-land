import React from "react";
import classnames from "classnames";
import {
  pixelGrayBorderStyle,
  pixelOrangeBorderStyle,
  pixelRedBorderStyle,
  pixelVibrantBorderStyle,
  pixelBlueBorderStyle,
  pixelCalmBorderStyle,
  pixelFormulaBorderStyle,
  pixelGreenBorderStyle,
} from "features/game/lib/style";
import { SquareIcon } from "./SquareIcon";

type labelType =
  | "default"
  | "transparent"
  | "success"
  | "info"
  | "danger"
  | "warning"
  | "vibrant"
  | "formula"
  | "chill";

const LABEL_STYLES: Record<
  labelType,
  { background: string; textColour: string; borderStyle: React.CSSProperties }
> = {
  danger: {
    background: "#e43b44",
    borderStyle: pixelRedBorderStyle,
    textColour: "#ffffff",
  },
  default: {
    background: "#c0cbdc",
    borderStyle: pixelGrayBorderStyle,
    textColour: "#181425",
  },
  // boost
  info: {
    background: "#1e6dd5",
    borderStyle: pixelBlueBorderStyle,
    textColour: "#ffffff",
  },
  // buff
  success: {
    background: "#3e8948",
    borderStyle: pixelGreenBorderStyle,
    textColour: "#ffffff",
  },
  transparent: {
    background: "none",
    borderStyle: {},
    textColour: "#ffffff",
  },
  // Special
  vibrant: {
    background: "#b65389",
    borderStyle: pixelVibrantBorderStyle,
    textColour: "#ffffff",
  },
  // Rare
  warning: {
    background: "#f09100",
    borderStyle: pixelOrangeBorderStyle,
    textColour: "#ffffff",
  },
  chill: {
    background: "#e4a672",
    borderStyle: pixelCalmBorderStyle,
    textColour: "#3e2731",
  },
  formula: {
    background: "#3c4665",
    borderStyle: pixelFormulaBorderStyle,
    textColour: "#ffffff",
  },
};

interface Props {
  className?: string;
  type: labelType;
  style?: React.CSSProperties;
  icon?: string;
  secondaryIcon?: string;
}
export const Label: React.FC<Props> = ({
  children,
  className,
  type,
  style,
  icon,
  secondaryIcon,
}) => {
  return (
    <div
      className={classnames(
        `w-fit justify-center inline-flex items-center uppercase relative`,
        className
      )}
      style={{
        ...LABEL_STYLES[type].borderStyle,
        background: LABEL_STYLES[type].background,
        fontFamily: "TinyFont",
        textShadow: "none",
        paddingLeft: icon ? "14px" : "2px",
        paddingRight: secondaryIcon ? "14px" : "2px",
        // textShadow: LABEL_STYLES[type].textColour ? "#ffffff" : "none",
        color: LABEL_STYLES[type].textColour,
        ...style,
      }}
    >
      {icon && (
        <SquareIcon
          icon={icon}
          width={9}
          className="absolute"
          style={{ height: `24px`, bottom: "-3px", left: "-12px" }}
        />
      )}
      <span
        style={{
          fontSize: `10px`,
          textAlign: "center",
          lineHeight: "14px",
          paddingTop: "2px",
        }}
      >
        {children}
      </span>
      {secondaryIcon && (
        <SquareIcon
          icon={secondaryIcon}
          width={9}
          className="absolute"
          style={{ height: `24px`, bottom: "-3px", right: "-12px" }}
        />
      )}
    </div>
  );
};
