import classNames from "classnames";
import { setImageWidth } from "lib/images";
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
  const { current } = useRef(randomInt(0, 2));
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setHideFruits(true);
    }, 1500);
  }, []);

  return (
    <div className={`${wrapperClassName} relative w-full h-full`}>
      <img
        {...mainImageProps}
        className={classNames(`${mainImageProps?.className}`, {
          "tree-shake-animation": playShakeAnimation,
        })}
      />
      {playDropAnimation && !hideFruits && (
        <div
          className={classNames(
            "absolute flex flex-col items-center justify-center fruit-wrapper pointer-events-none",
            {
              "drop-animation-left": current === 0,
              "drop-animation-right": current === 1,
            }
          )}
        >
          {dropCount && (
            <span
              ref={textRef}
              className="text-sm text-white p-1"
              style={{ opacity: 0 }}
            >{`+${dropCount}`}</span>
          )}
          <img
            {...dropImageProps}
            className={`img-highlight-extra-heavy ${dropImageProps.className}`}
            style={{ opacity: 0 }}
            onLoad={(e) => {
              setImageWidth(e.currentTarget);
              if (textRef.current) {
                textRef.current.style.opacity = "1";
              }
            }}
          />
        </div>
      )}
    </div>
  );
};
