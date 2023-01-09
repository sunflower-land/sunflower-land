import React, { useState } from "react";

import soil from "assets/land/soil2.png";
import cancel from "assets/icons/cancel.png";
import selectBox from "assets/ui/select/select_box.png";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";
import { InfoPopover } from "../common/InfoPopover";

interface Props {
  playing: boolean;
  onClick: () => void;
  showOnClickInfo: boolean;
}

export const Soil: React.FC<Props> = ({
  playing,
  onClick,
  showOnClickInfo,
}) => {
  const [isMobile] = useIsMobile();
  const [showSelectBox, setShowSelectBox] = useState(false);

  return (
    <div
      className="flex justify-center"
      onMouseEnter={() => setShowSelectBox(!isMobile)}
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

      <InfoPopover
        showPopover={showOnClickInfo}
        position={{ top: 10, left: 22 }}
      >
        <div className="flex flex-1 items-center text-xxs justify-center text-white px-2 py-1 whitespace-nowrap">
          <img src={cancel} className="w-4 mr-1" />
          <span>Fruit seeds only!</span>
        </div>
      </InfoPopover>
    </div>
  );
};
