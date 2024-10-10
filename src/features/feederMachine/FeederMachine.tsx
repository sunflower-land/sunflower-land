import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";

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
        <div
          style={{
            top: `${-6 * PIXEL_SCALE}px`,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            whiteSpace: "nowrap",
          }}
          className="absolute z-10"
        ></div>
        <img
          src={feederMachineImage}
          className="relative z-0"
          style={{
            width: `${30 * PIXEL_SCALE}px`,
          }}
        />
      </div>

      <Modal show={showFeederMachineModal}></Modal>
    </>
  );
};
