import React, { useContext, useEffect, useState } from "react";

import npc from "assets/npcs/blacksmith.gif";
import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { WorkbenchModal } from "./components/WorkbenchModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { Modal } from "components/ui/Modal";
import { loadAudio, shopAudio } from "lib/utils/sfx";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { WORKBENCH_VARIANTS } from "features/island/lib/alternateArt";

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
  const [isOpen, setIsOpen] = useState(false);
  const showHelper = useSelector(gameService, needsHelp);

  useEffect(() => {
    loadAudio([shopAudio]);
  }, []);

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      // Add future on click actions here
      shopAudio.play();
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
        <img
          src={WORKBENCH_VARIANTS[island]}
          className="absolute bottom-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 47}px`,
          }}
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
          src={npc}
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
