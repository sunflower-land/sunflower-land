import React, { useState } from "react";

import selectBox from "assets/ui/select/select_box.png";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";
import { FruitDropAnimator } from "components/animation/FruitDropAnimator";
import { setImageWidth } from "lib/images";
import { InfoPopover } from "../common/InfoPopover";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  playing: boolean;
  playAnimation: boolean;
  onClick: () => void;
  showOnClickInfo: boolean;
}

export const Soil: React.FC<Props> = ({
  playing,
  onClick,
  showOnClickInfo,
  playAnimation,
}) => {
  const [isMobile] = useIsMobile();
  const [showSelectBox, setShowSelectBox] = useState(false);

  return (
    <div
      className="absolute w-full h-full cursor-pointer"
      onMouseEnter={() => setShowSelectBox(!isMobile)}
      onMouseLeave={() => setShowSelectBox(false)}
      onClick={() => onClick()}
    >
      <FruitDropAnimator
        mainImageProps={{
          src: SUNNYSIDE.soil.soil2,
          className: "absolute pointer-events-none",
          style: {
            bottom: `${PIXEL_SCALE * 9}px`,
            left: `${PIXEL_SCALE * 8}px`,
            width: `${PIXEL_SCALE * 16}px`,
            height: `${PIXEL_SCALE * 26}px`,
          },
          onLoad: (e) => setImageWidth(e.currentTarget),
        }}
        dropImageProps={{
          src: SUNNYSIDE.resource.wood,
        }}
        dropCount={1}
        playDropAnimation={playAnimation}
        playShakeAnimation={false}
      />

      {/* Select box */}
      {playing && (
        <img
          src={selectBox}
          className={classNames("absolute z-40", {
            "opacity-100": showSelectBox,
            "opacity-0": !showSelectBox,
          })}
          style={{
            top: `${PIXEL_SCALE * 8}px`,
            left: `${PIXEL_SCALE * 8}px`,
            width: `${PIXEL_SCALE * 16}px`,
          }}
        />
      )}

      <InfoPopover
        showPopover={showOnClickInfo}
        position={{ top: 10, left: 22 }}
      >
        <div className="flex flex-1 items-center text-xxs justify-center text-white px-2 py-1 whitespace-nowrap">
          <img src={SUNNYSIDE.icons.cancel} className="w-4 mr-1" />
          <span>Fruit seeds only!</span>
        </div>
      </InfoPopover>
    </div>
  );
};
