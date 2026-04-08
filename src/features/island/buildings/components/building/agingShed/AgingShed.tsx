import React, { useContext, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { AgingShedModal } from "./AgingShedModal";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { AGING_SHED_VARIANTS } from "features/island/lib/alternateArt";

export const AgingShed: React.FC<BuildingProps> = ({ isBuilt }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (!isBuilt) return;
    setShowModal(true);
  };
  const { gameService } = useContext(Context);

  const agingShedLevel = useSelector(
    gameService,
    (state) => state.context.state.agingShed.level,
  );

  const agingShedVariant =
    AGING_SHED_VARIANTS[agingShedLevel > 3 ? 3 : agingShedLevel];

  return (
    <>
      <BuildingImageWrapper name="Aging Shed" onClick={handleClick}>
        <img
          src={agingShedVariant}
          className="absolute bottom-0 pointer-events-none"
          style={{ width: `${PIXEL_SCALE * 50}px` }}
        />
      </BuildingImageWrapper>

      <AgingShedModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
