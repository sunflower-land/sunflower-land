import React, { SyntheticEvent } from "react";

interface Props {
  src: string;
  onClick: (e: SyntheticEvent) => void;
  className?: string;
  style?: React.CSSProperties;
  // Any other props
  [x: string]: any;
}

/**
 *
 * This component is a React wrapper for clickable building images. We have this wrapper so we can stop
 * propagation on the onClick event because there is a second listener one level up which handles removing a building.
 */
export const ClickableBuildingImage = ({
  src,
  onClick,
  style,
  className,
  ...props
}: Props) => {
  return (
    <img
      src={src}
      style={style}
      className={className}
      onClick={onClick}
      {...props}
    />
  );
};
