import React, { useState } from "react";

import soil from "assets/land/soil2.png";
import wood from "assets/resources/wood.png";
import selectBox from "assets/ui/select/select_box.png";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";
import { FruitDropAnimator } from "components/animation/FruitDropAnimator";
import { setImageWidth } from "lib/images";

interface Props {
  playing: boolean;
  playAnimation: boolean;
  onClick: () => void;
}

export const Soil: React.FC<Props> = ({ playing, onClick, playAnimation }) => {
  const [isMobile] = useIsMobile();
  const [showSelectBox, setShowSelectBox] = useState(false);

  return (
    <div
      className="flex justify-center"
      onMouseEnter={() => setShowSelectBox(!isMobile)}
      onMouseLeave={() => setShowSelectBox(false)}
    >
      <FruitDropAnimator
        mainImageProps={{
          src: soil,
          className: "relative",
          style: {
            bottom: "9px",
            zIndex: "1",
            width: `${PIXEL_SCALE * 16}px`,
            height: `${PIXEL_SCALE * 26}px`,
          },
          onLoad: (e) => setImageWidth(e.currentTarget),
        }}
        dropImageProps={{
          src: wood,
          className: "w-8",
        }}
        dropCount={1}
        playDropAnimation={playAnimation}
        playShakeAnimation={false}
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
