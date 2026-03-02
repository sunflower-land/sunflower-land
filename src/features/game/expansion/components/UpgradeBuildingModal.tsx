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
  BuildingUpgradeCost,
  UpgradableBuildingType,
  makeUpgradableBuildingKey,
} from "features/game/events/landExpansion/upgradeBuilding";
import { InlineDialogue } from "features/world/ui/TypingMessage";
import powerup from "assets/icons/level_up.png";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { BARN_IMAGES } from "features/island/buildings/components/building/barn/Barn";
import {
  HEN_HOUSE_VARIANTS,
  PET_HOUSE_VARIANTS,
  WATER_WELL_VARIANTS,
} from "features/island/lib/alternateArt";
import { getSupportedPlots } from "features/game/events/landExpansion/plant";
import { getBumpkinLevel } from "features/game/lib/level";
import { getCurrentBiome, LandBiomeName } from "features/island/biomes/biomes";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useCountdown } from "lib/utils/hooks/useCountdown";

interface Props {
  buildingName: UpgradableBuildingType;
  currentLevel: number;
  nextLevel: number;
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
  const requirements = BUILDING_UPGRADES[buildingName][nextLevel] as
    | BuildingUpgradeCost
    | undefined;
  const buildingKey = makeUpgradableBuildingKey(buildingName);
  const building = state[buildingKey];
  const upgradeReadyAt = building?.upgradeReadyAt;
  const { totalSeconds: secondsLeft, ...upgradeCountdown } = useCountdown(
    upgradeReadyAt ?? 0,
  );
  const isCurrentlyUpgrading = !!upgradeReadyAt && secondsLeft > 0;

  const upgrade = () => {
    // Implement the upgrade logic here
    gameService.send({ type: "building.upgraded", buildingType: buildingName });

    onClose();
  };

  const hasRequiredLevel = (requirements: BuildingUpgradeCost) => {
    const bumpkinLevel = getBumpkinLevel(state.bumpkin?.experience ?? 0);

    if (requirements.requiredLevel) {
      return bumpkinLevel >= requirements.requiredLevel;
    }

    return true;
  };

  const hasRequirements = (requirements: BuildingUpgradeCost) => {
    // Check if player has enough bumpkin level
    if (!hasRequiredLevel(requirements)) {
      return false;
    }

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

  const currentSupportedPlots = getSupportedPlots({
    wellLevel: currentLevel,
    buildings: state.buildings,
    island: state.island.type,
  });

  const nextSupportedPlots = getSupportedPlots({
    wellLevel: nextLevel,
    buildings: state.buildings,
    island: state.island.type,
  });

  const nextLevelFertility = nextSupportedPlots - currentSupportedPlots;

  const getBuildingIcon = () => {
    if (buildingName === "Hen House") {
      return HEN_HOUSE_VARIANTS[state.season.season][nextLevel];
    }

    if (buildingName === "Water Well") {
      return WATER_WELL_VARIANTS[state.season.season][nextLevel];
    }

    if (buildingName === "Pet House") {
      return PET_HOUSE_VARIANTS[nextLevel];
    }

    const biome: LandBiomeName = getCurrentBiome(state.island);

    return BARN_IMAGES[biome][state.season.season][nextLevel];
  };

  const buildingIcon = getBuildingIcon();

  const hasChickenCoopBonus =
    buildingName === "Hen House" &&
    isCollectibleBuilt({ name: "Chicken Coop", game: state });

  const hasBarnBonus =
    buildingName === "Barn" &&
    isCollectibleBuilt({ name: "Barn Blueprint", game: state });

  const capacityIncrease = hasChickenCoopBonus || hasBarnBonus ? 10 : 5;

  const getUpgradeMessage = () => {
    if (buildingName === "Water Well") {
      if (nextLevel === 4) {
        return t("upgrade.unlockAllPlots");
      }
      return t("upgrade.plusPlotFertility", { amount: nextLevelFertility });
    }
    if (buildingName === "Pet House") {
      return t("upgrade.petHouseCapacity");
    }
    return t("upgrade.capacityIncrease", { amount: capacityIncrease });
  };

  const upgradeMessage = getUpgradeMessage();

  return (
    <Modal show={show} onHide={onClose}>
      <CloseButtonPanel
        bumpkinParts={NPC_WEARABLES.blacksmith}
        onClose={onClose}
      >
        {/* Show max level content */}
        {isMaxLevel || !requirements ? (
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
                message={t("building.isMaxLevel", { building: buildingName })}
              />
            </div>
            <Button onClick={onClose}>{t("close")}</Button>
          </div>
        ) : (
          // If not max level, show upgrade content
          <div className="flex flex-col">
            <div className="p-1">
              <Label
                type="default"
                icon={SUNNYSIDE.icons.hammer}
                className="mb-2 ml-1"
              >
                {t("upgrade.building", { building: buildingName })}
              </Label>
              {isCurrentlyUpgrading && (
                <Label
                  type="info"
                  icon={SUNNYSIDE.icons.stopwatch}
                  className="mb-2 ml-1"
                >
                  <span className="flex items-center gap-1">
                    {t("ready.in")}
                    <TimerDisplay time={upgradeCountdown} />
                  </span>
                </Label>
              )}
              <InlineDialogue
                message={t(
                  buildingName === "Water Well"
                    ? "upgrade.intro.water.well"
                    : buildingName === "Pet House"
                      ? "upgrade.intro.pet.house"
                      : "upgrade.intro",
                  {
                    building: buildingName,
                    animals:
                      buildingName === "Barn"
                        ? t("upgrade.sheep.cows")
                        : t("upgrade.chickens"),
                  },
                )}
              />
            </div>
            <div className="flex flex-col w-full mt-2">
              <div className="flex flex-wrap justify-between">
                <Label
                  type="default"
                  icon={SUNNYSIDE.icons.basket}
                  className="ml-2 mb-2"
                >
                  {t("requirements")}
                </Label>

                {requirements.requiredLevel &&
                  !hasRequiredLevel(requirements) && (
                    <Label
                      type="danger"
                      secondaryIcon={SUNNYSIDE.icons.player}
                      className="mr-2 mb-2"
                    >
                      {t("warning.level.required", {
                        lvl: requirements.requiredLevel,
                      })}
                    </Label>
                  )}
              </div>
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
                icon={buildingIcon}
                iconWidth={11}
                className={`${buildingName === "Hen House" ? "ml-2" : "ml-1.5"} mt-2`}
              >
                <span className="pl-1.5">{`${t("upgrade.building.nextLevel")} ${nextLevel}`}</span>
              </Label>
              <Label
                type="success"
                secondaryIcon={powerup}
                className="mr-1 mt-2"
              >
                {upgradeMessage}
              </Label>
            </div>
            <Button
              className="mt-2"
              onClick={upgrade}
              disabled={isCurrentlyUpgrading || !hasRequirements(requirements)}
            >
              {isCurrentlyUpgrading
                ? t("in.progress")
                : t("upgrade.building", { building: buildingName })}
            </Button>
          </div>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
