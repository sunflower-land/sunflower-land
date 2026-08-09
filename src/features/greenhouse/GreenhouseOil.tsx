import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import oilBarrels from "assets/land/oil_barrels.webp";
import oilIcon from "assets/resources/oil.webp";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";

import { Label } from "components/ui/Label";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber } from "lib/utils/formatNumber";
import { GreenhouseOilModal } from "./GreenhouseOilModal";

const selectOil = (state: MachineState) => state.context.state.greenhouse.oil;

export const GreenhouseOil: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const barrelOil = useSelector(gameService, selectOil);

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

      <GreenhouseOilModal show={showModal} onHide={() => setShowModal(false)} />
    </>
  );
};
