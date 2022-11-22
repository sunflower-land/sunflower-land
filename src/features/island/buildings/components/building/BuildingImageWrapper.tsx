import classNames from "classnames";
import React from "react";

interface Props {
  nonInteractible?: boolean;
  onClick: () => void;
}

export const BuildingImageWrapper: React.FC<Props> = ({
  nonInteractible,
  onClick,
  children,
}) => {
  return (
    <div
      className={classNames(
        "relative w-full h-full",
        nonInteractible ? "" : "cursor-pointer hover:img-highlight"
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
