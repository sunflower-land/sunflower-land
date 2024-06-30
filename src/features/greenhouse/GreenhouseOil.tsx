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
import {
  OIL_USAGE,
  SEED_TO_PLANT,
} from "features/game/events/landExpansion/plantGreenhouse";
import { getKeys } from "features/game/types/craftables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";

const selectOil = (state: MachineState) => state.context.state.greenhouse.oil;
const selectAvailable = (state: MachineState) =>
  state.context.state.inventory.Oil ?? new Decimal(0);
const isPlanting = (state: MachineState) =>
  Object.values(state.context.state.greenhouse.pots).some((pot) => !!pot.plant);

export const GreenhouseOil: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const [addedOil, setAddedOil] = useState(0);
  const barrelOil = useSelector(gameService, selectOil);
  const available = useSelector(gameService, selectAvailable);
  const plantsAreActive = useSelector(gameService, isPlanting);

  const totalOil = barrelOil + addedOil;
  const availableOil = available.sub(addedOil);

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
            <Label type="default" className="mb-2" icon={barrel}>
              {t("greenhouse.oilInMachine", { oil: totalOil })}
            </Label>
            <p className="text-xs mb-2">{t("greenhouse.oilDescription")}</p>
            <div className="flex items-center flex-wrap gap-1">
              {getKeys(OIL_USAGE).map((seed) => (
                <Label
                  key={seed}
                  type="formula"
                  className="mx-1"
                  icon={ITEM_DETAILS[SEED_TO_PLANT[seed]].image}
                >
                  {t("greenhouse.numberOil", { oil: OIL_USAGE[seed] })}
                </Label>
              ))}
            </div>

            <div className="flex justify-between items-center mb-2 mt-4 pl-1">
              <Label type="default" icon={SUNNYSIDE.icons.basket}>
                {t("greenhouse.insertOil", { oil: availableOil })}
              </Label>
              {totalOil >= 100 && (
                <Label type="success" icon={SUNNYSIDE.icons.confirm}>
                  {t("max.reached")}
                </Label>
              )}
            </div>

            <div className="flex items-center mt-2 -mx-2">
              <Box count={new Decimal(availableOil)} image={oilIcon} disabled />
              <Button
                className="w-12 mr-1"
                onClick={() => setAddedOil((o) => o - 5)}
                disabled={addedOil < 5}
              >
                {`-5`}
              </Button>
              <Button
                className="w-12"
                onClick={() => setAddedOil((o) => o + 5)}
                disabled={!availableOil.gte(5) || totalOil >= 100}
              >
                {`+5`}
              </Button>
              <Box count={new Decimal(totalOil)} image={barrel} disabled />
            </div>
          </div>
          <Button disabled={addedOil <= 0 || totalOil > 100} onClick={confirm}>
            {t("confirm")}
          </Button>
        </CloseButtonPanel>
      </Modal>
      <div
        className="relative cursor-pointer hover:img-highlight"
        onClick={open}
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
            {t("greenhouse.oilInMachine", { oil: barrelOil })}
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
