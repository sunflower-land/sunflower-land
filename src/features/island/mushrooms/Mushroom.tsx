import React, { useContext, useEffect, useRef, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { ZoomContext } from "components/ZoomProvider";
import { MushroomName } from "features/game/types/resources";
import { useSound } from "lib/utils/hooks/useSound";

const FIFTEEN_SECONDS = 15000;
const getDelay = () => Math.random() * FIFTEEN_SECONDS;

interface Props {
  id: string;
  isFirstRender: boolean;
  name: MushroomName;
}

const MUSHROOM_STYLES: Record<
  MushroomName,
  {
    image: string;
  }
> = {
  "Wild Mushroom": {
    image: SUNNYSIDE.resource.wild_mushroom_sheet,
  },
  "Magic Mushroom": {
    image: SUNNYSIDE.resource.magic_mushroom_sheet,
  },
};

export const Mushroom: React.FC<Props> = ({ id, isFirstRender, name }) => {
  const { scale } = useContext(ZoomContext);
  const { gameService } = useContext(Context);
  const [grow, setGrow] = useState(false);

  const mushroomGif = useRef<SpriteSheetInstance>();

  const mushrooms = ["mushroom_1", "mushroom_2", "mushroom_3"] as const;
  const mushroomSound = useSound(
    mushrooms[Math.floor(Math.random() * mushrooms.length)],
  );

  const { image } = MUSHROOM_STYLES[name];

  const pickMushroom = () => {
    mushroomSound.play();
    gameService.send("mushroom.picked", { id });
  };

  useEffect(() => {
    setGrow(!isFirstRender);
  }, []);

  return (
    <>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight flex items-center justify-center"
        onClick={() => pickMushroom()}
      >
        <div className={grow ? "mushroom" : ""}>
          <Spritesheet
            className="relative group-hover:img-highlight pointer-events-none z-10"
            style={{
              imageRendering: "pixelated",
              width: `${PIXEL_SCALE * 10}px`,
            }}
            getInstance={(spritesheet) => {
              mushroomGif.current = spritesheet;
            }}
            image={image}
            widthFrame={10}
            heightFrame={12}
            zoomScale={scale}
            fps={10}
            timeout={getDelay()}
            endAt={5}
            steps={5}
            direction={`forward`}
            autoplay={true}
            loop={true}
            onLoopComplete={(spritesheet) => {
              spritesheet.pause();
              setTimeout(() => spritesheet.play(), getDelay());
            }}
          />
        </div>
      </div>
    </>
  );
};
