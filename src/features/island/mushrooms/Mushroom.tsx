import classNames from "classnames";
import React, { useContext, useRef } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { ZoomContext } from "components/ZoomProvider";
import { MushroomName } from "features/game/types/resources";
import { useSound } from "lib/utils/hooks/useSound";
import { useMathRandom } from "lib/utils/hooks/useMathRandom";

const FIFTEEN_SECONDS = 15000;
const getDelay = () => Math.random() * FIFTEEN_SECONDS;

interface Props {
  id: string;
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

export const Mushroom: React.FC<Props> = ({ id, name }) => {
  const { scale } = useContext(ZoomContext);
  const { gameService } = useContext(Context);
  const randomNumber = useMathRandom();

  const mushroomGif = useRef<SpriteSheetInstance>(undefined);

  const mushrooms = ["mushroom_1", "mushroom_2", "mushroom_3"] as const;
  const mushroomSound = useSound(
    mushrooms[Math.floor(randomNumber * mushrooms.length)],
  );

  const { image } = MUSHROOM_STYLES[name];

  const pickMushroom = () => {
    mushroomSound.play();
    gameService.send({ type: "mushroom.picked", id });
  };

  return (
    <div
      className={classNames(
        "relative w-full h-full cursor-pointer hover:img-highlight flex items-center justify-center mushroom",
      )}
      onClick={pickMushroom}
    >
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
  );
};
