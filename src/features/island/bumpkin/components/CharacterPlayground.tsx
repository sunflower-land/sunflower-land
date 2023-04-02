import React, { useContext, useEffect, useState } from "react";
import patch from "assets/land/bumpkin_patch.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Airdrop } from "features/game/expansion/components/Airdrop";
import { LetterBox } from "features/farming/mail/LetterBox";
import { DynamicMiniNFT, DynamicMiniNFTProps } from "./DynamicMiniNFT";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { isEventType } from "features/game/events";
import { CollectRecipeAction } from "features/game/events/landExpansion/collectRecipe";
import { SUNNYSIDE } from "assets/sunnyside";

export const CharacterPlayground: React.FC<DynamicMiniNFTProps> = ({
  body,
  hair,
  shirt,
  pants,
  hat,
  suit,
  onesie,
  wings,
  dress,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showHeart, setShowHeart] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    gameService.onEvent((event) => {
      if (event.type === "recipe.collected") {
        setShowHeart(true);
        timeout = setTimeout(() => setShowHeart(false), 3000);
      }
    });

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return (
    <>
      <img
        src={patch}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 32}px`,
          top: 0,
          left: 0,
        }}
      />
      <img
        src={SUNNYSIDE.icons.heart}
        className="absolute animate-pulsate transition-opacity"
        style={{
          width: `${PIXEL_SCALE * 10}px`,
          top: `${PIXEL_SCALE * -6}px`,
          left: `${PIXEL_SCALE * 4}px`,
          opacity: showHeart ? 100 : 0,
        }}
      />

      <DynamicMiniNFT
        body={body}
        hair={hair}
        shirt={shirt}
        pants={pants}
        hat={hat}
        suit={suit}
        onesie={onesie}
        wings={wings}
        dress={dress}
      />
      <div
        className="absolute"
        style={{
          top: 0,
          left: `${PIXEL_SCALE * 16}px`,
        }}
      >
        <LetterBox />
      </div>
      <div
        className="absolute"
        style={{
          top: `${PIXEL_SCALE * 16}px`,
          left: `${PIXEL_SCALE * 16}px`,
        }}
      >
        <Airdrop />
      </div>
    </>
  );
};
