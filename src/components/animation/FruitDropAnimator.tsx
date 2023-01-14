import classNames from "classnames";
import { randomInt } from "lib/utils/random";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  wrapperClassName?: string;
  mainImageProps: React.ImgHTMLAttributes<HTMLImageElement>;
  dropImageProps: React.ImgHTMLAttributes<HTMLImageElement>;
  dropCount?: number;
  playDropAnimation?: boolean;
  playShakeAnimation?: boolean;
}

export const FruitDropAnimator = ({
  wrapperClassName = "",
  mainImageProps,
  dropImageProps,
  dropCount,
  playDropAnimation = true,
  playShakeAnimation = true,
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
        className={classNames(`${mainImageProps?.className}`, {
          "tree-shake-animation": playShakeAnimation,
        })}
      />
      {playDropAnimation && !hideFruits && (
        <div
          className={classNames("absolute fruit-wrapper", {
            "drop-animation-left": current === 1,
            "drop-animation-right": current === 2,
          })}
        >
          {dropCount && (
            <span className="text-sm text-white absolute -top-6">{`+${dropCount}`}</span>
          )}
          <img
            {...dropImageProps}
            className={`w-5 relative img-highlight-extra-heavy ${dropImageProps.className}`}
          />
        </div>
      )}
    </div>
  );
};
