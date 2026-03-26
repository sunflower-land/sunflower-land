import React, { useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { AgingShedModal } from "./AgingShedModal";
import { SUNNYSIDE } from "assets/sunnyside";

export const AgingShed: React.FC<BuildingProps> = ({ buildingId, isBuilt }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (!isBuilt) return;
    setShowModal(true);
  };

  return (
    <>
      <BuildingImageWrapper name="Aging Shed" onClick={handleClick}>
        <img
          src={SUNNYSIDE.icons.expression_confused}
          className="absolute bottom-0 pointer-events-none"
          style={{ width: `${PIXEL_SCALE * 48}px` }}
        />
      </BuildingImageWrapper>

      <AgingShedModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
