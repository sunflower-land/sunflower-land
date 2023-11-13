import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import token from "src/assets/icons/token_2.png";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { Airdrop as IAirdrop } from "features/game/types/game";
import { ModalContext } from "features/game/components/modal/ModalProvider";

export const AirdropModal: React.FC<{
  airdrop: IAirdrop;
  onClose: () => void;
}> = ({ airdrop, onClose }) => {
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);

  const itemNames = getKeys(airdrop.items);

  const claim = () => {
    gameService.send("airdrop.claimed", {
      id: airdrop.id,
    });

    if (airdrop.id === "expansion-four-airdrop") {
      openModal("BETTY");
    }

    onClose();
  };

  return (
    <>
      <div className="flex flex-col pt-4">
        {!!airdrop.sfl && (
          <div className="flex items-center justify-center mb-2">
            <img src={token} className="w-6 mr-2" />
            <span>{airdrop.sfl} SFL</span>
          </div>
        )}

        {itemNames.length > 0 &&
          itemNames.map((name) => (
            <div className="flex items-center justify-center mb-2" key={name}>
              <img src={ITEM_DETAILS[name].image} className="w-6 mr-2" />
              <span>
                {airdrop.items[name]} {name}
              </span>
            </div>
          ))}

        {getKeys(airdrop.wearables ?? {}).length > 0 &&
          getKeys(airdrop.wearables).map((name) => (
            <div className="flex items-center justify-center mb-2" key={name}>
              <img src={getImageUrl(ITEM_IDS[name])} className="w-12 mr-2" />
              <span>
                {airdrop.wearables[name]} {name}
              </span>
            </div>
          ))}
      </div>

      <Button onClick={claim} className="mt-2">
        Claim
      </Button>
    </>
  );
};

interface Props {
  airdrop: IAirdrop;
}
export const Airdrop: React.FC<Props> = ({ airdrop }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          title={airdrop.message ?? "Congratulations, you found a reward!"}
          onClose={() => setShowModal(false)}
        >
          <AirdropModal airdrop={airdrop} onClose={() => setShowModal(false)} />
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
          className="absolute animate-float pointer-events-none"
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
export const AirdropPopup: React.FC = () => {
  const { gameService } = useContext(Context);
  const [state] = useActor(gameService);
  console.log({ state: state.value });

  const airdrop = state.context.state.airdrops?.find(
    (airdrop) => !airdrop.coordinates
  );

  if (!airdrop) {
    return null;
  }

  return (
    <AirdropModal
      airdrop={airdrop}
      onClose={() => {
        console.log("CLAIMED!");
        gameService.send("airdrop.claimed", { id: airdrop.id });
        console.log("CLOSE!");
        gameService.send("CLOSE");
      }}
    />
  );
};
