import React from "react";
import classnames from "classnames";
import { pixelWhiteBorderStyle } from "features/game/lib/style";

type labelType =
  | "default"
  | "transparent"
  | "success"
  | "info"
  | "danger"
  | "warning";

interface Props {
  className?: string;
  type?: labelType;
}
export const Label: React.FC<Props> = ({ children, className, type }) => {
  return (
    <>
      {type === "default" && (
        <div
          className={classnames(
            "bg-silver-300 text-xxs object-contain justify-center items-center flex px-1",
            className
          )}
          style={pixelWhiteBorderStyle}
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

      {type !== "default" && (
        <span
          className={classnames(
            "text-xxs px-1.5 pb-1 pt-0.5 rounded-md",
            {
              "bg-green-600": type === "success",
              "bg-blue-600": type === "info",
              "bg-error": type === "danger",
              "bg-orange-400": type === "warning",
              border: type !== "transparent",
            },
            className
          )}
        >
          {children}
        </span>
      )}
    </>
  );
};
