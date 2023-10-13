import React from "react";
import classnames from "classnames";
import {
  pixelGrayBorderStyle,
  pixelOrangeBorderStyle,
  pixelRedBorderStyle,
  pixelVibrantBorderStyle,
} from "features/game/lib/style";

type labelType =
  | "default"
  | "transparent"
  | "success"
  | "info"
  | "danger"
  | "warning"
  | "happy"
  | "vibrant";

interface Props {
  className?: string;
  type?: labelType;
  style?: React.CSSProperties;
}
export const Label: React.FC<Props> = ({
  children,
  className,
  type,
  style,
}) => {
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
        type !== "happy" &&
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
