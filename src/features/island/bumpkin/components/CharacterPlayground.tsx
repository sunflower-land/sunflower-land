import React from "react";
import patch from "assets/land/bumpkin_patch.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Airdrop } from "features/game/expansion/components/Airdrop";
import { LetterBox } from "features/farming/mail/LetterBox";
import { DynamicMiniNFT, DynamicMiniNFTProps } from "./DynamicMiniNFT";

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
