import React from "react";

interface Props {
  imgStyle?: React.CSSProperties;
  divStyle?: React.CSSProperties;
  alt?: string;
  image?: any;
}

export const ImageStyle: React.FC<Props> = ({
  imgStyle,
  image,
  divStyle,
  alt,
}) => {
  return (
    <div className="absolute" style={divStyle}>
      <img src={image} style={imgStyle} alt={alt} />
    </div>
  );
};
