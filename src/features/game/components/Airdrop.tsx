import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import chest from "src/assets/icons/chest.png";
import token from "src/assets/icons/token.png";

import { Context } from "../GameProvider";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "../lib/constants";
import { ToastContext } from "../toast/ToastQueueProvider";
import { getKeys } from "../types/craftables";
import { ITEM_DETAILS } from "../types/images";

export const Airdrop: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { setToast } = useContext(ToastContext);

  const [showModal, setShowModal] = useState(false);

  // Just show the latest airdrop
  const airdrop = gameState.context.state.airdrops?.[0];

  if (!airdrop) {
    return null;
  }

  const itemNames = getKeys(airdrop.items);

  const claim = () => {
    gameService.send("airdrop.claimed", {
      id: airdrop.id,
    });

    itemNames.forEach((name) => {
      setToast({
        icon: ITEM_DETAILS[name].image,
        content: `+${airdrop.items[name]?.toString()}`,
      });
    });

    if (airdrop.sfl) {
      setToast({
        icon: token,
        content: `+${airdrop.sfl.toString()}`,
      });
    }

    setShowModal(false);
  };

  return (
    <>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Panel>
          <span className="mb-2">Congratulations, you found a reward!</span>

          {airdrop.sfl && (
            <div className="flex justify-end items-center mb-1">
              <img src={token} className="w-6 mr-2" />
              <span>{airdrop.sfl}</span>
            </div>
          )}

          {itemNames.length > 0 &&
            itemNames.map((name) => (
              <div className="flex justify-end items-center mb-1" key={name}>
                <img src={ITEM_DETAILS[name].image} className="w-6 mr-2" />
                <span>{airdrop.items[name]}</span>
              </div>
            ))}

          <Button onClick={claim} className="mt-2">
            Claim
          </Button>
        </Panel>
      </Modal>

      <img
        src={chest}
        className="absolute cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          left: `${GRID_WIDTH_PX * 59}px`,
          top: `${GRID_WIDTH_PX * 36}px`,
        }}
      />
    </>
  );
};
