import React, { useContext, useRef, useState } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import bombardClick from "assets/sfts/tomato_bombard_click.png";
import bombardIdle from "assets/sfts/tomato_bombard_idle.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ZoomContext } from "components/ZoomProvider";

export const TomatoBombard: React.FC = () => {
  const { scale } = useContext(ZoomContext);
  const [showSpritesheet, setShowSpritesheet] = useState(false);
  const tomatofire = useRef<SpriteSheetInstance>();
  const tomatoidle = useRef<SpriteSheetInstance>();

  const boom = () => {
    const isPlaying = tomatofire.current?.getInfo("isPlaying");

    setShowSpritesheet(true);
    if (!isPlaying) {
      tomatofire.current?.goToAndPlay(0);
    }
  };

  return (
    <div
      className="relative w-full h-full cursor-pointer hover:img-highlight"
      onClick={boom}
    >
      {showSpritesheet && (
        <Spritesheet
          className="absolute group-hover:img-highlight pointer-events-none"
          style={{
            zIndex: 99999999,
            width: `${PIXEL_SCALE * 84}px`,
            bottom: 0,
            left: `${PIXEL_SCALE * -26}px`,
            imageRendering: "pixelated",
          }}
          getInstance={(spritesheet) => {
            tomatofire.current = spritesheet;
          }}
          image={bombardClick}
          widthFrame={84}
          heightFrame={87}
          zoomScale={scale}
          fps={12}
          endAt={32}
          steps={32}
          direction={`forward`}
          autoplay={true}
          loop={true}
          onLoopComplete={(spritesheet) => {
            spritesheet.pause();
            setShowSpritesheet(false);
          }}
        />
      )}
      {!showSpritesheet && (
        <Spritesheet
          className=" absolute group-hover:img-highlight pointer-events-none"
          style={{
            zIndex: 99999999,
            width: `${PIXEL_SCALE * 32}px`,
            bottom: 0,
            left: `${PIXEL_SCALE * 0}px`,
            imageRendering: "pixelated",
          }}
          getInstance={(spritesheet) => {
            tomatoidle.current = spritesheet;
          }}
          image={bombardIdle}
          widthFrame={32}
          heightFrame={32}
          zoomScale={scale}
          fps={7}
          endAt={26}
          steps={26}
          direction={`forward`}
          autoplay={false}
          loop={true}
        />
      )}
    </div>
  );
};
