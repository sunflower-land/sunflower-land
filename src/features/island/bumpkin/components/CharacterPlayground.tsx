import React, { useContext, useState } from "react";
import patch from "assets/land/bumpkin_patch.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Airdrop } from "features/game/expansion/components/Airdrop";
import { LetterBox } from "features/farming/mail/LetterBox";
import { DynamicMiniNFT, DynamicMiniNFTProps } from "./DynamicMiniNFT";
import { FeedModal } from "./FeedModal";
import { ConsumableName } from "features/game/types/consumables";
import { Context } from "features/game/GameProvider";

export const CharacterPlayground: React.FC<DynamicMiniNFTProps> = ({
  body,
  hair,
  shirt,
  pants,
  hat,
  suit,
  onesie,
}) => {
  const { gameService } = useContext(Context);
  const [openFeedModal, setOpenFeedModal] = useState(false);

  const eatFood = (food: ConsumableName) => {
    gameService.send("bumpkin.feed", { food });
  };

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
        onClick={() => setOpenFeedModal(true)}
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
      <FeedModal
        isOpen={openFeedModal}
        onClose={() => setOpenFeedModal(false)}
        onFeed={(food) => eatFood(food)}
      />
    </>
  );
};
