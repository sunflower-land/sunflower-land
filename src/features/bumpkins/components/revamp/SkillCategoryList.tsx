import React, { useContext, useState } from "react";
import { ButtonPanel, InnerPanel, OuterPanel } from "components/ui/Panel";
import {
  BumpkinRevampSkillTree,
  getRevampSkills,
  getRevampSkillTreeCategoriesByIsland,
} from "features/game/types/bumpkinSkills";

import { Modal } from "components/ui/Modal";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/choseSkill";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ITEM_DETAILS } from "features/game/types/images";
import { ISLAND_EXPANSIONS } from "features/game/types/game";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import classNames from "classnames";
import { SquareIcon } from "components/ui/SquareIcon";
import { MachineState } from "features/game/lib/gameMachine";
import { getTotalOilMillisInMachine } from "features/game/events/landExpansion/supplyCropMachine";
import { gameAnalytics } from "lib/gameAnalytics";
import {
  getGemCost,
  getTimeUntilNextFreeReset,
} from "features/game/events/landExpansion/resetSkills";
import { millisecondsToString } from "lib/utils/time";

export const SKILL_TREE_ICONS: Record<BumpkinRevampSkillTree, string> = {
  Crops: SUNNYSIDE.skills.crops,
  Trees: SUNNYSIDE.skills.trees,
  Cooking: SUNNYSIDE.skills.cooking,
  Animals: SUNNYSIDE.animals.chickenIdle,
  "Fruit Patch": ITEM_DETAILS.Apple.image,
  Fishing: SUNNYSIDE.icons.fish,
  Greenhouse: ITEM_DETAILS.Greenhouse.image,
  Mining: SUNNYSIDE.tools.stone_pickaxe,
  "Bees & Flowers": ITEM_DETAILS["Red Pansy"].image,
  Machinery: ITEM_DETAILS["Crop Machine"].image,
  Compost: ITEM_DETAILS["Premium Composter"].image,
};

const _state = (state: MachineState) => state.context.state;

