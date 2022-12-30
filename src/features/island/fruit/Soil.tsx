import React, { useState } from "react";

import soil from "assets/land/soil2.png";
import selectBox from "assets/ui/select/select_box.png";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  playing: boolean;
  onClick: () => void;
}

export const Soil: React.FC<Props> = ({ playing, onClick }) => {
  const [showSelectBox, setShowSelectBox] = useState(false);

  return (
    <div
      className="flex justify-center"
      onMouseEnter={() => setShowSelectBox(true)}
      onMouseLeave={() => setShowSelectBox(false)}
    >
      <img
        className="relative"
        style={{
          bottom: "9px",
          zIndex: "1",
          width: `${PIXEL_SCALE * 16}px`,
          height: `${PIXEL_SCALE * 26}px`,
        }}
        src={soil}
      />
      {playing && (
        <img
          src={selectBox}
          className={classNames("absolute z-40 cursor-pointer", {
            "opacity-100": showSelectBox,
            "opacity-0": !showSelectBox,
          })}
          style={{
            top: "21px",
            width: `${PIXEL_SCALE * 16}px`,
          }}
          onClick={() => onClick()}
        />
      )}
    </div>
  );
};
