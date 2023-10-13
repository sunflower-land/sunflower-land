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
        `w-fit justify-center inline-flex pl-1 pr-0.5 items-center uppercase relative`,
        className
      )}
      style={{
        ...LABEL_STYLES[type].borderStyle,
        background: LABEL_STYLES[type].background,
        fontFamily: "TinyFont",
        textShadow: "none",
        // textShadow: LABEL_STYLES[type].textColour ? "#ffffff" : "none",
        color: LABEL_STYLES[type].textColour,
        ...style,
      }}
    >
      {icon && (
        <img
          src={icon}
          className="absolute"
          style={{ height: `24px`, bottom: "-3px", left: "-12px" }}
        />
      )}
      <span
        style={{
          fontSize: `10px`,
          lineHeight: "14px",
          paddingTop: "2px",
          marginLeft: icon ? "14px" : 0,
          marginRight: secondaryIcon ? "14px" : 0,
        }}
      >
        {children}
      </span>
      {secondaryIcon && (
        <img
          src={secondaryIcon}
          className="absolute"
          style={{ height: `24px`, bottom: "-3px", right: "-12px" }}
        />
      )}
    </div>
  );

  return (
    <>
      {type === "default" && (
        <div
          className={classnames(
            "bg-silver-500 text-xxs object-contain justify-center inline-flex px-1 items-center",
            className
          )}
          style={{ ...pixelGrayBorderStyle, ...style }}
        >
          <span
            style={{
              lineHeight: "12px",
              height: "14px",
            }}
          >
            {children}
          </span>
        </div>
      )}

      {type === "warning" && (
        <div
          className={classnames(
            "bg-[#fdae34] text-xxs object-contain justify-center inline-flex px-1 items-center",
            className
          )}
          style={{ ...pixelOrangeBorderStyle, ...style }}
        >
          <span
            className="inline-flex items-center"
            style={{
              lineHeight: "12px",
              height: "auto",
              paddingBottom: "2px",
            }}
          >
            {children}
          </span>
        </div>
      )}

      {type === "vibrant" && (
        <div
          className={classnames(
            "bg-[#b65389] text-xxs object-contain justify-center inline-flex px-1 items-center",
            className
          )}
          style={{ ...pixelVibrantBorderStyle, ...style }}
        >
          <span
            className="inline-flex items-center"
            style={{
              lineHeight: "12px",
              height: "14px",
              paddingBottom: "2px",
            }}
          >
            {children}
          </span>
        </div>
      )}

      {type === "danger" && (
        <div
          className={classnames(
            "bg-[#e43b44] text-xxs object-contain justify-center inline-flex px-1 items-center",
            className
          )}
          style={{ ...pixelRedBorderStyle, ...style }}
        >
          <span
            className="inline-flex items-center"
            style={{
              lineHeight: "12px",
              height: "14px",
              paddingBottom: "2px",
            }}
          >
            {children}
          </span>
        </div>
      )}

      {type !== "default" &&
        type !== "vibrant" &&
        type !== "warning" &&
        type !== "danger" && (
          <span
            className={classnames(
              "text-xxs px-1.5 pb-1 pt-0.5 rounded-md inline-flex items-center",
              {
                "bg-green-600": type === "success",
                "bg-blue-600": type === "info",
                border: type !== "transparent",
              },
              className
            )}
            style={style}
          >
            {children}
          </span>
        )}
    </>
  );
};
