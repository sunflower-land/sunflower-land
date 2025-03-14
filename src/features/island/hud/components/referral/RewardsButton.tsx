import { RoundButton } from "components/ui/RoundButton";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React, { useState } from "react";
import giftIcon from "assets/icons/gift.png";
import { Rewards } from "./Rewards";
import { SUNNYSIDE } from "assets/sunnyside";

export const RewardsButton: React.FC = () => {
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  return (
    <div
      className="absolute"
      style={{ top: `${PIXEL_SCALE * 5}px`, left: `${PIXEL_SCALE * 32}px` }}
    >
      <RoundButton buttonSize={18} onClick={() => setShowRewardsModal(true)}>
        <img
          src={giftIcon}
          className="absolute group-active:translate-y-[2px]"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            left: `${PIXEL_SCALE * 4}px`,
            top: `${PIXEL_SCALE * 4}px`,
          }}
        />
        <img
          src={SUNNYSIDE.icons.expression_alerted}
          className="absolute animate-pulsate"
          style={{
            width: `${PIXEL_SCALE * 3}px`,
            right: `${PIXEL_SCALE * 0}px`,
          }}
        />
      </RoundButton>
      <Rewards
        show={showRewardsModal}
        onHide={() => setShowRewardsModal(false)}
      />
    </div>
  );
};
