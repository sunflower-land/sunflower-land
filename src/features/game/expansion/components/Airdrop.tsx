import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import chest from "src/assets/decorations/treasure_chest.png";
import token from "src/assets/icons/token_2.png";
import alerted from "assets/icons/expression_alerted.png";
import { Context } from "features/game/GameProvider";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";

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
          <p className="text-center">
            {airdrop.message ?? "Congratulations, you found a reward!"}
          </p>

          <div className="flex flex-col pt-4">
            {!!airdrop.sfl && (
              <div className="flex items-center justify-center mb-2">
                <img src={token} className="w-6 mr-2" />
                <span>{airdrop.sfl} SFL</span>
              </div>
            )}

            {itemNames.length > 0 &&
              itemNames.map((name) => (
                <div
                  className="flex items-center justify-center mb-2"
                  key={name}
                >
                  <img src={ITEM_DETAILS[name].image} className="w-6 mr-2" />
                  <span>
                    {airdrop.items[name]} {name}
                  </span>
                </div>
              ))}
          </div>

          <Button onClick={claim} className="mt-2">
            Claim
          </Button>
        </Panel>
      </Modal>

      <div
        className="absolute w-full"
        style={{
          left: `${PIXEL_SCALE * 15}px`,
          top: `${PIXEL_SCALE * 16}px`,
        }}
      >
        <img
          src={chest}
          className="absolute cursor-pointer hover:img-highlight bulge-repeat"
          onClick={() => setShowModal(true)}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
        />
        <img
          src={alerted}
          className="absolute animate-float"
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
