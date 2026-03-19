import React, { useContext, useState } from "react";
import { Box } from "components/ui/Box";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import {
  ANIMATION_DISPLAY_CONFIG,
  getAnimationEndpointKey,
} from "features/game/constants/animations";
import {
  FarmHandAnimation,
  FARM_HAND_ANIMATIONS,
} from "features/game/types/farmhands";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { getAnimatedWebpUrl } from "features/world/lib/animations";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  id: string;
  animation: FarmHandAnimation;
  parts: Partial<BumpkinParts>;
}

export const FarmHandAnimationSelector: React.FC<Props> = ({
  id,
  animation,
  parts,
}) => {
  const { gameService } = useContext(Context);
  const [previewAnimation, setPreviewAnimation] =
    useState<FarmHandAnimation>(animation);

  const { previewContainerSize, previewImageWidth } =
    ANIMATION_DISPLAY_CONFIG[previewAnimation];
  const previewUrl = getAnimatedWebpUrl(parts, [
    getAnimationEndpointKey(previewAnimation),
  ]);

  const handleSelect = (option: FarmHandAnimation) => {
    setPreviewAnimation(option);
    gameService.send("farmHand.animationUpdated", {
      id,
      animation: option,
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative mb-2 overflow-hidden flex items-center justify-center"
        style={{
          width: `${PIXEL_SCALE * previewContainerSize}px`,
          height: `${PIXEL_SCALE * 40}px`,
          imageRendering: "pixelated",
        }}
      >
        <img
          src={previewUrl}
          style={{ width: `${PIXEL_SCALE * previewImageWidth}px` }}
          key={previewAnimation}
        />
      </div>
      <div className="flex gap-1">
        {FARM_HAND_ANIMATIONS.map((option) => (
          <div key={option} className="flex flex-col items-center">
            <Box
              hideCount
              image={
                previewAnimation === option
                  ? SUNNYSIDE.icons.confirm
                  : undefined
              }
              onClick={() => handleSelect(option)}
            />
            <span className="text-xxs capitalize">{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
