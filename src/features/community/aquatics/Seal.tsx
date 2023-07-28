import React, { useContext, useRef } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";

import seal_sprite from "../assets/seal_sprite.png";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { ZoomContext } from "components/ZoomProvider";

export const Seal: React.FC = () => {
  const { scale } = useContext(ZoomContext);
  const sealGif = useRef<SpriteSheetInstance>();

  const swim = () => {
    console.log("swim");
    const isPlaying = sealGif.current?.getInfo("isPlaying");

    if (!isPlaying) {
      sealGif.current?.goToAndPlay(0);
    }
  };

  return (
    <MapPlacement x={3} y={-5} height={2} width={2}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={swim}
      >
        <Spritesheet
          className="relative group-hover:img-highlight pointer-events-none z-10"
          style={{
            imageRendering: "pixelated",
            width: `${PIXEL_SCALE * 32}px`,
          }}
          getInstance={(spritesheet) => {
            sealGif.current = spritesheet;
          }}
          image={seal_sprite}
          widthFrame={32}
          heightFrame={32}
          zoomScale={scale}
          fps={8}
          endAt={20}
          steps={20}
          direction={`forward`}
          autoplay={false}
          loop={true}
          onLoopComplete={(spritesheet) => {
            spritesheet.pause();
          }}
        />
      </div>
    </MapPlacement>
  );
};
