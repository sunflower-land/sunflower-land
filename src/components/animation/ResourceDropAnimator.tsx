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

export const ResourceDropAnimator = ({
  wrapperClassName,
  mainImageProps,
  dropImageProps,
  dropCount,
  playDropAnimation = true,
  playShakeAnimation = true,
}: Props) => {
  const [hideItem, setHideItems] = useState(false);
  const { current } = useRef(randomInt(1, 3));

  useEffect(() => {
    setTimeout(() => {
      setHideItems(true);
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
      {playDropAnimation && (
        <div
          className={classNames("absolute item-wrapper", {
            "opacity-0": hideItem,
            "drop-animation-left": current === 1,
            "drop-animation-right": current === 2,
          })}
        >
          {dropCount && (
            <span className="text-sm text-white absolute -top-6">{`+${dropCount}`}</span>
          )}
          <img
            {...dropImageProps}
            className={`w-5 relative img-highlight ${dropImageProps.className}`}
          />
          <img
            {...dropImageProps}
            className={`w-5 absolute top-2 left-2 img-highlight ${dropImageProps.className}`}
          />
          <img
            {...dropImageProps}
            className={`w-5 absolute top-3 -left-2 img-highlight ${dropImageProps.className}`}
          />
        </div>
      )}
    </div>
  );
};
