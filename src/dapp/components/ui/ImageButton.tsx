import "./ImageButton.css";

import React from "react";

export interface ImageButtonProps {
  src: string;
  onClick?: () => void;
}

/**
 * A button that is an image (icon) with a click handler. Fades out on hover.
 */
export const ImageButton: React.FC<ImageButtonProps> = ({
  src,
  onClick,
}) => {
  return <img className="image-button" src={src} onClick={onClick} />;
};
