import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import { FeederMachineModal } from "./FeederMachineModal";

export const FeederMachine: React.FC = () => {
  const { t } = useAppTranslation();
  const [showFeederMachineModal, setFeederMachineModal] = useState(false);
  const feederMachineImage = SUNNYSIDE.building.feederMachine;

  return (
    <>
      <div
        className="relative cursor-pointer hover:img-highlight"
        onClick={() => setFeederMachineModal(true)}
      >
        <img
          src={SUNNYSIDE.animalFoods.grinder}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
          }}
          // Hover parent
          className="absolute top-0 -right-4 z-20"
        />
        <img
          src={feederMachineImage}
          className="relative z-0"
          style={{
            width: `${30 * PIXEL_SCALE}px`,
          }}
        />
      </div>

      <FeederMachineModal
        show={showFeederMachineModal}
        onClose={() => setFeederMachineModal(false)}
      />
    </>
  );
};
