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

export type LabelType =
  | "default"
  | "transparent"
  | "success"
  | "info"
  | "danger"
  | "warning"
  | "vibrant"
  | "formula"
  | "chill";

export const LABEL_STYLES: Record<
  LabelType,
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
    textColour: "#181425",
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
    textColour: "#3e2731",
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
  type: LabelType;
  style?: React.CSSProperties;
  icon?: string;
  iconWidth?: number;
  secondaryIcon?: string;
  onClick?: () => void;
}

export const Label: React.FC<Props> = ({
  children,
  className,
  type,
  style,
  icon,
  iconWidth,
  secondaryIcon,
  onClick,
}) => {
  return (
    <div
      key={type}
      onClick={onClick}
      className={classnames(
        className,
        `w-fit justify-center flex items-center text-xs`,
        {
          relative: !className?.includes("absolute"),
          "cursor-pointer": !!onClick,
        }
      )}
      style={{
        ...LABEL_STYLES[type].borderStyle,
        background: LABEL_STYLES[type].background,

        paddingLeft: icon ? "14px" : "3px",
        paddingRight: secondaryIcon ? "14px" : icon ? "4px" : "3px",
        color: LABEL_STYLES[type].textColour,
        ...style,

        // Normal font styles
        // textShadow:
        //   LABEL_STYLES[type].textColour === "#ffffff"
        //     ? "1px 1px #1f1f1f"
        //     : "none",
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
      <span
        className="text-xs pt-0 pb-0.5"
        style={{
          textAlign: "center",
          // Normal font styles

          // Pixel Font styles
          // paddingTop: "2px",
          // fontSize: `22px`,
          fontSize: "inherit",
        }}
      >
        {children}
      </span>
      {secondaryIcon && (
        <SquareIcon
          icon={secondaryIcon}
          width={9}
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            height: `24px`,
            right: "-12px",
          }}
        />
      )}
    </div>
  );
};
