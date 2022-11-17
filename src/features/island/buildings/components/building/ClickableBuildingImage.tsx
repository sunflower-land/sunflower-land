import React, { SyntheticEvent } from "react";

interface Props {
  onClick: (e: SyntheticEvent) => void;
  // Any other props
  [x: string]: any;
}

/**
 *
 * This component is a React wrapper for clickable building images. We have this wrapper so we can stop
 * propagation on the onClick event because there is a second listener one level up which handles removing a building.
 */
export const ClickableBuildingImage: React.FC<Props> = ({
  onClick,
  children,
  ...props
}) => {
  return (
    <div onClick={onClick} {...props}>
      {children}
    </div>
  );
};
