import React, { useContext } from "react";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";
import { NPC_WEARABLES } from "lib/npcs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import {
  BUILDING_UPGRADES,
  AnimalBuildingLevel,
} from "features/game/events/landExpansion/upgradeBuilding";
import { AnimalBuildingType } from "features/game/types/animals";
import { InlineDialogue } from "features/world/ui/TypingMessage";
import powerup from "assets/icons/level_up.png";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { BARN_IMAGES } from "features/island/buildings/components/building/barn/Barn";
import { HEN_HOUSE_VARIANTS } from "features/island/lib/alternateArt";

interface Props {
  buildingName: AnimalBuildingType;
  currentLevel: AnimalBuildingLevel;
  nextLevel: AnimalBuildingLevel;
  show: boolean;
  onClose: () => void;
}

const _state = (state: MachineState) => state.context.state;

export const UpgradeBuildingModal: React.FC<Props> = ({
  buildingName,
  currentLevel,
  nextLevel,
  onClose,
  show,
}) => {
  const { gameService } = useContext(Context);

  const state = useSelector(gameService, _state);
  const { t } = useAppTranslation();

  const maxLevel = getKeys(BUILDING_UPGRADES[buildingName]).length;
  const isMaxLevel = currentLevel === maxLevel;
  const requirements = BUILDING_UPGRADES[buildingName][nextLevel];

  const upgrade = () => {
    // Implement the upgrade logic here
    gameService.send("building.upgraded", {
      buildingType: buildingName,
    });

    onClose();
  };

  const hasRequirements = () => {
    // Check if player has enough coins
    if (state.coins < requirements.coins) {
      return false;
    }

    // Check if player has enough items
    return getKeys(requirements.items).every((itemName) => {
      const requiredAmount = requirements.items[itemName] ?? new Decimal(0);
      const playerAmount = state.inventory[itemName] ?? new Decimal(0);
      return playerAmount.gte(requiredAmount);
    });
  };

  return (
    <Modal show={show} onHide={onClose}>
      <CloseButtonPanel
        bumpkinParts={NPC_WEARABLES.blacksmith}
        onClose={onClose}
      >
        {isMaxLevel ? (
          <div className="flex flex-col">
            <div className="p-1 mb-2">
              <Label
                type="danger"
                className="ml-1 mb-2"
                icon={SUNNYSIDE.icons.hammer}
              >
                {t("max.level")}
              </Label>
              <InlineDialogue
                message={t("building.isMaxLevel", {
                  building: buildingName,
                })}
              />
            </div>
            <Button onClick={onClose}>{t("close")}</Button>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="p-1">
              <Label
                type="default"
                icon={SUNNYSIDE.icons.hammer}
                className="mb-2 ml-1"
              >
                {t("upgrade.building", { building: buildingName })}
              </Label>
              <InlineDialogue
                message={t("upgrade.intro", {
                  building: buildingName,
                  animals:
                    buildingName === "Barn" ? "sheep and cows" : "chickens",
                })}
              />
            </div>
            <div className="flex flex-col items-start w-full mt-2">
              <Label
                type="default"
                icon={SUNNYSIDE.icons.basket}
                className="ml-2 mb-2"
              >
                {t("requirements")}
              </Label>
              <InnerPanel className="flex flex-wrap gap-2 w-full">
                {getKeys(requirements.items).map((itemName) => (
                  <div key={itemName} className="flex-shrink-0 gap-1">
                    <RequirementLabel
                      type="item"
                      item={itemName}
                      balance={state.inventory[itemName] ?? new Decimal(0)}
                      requirement={
                        requirements.items[itemName] ?? new Decimal(0)
                      }
                    />
                  </div>
                ))}
                <div className="flex-shrink-0 gap-1">
                  <RequirementLabel
                    type="coins"
                    balance={state.coins}
                    requirement={requirements.coins}
                  />
                </div>
              </InnerPanel>
            </div>
            <div className="flex flex-wrap justify-between">
              <Label
                type="default"
                icon={
                  buildingName === "Hen House"
                    ? HEN_HOUSE_VARIANTS[state.island.type][nextLevel]
                    : BARN_IMAGES[nextLevel]
                }
                iconWidth={11}
                className={`${buildingName === "Hen House" ? "ml-2" : "ml-1.5"} mt-2`}
              >
                <span className="pl-1.5">{`${t("upgrade.building.nextLevel")} ${nextLevel}`}</span>
              </Label>
              <Label
                type="success"
                secondaryIcon={powerup}
                className="mr-1 mt-2"
              >{`+${buildingName === "Hen House" && isCollectibleBuilt({ name: "Chicken Coop", game: state }) ? 10 : 5} ${t("capacity")}`}</Label>
            </div>
            <Button
              className="mt-2"
              onClick={upgrade}
              disabled={!hasRequirements()}
            >
              {t("upgrade.building", { building: buildingName })}
            </Button>
          </div>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
