import classNames from "classnames";
import React, { useEffect, useState } from "react";

interface Props {
  dropImageProps: React.ImgHTMLAttributes<HTMLImageElement>;
  wrapperClassName?: string;
  isBush: boolean;
  mainImageProps: React.ImgHTMLAttributes<HTMLImageElement>;
}

export const FruitDropAnimator = ({
  dropImageProps,
  wrapperClassName,
  isBush,
  mainImageProps,
}: Props) => {
  const [dropFruits, setDropFruits] = useState(false);
  const [hideFruits, setHideFruits] = useState(false);

  const getClassName = (number: number) => {
    return classNames(`absolute ${dropImageProps?.className} drop-transition`, {
      [`fruit-${number}`]: !dropFruits && !isBush,
      [`bush-fruit-${number}`]: !dropFruits && isBush,
      [`fruit-${number}-dropped`]: dropFruits && !isBush,
      [`bush-fruit-${number}-dropped`]: dropFruits && isBush,
      "opacity-0": hideFruits,
      "opacity-100": !hideFruits,
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setDropFruits(true);
    }, 620);
    setTimeout(() => {
      setHideFruits(true);
    }, 1350);
  }, []);

  return (
    <div className={`${wrapperClassName} relative tree-shake-animation`}>
      <img {...mainImageProps} className={`${mainImageProps?.className}`} />
      <img {...dropImageProps} className={getClassName(1)} />
      <img {...dropImageProps} className={getClassName(2)} />
      <img {...dropImageProps} className={getClassName(3)} />
      <img {...dropImageProps} className={getClassName(4)} />
    </div>
  );
};
