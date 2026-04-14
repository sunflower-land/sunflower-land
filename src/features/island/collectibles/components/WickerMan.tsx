import React, { useContext, useEffect, useRef } from "react";

import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import wickerManFire from "assets/sfts/wicker_man_fire.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ZoomContext } from "components/ZoomProvider";
import { useSound } from "lib/utils/hooks/useSound";
import { SFTDetailPopoverContent } from "components/ui/SFTDetailPopover";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

const WickerManSpriteSheet = ({ open }: { open: boolean }) => {
  const { scale } = useContext(ZoomContext);
  const wickerManGif = useRef<SpriteSheetInstance>(undefined);

  const { play: burningSound, stop: stopBurningSound } = useSound("burning");

  const burn = () => {
    const isPlaying = wickerManGif.current?.getInfo("isPlaying");

    if (!isPlaying) {
      burningSound();
      wickerManGif.current?.goToAndPlay(0);
    }
  };

  useEffect(() => {
    if (open) {
      burn();
    }
  }, [open]);

  return (
    <Spritesheet
      className="absolute group-hover:img-highlight"
      style={{
        width: `${PIXEL_SCALE * 48}px`,
        bottom: 0,
        left: `${PIXEL_SCALE * -14}px`,
        imageRendering: "pixelated",
      }}
      getInstance={(spritesheet) => {
        wickerManGif.current = spritesheet;
      }}
      image={wickerManFire}
      widthFrame={48}
      heightFrame={58}
      zoomScale={scale}
      fps={12}
      endAt={32}
      steps={32}
      direction={`forward`}
      autoplay={false}
      loop={true}
      onLoopComplete={(spritesheet) => {
        spritesheet.pause();
        stopBurningSound();
      }}
    />
  );
};

export const WickerMan: React.FC = () => {
  return (
    <div className="relative w-full h-full cursor-pointer hover:img-highlight">
      <Popover>
        <PopoverButton as="div" className="cursor-pointer">
          {({ open }) => <WickerManSpriteSheet open={open} />}
        </PopoverButton>
        <PopoverPanel
          anchor={{ to: "left" }}
          className="flex pointer-events-none"
        >
          <SFTDetailPopoverContent name={"Wicker Man"} />
        </PopoverPanel>
      </Popover>
    </div>
  );
};
