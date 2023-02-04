import React from "react";
import classnames from "classnames";
import { pixelGrayBorderStyle } from "features/game/lib/style";

type labelType =
  | "pixelated"
  | "transparent"
  | "default"
  | "success"
  | "info"
  | "danger"
  | "warning";

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
      {type === "pixelated" && (
        <div
          className={classnames(
            "bg-silver-500 text-xxs object-contain justify-center items-center flex px-1",
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

      {type !== "pixelated" && (
        <span
          className={classnames(
            "text-xxs px-1.5 pb-1 pt-0.5 rounded-md",
            {
              "bg-green-600": type === "success",
              "bg-blue-600": type === "info",
              "bg-error": type === "danger",
              "bg-orange-400": type === "warning",
              "bg-silver-500": type === "default",
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
