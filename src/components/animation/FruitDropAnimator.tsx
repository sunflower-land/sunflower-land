import React, { useEffect, useState } from "react";

interface Props {
  dropImageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  wrapperClassName?: string;
  mainImageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
  mainImageStyles?: Record<any, string | number>;
}

export const FruitDropAnimator = ({
  dropImageProps,
  wrapperClassName,
  mainImageProps,
}: Props) => {
  const [dropFruits, setDropFruits] = useState(false);
  const [hideFruits, setHideFruits] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setDropFruits(true);
    }, 620);
    setTimeout(() => {
      setHideFruits(true);
    }, 1350);
  }, []);

  return (
    <div className={`${wrapperClassName} relative`}>
      <img
        {...mainImageProps}
        className={`${mainImageProps?.className} tree-shake-animation`}
      />
      <img
        {...dropImageProps}
        className={`absolute ${dropImageProps?.className} drop-transition ${
          dropFruits ? "fruit-one-dropped" : "fruit-one"
        } ${hideFruits ? "opacity-0" : "opacity-100"}`}
      />
      <img
        {...dropImageProps}
        className={`absolute ${dropImageProps?.className} drop-transition ${
          dropFruits ? "fruit-two-dropped" : "fruit-two"
        } ${hideFruits ? "opacity-0" : "opacity-100"}`}
      />
      <img
        {...dropImageProps}
        className={`absolute ${dropImageProps?.className} drop-transition ${
          dropFruits ? "fruit-three-dropped" : "fruit-three"
        } ${hideFruits ? "opacity-0" : "opacity-100"}`}
      />
      <img
        {...dropImageProps}
        className={`absolute ${dropImageProps?.className} drop-transition ${
          dropFruits ? "fruit-four-dropped" : "fruit-four"
        } ${hideFruits ? "opacity-0" : "opacity-100"}`}
      />
    </div>
  );
};
