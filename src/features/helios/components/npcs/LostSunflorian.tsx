import React, { useState } from "react";

import sunflorian from "assets/npcs/lost_sunflorian.gif";
import shadow from "assets/npcs/shadow.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";

export const LostSunflorian: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <img
        src={sunflorian}
        onClick={() => setShowModal(true)}
        className="absolute z-20 cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 14}px`,
          top: `${GRID_WIDTH_PX * 11.5}px`,
          left: `${GRID_WIDTH_PX * 17.35}px`,
        }}
      />
      <img
        src={shadow}
        className="absolute z-10"
        style={{
          width: `${PIXEL_SCALE * 14}px`,
          top: `${GRID_WIDTH_PX * 12.3}px`,
          left: `${GRID_WIDTH_PX * 17.35}px`,
        }}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <div className="absolute w-48 -left-4 -top-32 -z-10">
          <DynamicNFT
            bumpkinParts={{
              body: "Light Brown Farmer Potion",
              hair: "Buzz Cut",
              pants: "Fancy Pants",
              shirt: "Fancy Top",
              tool: "Farmer Pitchfork",
              background: "Farm Background",
              shoes: "Black Farmer Boots",
            }}
          />
        </div>
        <Panel>
          <p className="mb-4">My father sent me here to rule over Helios.</p>
          <p className="mb-4">
            {`Unfortunately, these Bumpkins don't like me watching them.`}
          </p>
          <p>{`I can't wait to return to Sunfloria.`}</p>
        </Panel>
      </Modal>
    </>
  );
};
