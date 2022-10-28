import React from "react";
import workbench from "assets/buildings/workbench.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { WorkbenchModal } from "./components/WorkbenchModal";

// TODO
import npc from "assets/npcs/cook.gif";
import shadow from "assets/npcs/shadow.png";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";

export const WorkBench: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <img
        src={workbench}
        draggable={false}
        style={{
          width: `${PIXEL_SCALE * 48}px`,
        }}
        className="cursor-pointer hover:img-highlight"
        onClick={handleClick}
      />
      <img
        src={npc}
        className="absolute z-20 pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 14}px`,
          top: `${PIXEL_SCALE * 14}px`,
          left: `${PIXEL_SCALE * 15}px`,
        }}
      />

      <img
        src={shadow}
        className="absolute z-10 pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          top: `${PIXEL_SCALE * 26}px`,
          left: `${PIXEL_SCALE * 15}px`,
        }}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <div className="absolute w-1/2 -left-2 top-[-60%] -z-10">
          <DynamicNFT
            bumpkinParts={{
              body: "Beige Farmer Potion",
              hair: "Buzz Cut",
              pants: "Farmer Pants",
              shirt: "Chef Apron",
              tool: "Farmer Pitchfork",
              background: "Farm Background",
              shoes: "Black Farmer Boots",
            }}
          />
        </div>
        <WorkbenchModal onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};
