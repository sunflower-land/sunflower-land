import React, { useEffect, useRef, useState } from "react";

import { Coordinates } from "features/game/expansion/components/MapPlacement";
import classNames from "classnames";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  position?: Coordinates;
}
export const RestrictedHelper: React.FC<Props> = ({
  position = { x: 0, y: 0 },
}) => {
  const [isHidden, setIsHidden] = useState(true);
  const lastPosition = useRef(position);

  useEffect(() => {
    if (lastPosition.current !== position) {
      setIsHidden(false);

      setTimeout(() => setIsHidden(true), 300);
    }
  }, [position]);

  return (
    <img
      src={SUNNYSIDE.icons.cancel}
      className={classNames(
        `w-full absolute inset-0 transition-transform duration-200 z-10 scale-100 `,
        {
          ["opacity-0 scale-110"]: isHidden,
          ["opacity-1 scale-120"]: !isHidden,
        }
      )}
      style={{
        top: `${position?.y - 10}px`,
        left: `${position?.x - 10}px`,
        height: `${GRID_WIDTH_PX * 0.5}px`,
        width: `${GRID_WIDTH_PX * 0.5}px`,
      }}
    />
  );
};
