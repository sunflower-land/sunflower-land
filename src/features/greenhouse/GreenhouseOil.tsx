import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import oilBarrels from "assets/land/oil_barrels.webp";
import oilIcon from "assets/resources/oil.webp";
import barrel from "assets/resources/oil_barrel.webp";
import smoke from "assets/buildings/smoke.gif";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";

import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import { OuterPanel } from "components/ui/Panel";
import {
  OIL_USAGE,
  SEED_TO_PLANT,
} from "features/game/events/landExpansion/plantGreenhouse";
import { getKeys } from "features/game/types/craftables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const selectOil = (state: MachineState) => state.context.state.greenhouse.oil;
const isPlanting = (state: MachineState) =>
  Object.values(state.context.state.greenhouse.pots).some((pot) => !!pot.plant);

export const GreenhouseOil: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const [addedOil, setAddedOil] = useState(0);
  const oil = useSelector(gameService, selectOil);
  const plantsAreActive = useSelector(gameService, isPlanting);

  const totalOil = oil + addedOil;

  const open = () => {
    setAddedOil(0);
    setShowModal(true);
  };

  const confirm = () => {
    gameService.send("greenhouse.oiled", {
      amount: addedOil,
    });

    setShowModal(false);
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel onClose={() => setShowModal(false)}>
          <div className="p-1">
            <Label type="default" className="mb-2" icon={oilIcon}>
              {t("greenhouse.oilRequired")}
            </Label>
            <p className="text-xs mb-2">{t("greenhouse.oilDescription")}</p>
            <div className="flex items-center flex-wrap">
              {getKeys(OIL_USAGE).map((seed) => (
                <OuterPanel key={seed} className="flex items-center mr-1">
                  <img
                    src={ITEM_DETAILS[SEED_TO_PLANT[seed]].image}
                    className="h-5 mr-1"
                  />
                  <p className="text-xs mr-0.5">{`${OIL_USAGE[seed]} Oil`}</p>
                </OuterPanel>
              ))}
            </div>

            <div className="flex items-center mt-2 -mx-2">
              <Box count={new Decimal(totalOil)} image={barrel} disabled />
              <Button
                className="w-12"
                onClick={() => setAddedOil((o) => o + 5)}
              >
                {`+5`}
              </Button>
            </div>
          </div>
          <Button onClick={confirm}>{t("confirm")}</Button>
        </CloseButtonPanel>
      </Modal>
      <div
        className="relative cursor-pointer hover:img-highlight"
        onClick={open}
      >
        <div
          style={{
            left: `${16 * PIXEL_SCALE}px`,
            top: `${-6 * PIXEL_SCALE}px`,
          }}
          className="absolute z-10"
        >
          <Label
            type={oil <= 0 ? "danger" : "default"}
            icon={oilIcon}
          >{`${oil} Oil`}</Label>
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
          src={smoke}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 20}px`,
            left: `${PIXEL_SCALE * 60}px`,
            bottom: `${PIXEL_SCALE * 28}px`,
          }}
        />
      )}
    </>
  );
};
