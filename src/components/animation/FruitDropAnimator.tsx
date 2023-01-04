import classNames from "classnames";
import { randomInt } from "lib/utils/random";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  wrapperClassName?: string;
  mainImageProps: React.ImgHTMLAttributes<HTMLImageElement>;
  dropImageProps: React.ImgHTMLAttributes<HTMLImageElement>;
  dropCount?: number;
}

export const FruitDropAnimator = ({
  wrapperClassName,
  mainImageProps,
  dropImageProps,
  dropCount,
}: Props) => {
  const [hideFruits, setHideFruits] = useState(false);
  const { current } = useRef(randomInt(1, 3));

  useEffect(() => {
    setTimeout(() => {
      setHideFruits(true);
    }, 1500);
  }, []);

  return (
    <div className={`${wrapperClassName} relative`}>
      <img
        {...mainImageProps}
        className={`${mainImageProps?.className} tree-shake-animation`}
      />
      <div
        className={classNames("absolute fruit-wrapper", {
          "opacity-0": hideFruits,
          "drop-animation-left": current === 1,
          "drop-animation-right": current === 2,
        })}
      >
        {dropCount && (
          <span className="text-sm text-white absolute -top-6">{`+${dropCount}`}</span>
        )}
        <img {...dropImageProps} className={`w-5 relative img-highlight`} />
        <img
          {...dropImageProps}
          className={`w-5 absolute top-2 left-2 img-highlight`}
        />
        <img
          {...dropImageProps}
          className={`w-5 absolute top-3 -left-2 img-highlight`}
        />
      </div>
    </div>
  );
};
