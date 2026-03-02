import React, { useContext, useRef, useState } from "react";
import { useSelector } from "@xstate/react";

import oilIcon from "assets/resources/oil.webp";
import barrel from "assets/resources/oil_barrel.webp";

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
  getOilUsage,
  OIL_USAGE,
  SEED_TO_PLANT,
} from "features/game/events/landExpansion/plantGreenhouse";
import { getKeys } from "features/game/types/craftables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";
import { formatNumber } from "lib/utils/formatNumber";

const DEFAULT_INCREMENT = new Decimal(5);
const MACHINE_OIL_CAPACITY = new Decimal(100);

const selectMachineOil = (state: MachineState) =>
  new Decimal(state.context.state.greenhouse.oil);
const selectInventoryOil = (state: MachineState) =>
  state.context.state.inventory.Oil ?? new Decimal(0);
const _state = (state: MachineState) => state.context.state;

interface Props {
  show: boolean;
  onHide: () => void;
}

export const GreenhouseOilModal: React.FC<Props> = ({ show, onHide }) => {
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const divRef = useRef<HTMLDivElement>(null);

  const [addedOil, setAddedOil] = useState(new Decimal(0));
  const machineOil = useSelector(gameService, selectMachineOil);
  const inventoryOil = useSelector(gameService, selectInventoryOil);
  const state = useSelector(gameService, _state);
  const newMachineOil = machineOil.add(addedOil);
  const availableOil = inventoryOil.sub(addedOil);

  const totalOil = machineOil.add(inventoryOil);
  const maxMachineOil = MACHINE_OIL_CAPACITY.lessThan(totalOil)
    ? MACHINE_OIL_CAPACITY
    : totalOil;
  const maxAddedOil = maxMachineOil
    .sub(machineOil)
    .toDecimalPlaces(0, Decimal.ROUND_DOWN);
  const remainingOilToAdd = maxMachineOil.sub(newMachineOil);

  const decrementInterval = addedOil.greaterThan(DEFAULT_INCREMENT)
    ? DEFAULT_INCREMENT
    : addedOil.toDecimalPlaces(0, Decimal.ROUND_DOWN);
  const incrementInterval = remainingOilToAdd.greaterThan(DEFAULT_INCREMENT)
    ? DEFAULT_INCREMENT
    : remainingOilToAdd.toDecimalPlaces(0, Decimal.ROUND_DOWN);

  const close = () => {
    setAddedOil(new Decimal(0));
    onHide();
  };

  const confirm = () => {
    gameService.send({ type: "greenhouse.oiled", amount: addedOil.toNumber() });

    close();
  };

  return (
    <Modal show={show} onHide={close}>
      <CloseButtonPanel onClose={close}>
        <div ref={divRef} className="p-1">
          <Label type="default" className="mb-2" icon={barrel}>
            {t("greenhouse.oilInMachine", {
              oil: formatNumber(newMachineOil),
            })}
          </Label>
          <p className="text-xs mb-2">{t("greenhouse.oilDescription")}</p>
          <div className="flex items-center flex-wrap gap-1">
            {getKeys(OIL_USAGE).map((seed) => {
              const { usage: oilUsage } = getOilUsage({
                seed,
                game: state,
              });

              return (
                <Label
                  key={seed}
                  type="formula"
                  className="mx-1"
                  icon={ITEM_DETAILS[SEED_TO_PLANT[seed]].image}
                >
                  {t("greenhouse.numberOil", {
                    oil: formatNumber(oilUsage),
                  })}
                </Label>
              );
            })}
          </div>

          <div className="flex justify-between items-center gap-1 mb-2 mt-4 pl-1">
            <Label type="default" icon={SUNNYSIDE.icons.basket}>
              {t("greenhouse.insertOil", { oil: formatNumber(availableOil) })}
            </Label>
            {newMachineOil.greaterThanOrEqualTo(MACHINE_OIL_CAPACITY) && (
              <Label type="success" icon={SUNNYSIDE.icons.confirm}>
                {t("max.reached")}
              </Label>
            )}
          </div>

          <div className="flex items-center mt-2 -mx-2 gap-1">
            <Box
              parentDivRef={divRef}
              count={new Decimal(availableOil)}
              image={oilIcon}
            />
            <Button
              className="w-12"
              onClick={() => setAddedOil((oil) => oil.minus(decrementInterval))}
              disabled={
                decrementInterval.lessThanOrEqualTo(0) ||
                addedOil.lessThanOrEqualTo(0)
              }
            >
              {`-${formatNumber(decrementInterval)}`}
            </Button>
            <Button
              className="w-12"
              onClick={() => setAddedOil((oil) => oil.plus(incrementInterval))}
              disabled={
                incrementInterval.lessThanOrEqualTo(0) ||
                addedOil.greaterThanOrEqualTo(maxAddedOil)
              }
            >
              {`+${formatNumber(incrementInterval)}`}
            </Button>
            <Button
              className="w-fit"
              onClick={() => setAddedOil(maxAddedOil)}
              disabled={addedOil.greaterThanOrEqualTo(maxAddedOil)}
            >
              {t("max")}
            </Button>
            <Box parentDivRef={divRef} count={newMachineOil} image={barrel} />
          </div>
        </div>
        <Button
          disabled={
            addedOil.lessThanOrEqualTo(0) || addedOil.greaterThan(maxAddedOil)
          }
          onClick={confirm}
        >
          {t("confirm")}
        </Button>
      </CloseButtonPanel>
    </Modal>
  );
};
