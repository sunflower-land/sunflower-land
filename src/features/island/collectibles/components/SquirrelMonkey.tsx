import React, { useContext } from "react";

import sheet from "assets/sfts/squirrel_monkey_sheet.png";
import shadow from "assets/npcs/shadow.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import Spritesheet from "components/animation/SpriteAnimator";
import { ZoomContext } from "components/ZoomProvider";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const SquirrelMonkey: React.FC = () => {
  const { scale } = useContext(ZoomContext);
  return (
    <SFTDetailPopover name="Squirrel Monkey">
      <>
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 5}px`,
            left: `${PIXEL_SCALE * 7}px`,
          }}
          className="absolute pointer-events-none"
        />
        <Spritesheet
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 26}px`,
            bottom: 0,
            left: `${PIXEL_SCALE * 4}px`,
            imageRendering: "pixelated",
          }}
          image={sheet}
          widthFrame={26}
          heightFrame={32}
          zoomScale={scale}
          fps={12}
          steps={9}
          direction="forward"
          autoplay={true}
          loop={true}
        />
      </>
    </SFTDetailPopover>
  );
};