export const SkillCategoryList: React.FC<{
  onClick: (category: BumpkinRevampSkillTree) => void;
}> = ({ onClick }) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const [showSkillsResetModal, setShowSkillsResetModal] = useState(false);
  const [showSkillsResetConfirmation, setShowSkillsResetConfirmation] =
    useState(false);

  const { bumpkin, inventory } = state;
  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);
  const { previousFreeSkillResetAt = 0, paidSkillResets = 0, skills } = bumpkin;

  const hasSkills = skills ? Object.keys(skills).length > 0 : false;

  const FOUR_MONTHS_IN_MS = 4 * 30 * 24 * 60 * 60 * 1000;

  const getTimeUntilNextResetText = () => {
    const timeRemaining = getTimeUntilNextFreeReset(
      previousFreeSkillResetAt,
      Date.now(),
    );

    return millisecondsToString(timeRemaining, {
      length: "medium",
      removeTrailingZeros: true,
    });
  };

  const canResetForFree =
    Date.now() - previousFreeSkillResetAt >= FOUR_MONTHS_IN_MS;

  const gemCost = getGemCost(paidSkillResets);

  const hasEnoughGems = inventory.Gem?.gte(gemCost) ?? false;

  const resetType = canResetForFree ? "free" : "gems";

  const handleSkillsReset = () => {
    gameService.send({
      type: "skills.reset",
      paymentType: resetType,
    });
    setShowSkillsResetModal(false);

    if (resetType === "gems") {
      gameAnalytics.trackSink({
        currency: "Gem",
        amount: gemCost,
        item: "Skills Reset",
        type: "Fee",
      });
    }
  };

  const canResetSkills = () => {
    if (!hasSkills) return false;
    if (resetType === "free" && !canResetForFree) return false;
    if (resetType === "gems" && !hasEnoughGems) return false;

    // Check Crop Machine conditions
    const cropMachine = state.buildings["Crop Machine"]?.[0];
    const { queue = [], unallocatedOilTime = 0 } = cropMachine ?? {};

    // Check Field Expansion Module condition
    if (skills["Field Expansion Module"] && queue.length > 5) {
      return false;
    }

    // Check Leak-Proof Tank condition
    if (skills["Leak-Proof Tank"]) {
      const oilMillisInMachine = getTotalOilMillisInMachine(
        queue,
        unallocatedOilTime,
      );
      if (oilMillisInMachine > 48 * 60 * 60 * 1000) {
        return false;
      }
    }

    return true;
  };

  const getCropMachineResetWarning = (): string | undefined => {
    const cropMachine = state.buildings["Crop Machine"]?.[0];
    const { queue = [], unallocatedOilTime = 0 } = cropMachine ?? {};

    if (skills["Field Expansion Module"] && queue.length > 5) {
      return "Remove crops from additional slots before resetting";
    }

    if (skills["Leak-Proof Tank"]) {
      const oilMillisInMachine = getTotalOilMillisInMachine(
        queue,
        unallocatedOilTime,
      );
      if (oilMillisInMachine > 48 * 60 * 60 * 1000) {
        return "Reduce oil in tank before resetting";
      }
    }
  };

  return (
    <>
      <InnerPanel className="flex flex-col h-full overflow-y-auto scrollable max-h-96">
        <div className="flex flex-row mt-2 mb-1 items-center">
          <Label type="default">{`${t("skillPts")} ${availableSkillPoints}`}</Label>
        </div>
        {ISLAND_EXPANSIONS.map((islandType) => {
          const hasUnlockedIslandCategory = hasRequiredIslandExpansion(
            state.island.type,
            islandType,
          );
          return (
            <div key={islandType} className="flex flex-col items-stretch">
              <div className="flex items-center gap-2 mt-1 mb-2">
                {getRevampSkillTreeCategoriesByIsland(islandType).length >
                  0 && (
                  <Label
                    type={hasUnlockedIslandCategory ? "default" : "warning"}
                    className="capitalize"
                  >
                    {`${islandType} Skills`}
                  </Label>
                )}
                {!hasUnlockedIslandCategory && (
                  <Label type="warning">
                    {`Reach ${islandType} island to unlock`}
                  </Label>
                )}
              </div>

              {getRevampSkillTreeCategoriesByIsland(islandType).map(
                (category) => {
                  const skills = getRevampSkills(category);
                  const icon = SKILL_TREE_ICONS[skills[0].tree];
                  const skillsAcquiredInCategoryCount = getKeys(skills).filter(
                    (acquiredSkillName) =>
                      skills.find((skill) => skill.name === acquiredSkillName),
                  ).length;

                  return (
                    <div key={category}>
                      <ButtonPanel
                        disabled={!hasUnlockedIslandCategory}
                        onClick={
                          hasUnlockedIslandCategory
                            ? () => onClick(category)
                            : undefined
                        }
                        className={classNames(
                          `flex relative items-center mb-1 hover:bg-brown-200`,
                          { "cursor-pointer": hasUnlockedIslandCategory },
                        )}
                      >
                        <Label
                          type="default"
                          className="px-1 text-xxs absolute -top-3 -right-1"
                        >
                          {`${skillsAcquiredInCategoryCount}/${skills.filter((skill) => !skill.disabled).length}`}
                        </Label>
                        <div className="flex gap-2 justify-center items-center">
                          <SquareIcon icon={icon} width={14} />
                          <span className="text-sm">{category}</span>
                        </div>
                      </ButtonPanel>
                    </div>
                  );
                },
              )}
            </div>
          );
        })}
        <div className="flex flex-row items-center">
          <p
            className="text-xs cursor-pointer underline"
            onClick={() => setShowSkillsResetModal(true)}
          >
            {"Reset Skills"}
          </p>
        </div>
      </InnerPanel>

      <Modal
        show={showSkillsResetModal}
        onHide={() => {
          setShowSkillsResetModal(false);
          setShowSkillsResetConfirmation(false);
        }}
      >
        <OuterPanel>
          <InnerPanel className="flex flex-col items-center">
            <div className="flex flex-col items-center w-full gap-2 my-1">
              <Label type="warning">{`Skills Reset`}</Label>

              <Label type={resetType === "free" ? "success" : "vibrant"}>
                {resetType === "free" ? `Free Reset` : `Gem Reset`}
              </Label>

              {canResetForFree ? (
                <p className="text-xs text-center">
                  {`Reset all your skills for free. You can do this once every 4 months.`}
                </p>
              ) : (
                <>
                  <Label type="default" icon={ITEM_DETAILS.Gem.image}>
                    {`${gemCost} Gems`}
                  </Label>
                  <p className="text-xs text-center">
                    {`Reset your skills immediately using gems. Cost doubles with each use until next free reset.`}
                  </p>
                  {!hasEnoughGems && (
                    <Label type="danger" icon={ITEM_DETAILS.Gem.image}>
                      {`Not enough gems`}
                    </Label>
                  )}
                  <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                    {`Next free reset in ${getTimeUntilNextResetText()}`}
                  </Label>
                </>
              )}

              {!hasSkills && (
                <Label type="danger">{`No skills to reset`}</Label>
              )}

              {getCropMachineResetWarning() && (
                <Label type="danger">{getCropMachineResetWarning()}</Label>
              )}

              {!showSkillsResetConfirmation ? (
                <Button
                  onClick={() => setShowSkillsResetConfirmation(true)}
                  disabled={!canResetSkills()}
                >
                  {`Reset Skills`}
                </Button>
              ) : (
                <div className="flex justify-between gap-2 w-full">
                  <Button
                    className="w-full"
                    onClick={() => setShowSkillsResetConfirmation(false)}
                  >
                    {`Cancel`}
                  </Button>
                  <Button
                    className="w-full"
                    onClick={handleSkillsReset}
                    disabled={!canResetSkills()}
                  >
                    {`Confirm`}
                  </Button>
                </div>
              )}
            </div>
          </InnerPanel>
        </OuterPanel>
      </Modal>
    </>
  );
};
