import React from "react";

interface Props {
  style?: React.CSSProperties;
  alt?: string;
  image?: any;
}

export const ImageStyle: React.FC<Props> = ({ style, image, alt }) => {
  return (
    <>
      <img src={image} style={style} className="absolute" alt={alt} />
    </>
  );
};
