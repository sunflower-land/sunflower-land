import React, { useEffect, useRef, useState } from "react";

import selectBox from "assets/ui/select/select_box.png";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import classNames from "classnames";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

interface Props {
  position: Coordinates;
}
export const SelectBox: React.FC<Props> = ({ position }) => {
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
      src={selectBox}
      className={classNames(
        `w-full absolute inset-0 transition-transform duration-200 z-10 scale-100 `,
        {
          ["opacity-0 scale-110"]: isHidden,
          ["opacity-1 scale-120"]: !isHidden,
        }
      )}
      style={{
        top: `${position?.y - 20}px`,
        left: `${position?.x - 20}px`,
        height: `${GRID_WIDTH_PX * 1}px`,
        width: `${GRID_WIDTH_PX * 1}px`,
      }}
    />
  );
};
