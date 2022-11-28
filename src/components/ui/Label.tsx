import React from "react";
import classnames from "classnames";
import { pixelWhiteBorderStyle } from "features/game/lib/style";

interface Props {
  className?: string;
  type?: string;
}
export const Label: React.FC<Props> = ({ children, className, type }) => {
  return (
    <>
      {type === "default" && (
        <div
          className={classnames(
            "bg-silver-300 text-white text-xxs object-contain justify-center items-center flex px-1",
            className
          )}
          style={pixelWhiteBorderStyle}
        >
          <span
            className={classnames(" text-white text-xxs")}
            style={{
              lineHeight: "12px",
              height: "14px",
            }}
          >
            {children}
          </span>
        </div>
      )}

      {type === "success" && (
        <span
          className={classnames(
            "bg-green-600 border text-xxs px-2 py-1 rounded-md",
            className
          )}
        >
          {children}
        </span>
      )}
      {type === "info" && (
        <span
          className={classnames(
            "bg-blue-600 border text-xxs px-2 py-1 rounded-md",
            className
          )}
        >
          {children}
        </span>
      )}
      {type === "danger" && (
        <span
          className={classnames(
            "bg-error border text-xxs px-2 py-1 rounded-md",
            className
          )}
        >
          {children}
        </span>
      )}
    </>
  );
};
