import classNames from "classnames";
import Decimal from "decimal.js-light";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { setImageWidth } from "lib/images";
import { setPrecision } from "lib/utils/formatNumber";
import { randomInt } from "lib/utils/random";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  resourceName?: InventoryItemName;
  resourceAmount?: number;
}

export const ResourceDropAnimatorComponent: React.FC<Props> = ({
  resourceName,
  resourceAmount,
}: Props) => {
  const { current: direction } = useRef<"left" | "right">(
    randomInt(0, 2) === 0 ? "left" : "right",
  );
  const textRef = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(true);

  {
    /* Fade out resource image and count display after a certain time */
  }
  useEffect(() => {
    setTimeout(() => {
      setPlaying(false);
    }, 2000);
  }, []);

  return (
    <div className="absolute w-full h-full pointer-events-none">
      {!!resourceName && !!resourceAmount && resourceAmount > 0 && (
        <div
          className={classNames(
            "absolute flex flex-col items-center justify-center z-40",
            {
              "drop-animation-left": direction === "left",
              "drop-animation-right": direction === "right",
            },
          )}
          style={{
            transition: "opacity 0.2s ease-in",
            opacity: playing ? 1 : 0,
            top: "10%",
          }}
        >
          {/* Resource count display */}
          <span
            ref={textRef}
            className="yield-text text-white font-pixel"
            style={{ opacity: 0 }}
          >{`+${setPrecision(new Decimal(resourceAmount))}`}</span>

          {/* Resource image */}
          <img
            src={ITEM_DETAILS[resourceName].image}
            className={`img-highlight-heavy`}
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

export const ResourceDropAnimator = React.memo(ResourceDropAnimatorComponent);
