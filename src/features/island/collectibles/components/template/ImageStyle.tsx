import { SFTDetailPopover } from "components/ui/SFTDetailPopover";
import { CollectibleName } from "features/game/types/craftables";
import React from "react";

interface Props {
  name: CollectibleName;
  imgStyle?: React.CSSProperties;
  divStyle?: React.CSSProperties;
  alt?: CollectibleName;
  image?: string;
}

export const ImageStyle: React.FC<Props> = ({
  name,
  imgStyle,
  image,
  divStyle,
  alt,
}) => {
  return (
    <SFTDetailPopover name={name}>
      <div className="absolute" style={divStyle}>
        <img src={image} style={imgStyle} alt={alt} />
      </div>
    </SFTDetailPopover>
  );
};
