import React, { useContext, useState } from "react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";
import { CookingBuildingName } from "features/game/types/buildings";
import { SUNNYSIDE } from "assets/sunnyside";
import oilIcon from "assets/resources/oil.webp";
import barrel from "assets/resources/oil_barrel.webp";
import {
  BUILDING_DAILY_OIL_CONSUMPTION,
  BUILDING_OIL_BOOSTS,
} from "features/game/events/landExpansion/cook";
import { BUILDING_DAILY_OIL_CAPACITY } from "features/game/events/landExpansion/supplyCookingOil";

interface Props {
  buildingId: string;
  buildingName: CookingBuildingName;
}

export const AddOil: React.FC<Props> = ({ buildingName, buildingId }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const [showOilModal, setShowOilModal] = useState(false);

  const selectOil = (state: MachineState) =>
    state.context.state.buildings?.[buildingName]?.[0].oilRemaining ?? 0;
  const selectAvailable = (state: MachineState) =>
    state.context.state.inventory.Oil ?? new Decimal(0);

  const barrelOil = useSelector(gameService, selectOil);
  const availableOil = useSelector(gameService, selectAvailable);

  const handleSupplyOil = () => {
    gameService.send("cookingOil.supplied", {
      building: buildingName,
      buildingId,
      oilQuantity: 1,
    });

    gameService.send("SAVE");
  };

  return (
    <>
      <div className="p-1">
        <Label type="default" className="mb-2" icon={barrel}>
          {t("building.oil.remaining", { oil: barrelOil })}
        </Label>

        <div className="flex items-center mt-2 -mx-2">
          <Button className="w-32" onClick={() => setShowOilModal(true)}>
            {`Add oil`}
          </Button>
        </div>
      </div>
      <Modal show={showOilModal} onHide={() => setShowOilModal(false)}>
        <CloseButtonPanel>
          <div className="p-1">
            <div className="flex">
              <Label type="default" className="mb-2 mr-2" icon={barrel}>
                {t("building.oil.remaining", { oil: barrelOil })}
              </Label>
              {barrelOil >= BUILDING_DAILY_OIL_CAPACITY[buildingName] ? (
                <Label type="warning" className="mb-2">
                  {`Full tank`}
                </Label>
              ) : null}
            </div>

            <p className="text-sm">
              {`Boost your cooking in the ${buildingName} with oil! Enjoy a ${
                BUILDING_OIL_BOOSTS[buildingName] * 100
              }% cooking time reduction. Note: ${buildingName} uses ${
                BUILDING_DAILY_OIL_CONSUMPTION[buildingName]
              } oil daily, adjusted for cooking times.`}
            </p>
            <div className="flex justify-between items-center mb-2 mt-4 pl-1">
              <Label type="default" icon={SUNNYSIDE.icons.basket}>
                {t("greenhouse.insertOil", { oil: availableOil })}
              </Label>
            </div>

            <div className="flex items-center mt-2 -mx-2">
              <Box count={new Decimal(availableOil)} image={oilIcon} disabled />
              <Button
                className="w-12"
                onClick={() => handleSupplyOil()}
                disabled={
                  !availableOil.gte(1) ||
                  barrelOil >= BUILDING_DAILY_OIL_CAPACITY[buildingName]
                }
              >
                {`+1`}
              </Button>
            </div>
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
