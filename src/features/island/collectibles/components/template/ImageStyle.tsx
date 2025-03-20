import { CollectibleName } from "features/game/types/craftables";
import React from "react";

interface Props {
  imgStyle?: React.CSSProperties;
  divStyle?: React.CSSProperties;
  alt?: CollectibleName;
  image?: string;
}

export const ImageStyle: React.FC<Props> = ({
  imgStyle,
  image,
  divStyle,
  alt,
}) => {
  return (
    <div className="absolute pointer-events-none" style={divStyle}>
      <img src={image} style={imgStyle} alt={alt} />
    </div>
  );
};
