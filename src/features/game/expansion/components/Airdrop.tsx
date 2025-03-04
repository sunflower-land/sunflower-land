import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";

import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Airdrop as IAirdrop } from "features/game/types/game";
import { ClaimReward } from "./ClaimReward";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";

export const AirdropModal: React.FC<{
  airdrop: IAirdrop;
  onClose?: () => void;
  onClaimed: () => void;
}> = ({ airdrop, onClose, onClaimed }) => {
  const { gameService } = useContext(Context);

  const claim = () => {
    gameService.send("airdrop.claimed", {
      id: airdrop.id,
    });

    onClaimed();
  };

  return <ClaimReward reward={airdrop} onClaim={claim} onClose={onClose} />;
};

interface Props {
  airdrop: IAirdrop;
}
export const Airdrop: React.FC<Props> = ({ airdrop }) => {
  const { showAnimations } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel onClose={() => setShowModal(false)}>
          <AirdropModal
            airdrop={airdrop}
            onClaimed={() => setShowModal(false)}
          />
        </CloseButtonPanel>
      </Modal>

      <div
        className="absolute left-0 top-0 cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          height: `${PIXEL_SCALE * 16}px`,
        }}
      >
        <img
          src={SUNNYSIDE.decorations.treasure_chest}
          className="absolute bulge-repeat pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
        />
        <img
          src={SUNNYSIDE.icons.expression_alerted}
          className={
            "absolute pointer-events-none" +
            (showAnimations ? " animate-float" : "")
          }
          style={{
            left: `${PIXEL_SCALE * 6}px`,
            top: `${PIXEL_SCALE * -12}px`,
            width: `${PIXEL_SCALE * 4}px`,
          }}
        />
      </div>
    </>
  );
};

/**
 * Display airdrops that have no coordinates
 */
const _airdrops = (state: MachineState) => state.context.state.airdrops;

export const AirdropPopup: React.FC = () => {
  const { gameService } = useContext(Context);
  const airdrops = useSelector(gameService, _airdrops);

  const airdrop = airdrops?.find((airdrop) => !airdrop.coordinates);

  if (!airdrop) {
    return null;
  }

  return (
    <AirdropModal
      airdrop={airdrop}
      onClaimed={() => {
        gameService.send("CLOSE");
      }}
      onClose={() => {
        gameService.send("CLOSE");
      }}
    />
  );
};
