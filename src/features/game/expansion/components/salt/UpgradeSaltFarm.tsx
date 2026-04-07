import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import {
  SALT_FARM_MAX_LEVEL,
  SALT_FARM_UPGRADES,
} from "features/game/types/salt";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "lib/object";
import { SUNNYSIDE } from "assets/sunnyside";
import { InlineDialogue } from "features/world/ui/TypingMessage";
import powerup from "assets/icons/level_up.png";
import Decimal from "decimal.js-light";

const _state = (state: MachineState) => state.context.state;

export const UpgradeSaltFarm: React.FC = () => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { t } = useAppTranslation();

  const { saltFarm, coins, inventory } = state;
  const currentLevel = saltFarm.level;
  const nextLevel = currentLevel + 1;
  const isUnlockingSaltFarm = currentLevel === 0;
  const isMaxLevel = currentLevel >= SALT_FARM_MAX_LEVEL;
  const nextDefinition = SALT_FARM_UPGRADES[nextLevel];
  const requirements = nextDefinition?.upgradeCost;

  const currentNodeCount = getKeys(saltFarm.nodes).length;
  const nodesToAdd = nextDefinition
    ? nextDefinition.nodes - currentNodeCount
    : 0;

  const hasRequirements = () => {
    if (!requirements) return false;
    if (coins < requirements.coins) return false;
    return getKeys(requirements.items).every((itemName) => {
      const requiredAmount = requirements.items[itemName] ?? new Decimal(0);
      const playerAmount = inventory[itemName] ?? new Decimal(0);
      return playerAmount.gte(requiredAmount);
    });
  };

  const upgrade = () => {
    gameService.send("saltFarm.upgraded");
  };

  if (isMaxLevel || !requirements) {
    return (
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
            message={t("building.isMaxLevel", { building: "Salt Farm" })}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <InnerPanel className="p-1">
        <Label
          type="default"
          icon={SUNNYSIDE.icons.hammer}
          className="mb-2 ml-1"
        >
          {isUnlockingSaltFarm
            ? t("unlock.building", { building: "Salt Farm" })
            : t("upgrade.building", { building: "Salt Farm" })}
        </Label>
        <p className="text-sm p-1">
          {isUnlockingSaltFarm
            ? t("description.unlockSaltFarm")
            : t("description.upgradeSaltFarm")}
        </p>
      </InnerPanel>
      <InnerPanel className="flex flex-col w-full">
        <div className="flex flex-wrap justify-between">
          <Label
            type="default"
            icon={SUNNYSIDE.icons.basket}
            className="ml-2 mb-2"
          >
            {t("requirements")}
          </Label>
        </div>
        <div className="flex flex-wrap gap-2 w-full">
          {getKeys(requirements.items).map((itemName) => (
            <div key={itemName} className="flex-shrink-0 gap-1">
              <RequirementLabel
                type="item"
                item={itemName}
                balance={inventory[itemName] ?? new Decimal(0)}
                requirement={requirements.items[itemName] ?? new Decimal(0)}
              />
            </div>
          ))}
          <div className="flex-shrink-0 gap-1">
            <RequirementLabel
              type="coins"
              balance={coins}
              requirement={requirements.coins}
            />
          </div>
        </div>
      </InnerPanel>
      <InnerPanel className="flex flex-wrap justify-between">
        <Label
          type="default"
          icon={ITEM_DETAILS.Salt.image}
          iconWidth={11}
          className="ml-1.5"
        >
          <span className="pl-1.5">
            {isUnlockingSaltFarm
              ? t("saltFarm.unlocksAtLevel", { level: nextLevel })
              : `${t("upgrade.building.nextLevel")} ${nextLevel}`}
          </span>
        </Label>
        <Label type="success" secondaryIcon={powerup} className="mr-1">
          {nodesToAdd > 0
            ? `+${nodesToAdd} salt node${nodesToAdd === 1 ? "" : "s"}`
            : t("upgrade.building.nextLevel")}
        </Label>
      </InnerPanel>
      <Button onClick={upgrade} disabled={!hasRequirements()}>
        {isUnlockingSaltFarm
          ? t("unlock.building", { building: "Salt Farm" })
          : t("upgrade.building", { building: "Salt Farm" })}
      </Button>
    </div>
  );
};
