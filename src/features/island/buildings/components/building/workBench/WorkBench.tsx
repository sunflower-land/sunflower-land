import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { WorkbenchModal } from "./components/WorkbenchModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { WORKBENCH_VARIANTS } from "features/island/lib/alternateArt";
import shadow from "assets/npcs/shadow.png";
import { useSound } from "lib/utils/hooks/useSound";
import { FarmSprite } from "features/game/expansion/FarmSprite";
const needsHelp = (state: MachineState) => {
  const missingScarecrow =
    !state.context.state.inventory["Basic Scarecrow"] &&
    (state.context.state.bumpkin?.activity?.["Sunflower Planted"] ?? 0) >= 6 &&
    !state.context.state.inventory["Sunflower Seed"]?.gt(0);

  if (missingScarecrow) {
    return true;
  }

  return false;
};

export const WorkBench: React.FC<BuildingProps> = ({
  isBuilt,
  onRemove,
  island,
}) => {
  const { gameService } = useContext(Context);
  // TODO: feat/crafting-box - remove this
  const [isOpen, setIsOpen] = useState(false);
  const showHelper = useSelector(gameService, needsHelp);

  const { play: shopAudio } = useSound("shop");

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      // Add future on click actions here
      shopAudio();
      setIsOpen(true);
      return;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <BuildingImageWrapper name="Workbench" onClick={handleClick}>
        <FarmSprite
          image={WORKBENCH_VARIANTS[island]}
          width={PIXEL_SCALE * 47}
          bottom={0}
        />

        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 14}px`,
            right: `${PIXEL_SCALE * 11}px`,
          }}
        />
        <img
          src={SUNNYSIDE.npcs.blacksmith_npc}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 16}px`,
            right: `${PIXEL_SCALE * 12}px`,
          }}
        />

        {showHelper && (
          <img
            className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
            src={SUNNYSIDE.icons.click_icon}
            style={{
              width: `${PIXEL_SCALE * 18}px`,
              right: `${PIXEL_SCALE * -8}px`,
              top: `${PIXEL_SCALE * 20}px`,
            }}
          />
        )}
      </BuildingImageWrapper>
      <Modal show={isOpen} onHide={handleClose}>
        <WorkbenchModal onClose={handleClose} />
      </Modal>
    </>
  );
};
