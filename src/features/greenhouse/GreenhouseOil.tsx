import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import oilBarrels from "assets/land/oil_barrels.webp";
import oilIcon from "assets/resources/oil.webp";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";

import { Label } from "components/ui/Label";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { formatNumber } from "lib/utils/formatNumber";
import { GreenhouseOilModal } from "./GreenhouseOilModal";

const selectOil = (state: MachineState) => state.context.state.greenhouse.oil;
const isPlanting = (state: MachineState) =>
  Object.values(state.context.state.greenhouse.pots).some((pot) => !!pot.plant);

export const GreenhouseOil: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const barrelOil = useSelector(gameService, selectOil);
  const plantsAreActive = useSelector(gameService, isPlanting);

  return (
    <>
      <div
        className="relative cursor-pointer hover:img-highlight"
        onClick={() => setShowModal(true)}
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
        >
          <Label type={barrelOil <= 0 ? "danger" : "default"} icon={oilIcon}>
            {t("greenhouse.oilInMachine", { oil: formatNumber(barrelOil) })}
          </Label>
        </div>
        <img
          src={oilBarrels}
          className="relative z-0"
          style={{
            width: `${55 * PIXEL_SCALE}px`,
          }}
        />
      </div>

      {plantsAreActive && (
        <img
          src={SUNNYSIDE.building.smoke}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 20}px`,
            left: `${PIXEL_SCALE * 58}px`,
            bottom: `${PIXEL_SCALE * 30}px`,
          }}
        />
      )}

      <GreenhouseOilModal show={showModal} onHide={() => setShowModal(false)} />
    </>
  );
};
