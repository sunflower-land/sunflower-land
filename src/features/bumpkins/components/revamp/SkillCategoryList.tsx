import React, { useContext, useState } from "react";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
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
import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/choseSkill";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ITEM_DETAILS } from "features/game/types/images";
import { ISLAND_EXPANSIONS } from "features/game/types/game";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import classNames from "classnames";
import { SquareIcon } from "components/ui/SquareIcon";
import { MachineState } from "features/game/lib/gameMachine";
import { gameAnalytics } from "lib/gameAnalytics";
import {
  canResetForFree,
  getGemCost,
  PaymentType,
  getTimeUntilNextFreeReset,
} from "features/game/events/landExpansion/resetSkills";
import { SkillReset } from "./SkillReset";
import fruits from "assets/fruit/fruits.png";
import Decimal from "decimal.js-light";
import { capitalize } from "lib/utils/capitalize";

export const SKILL_TREE_ICONS: Record<BumpkinRevampSkillTree, string> = {
  Crops: SUNNYSIDE.skills.crops,
  Trees: SUNNYSIDE.skills.trees,
  Cooking: SUNNYSIDE.skills.cooking,
  Animals: SUNNYSIDE.animals.chickenIdle,
  "Fruit Patch": fruits,
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

  const hasSkills = getKeys(skills).length > 0;

  const getNextResetDateAndTime = () => {
    const nextResetTime =
      Date.now() + getTimeUntilNextFreeReset(previousFreeSkillResetAt);
    const nextResetDate = new Date(nextResetTime);

    return {
      date: nextResetDate.toLocaleDateString(navigator.language, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: nextResetDate.toLocaleTimeString(navigator.language, {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }),
    };
  };

  const gemCost = getGemCost(paidSkillResets);

  const hasEnoughGems = inventory.Gem?.gte(gemCost) ?? false;
  const gemBalance = inventory.Gem ?? new Decimal(0);

  const resetType: PaymentType = canResetForFree(previousFreeSkillResetAt)
    ? "free"
    : "gems";

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
    if (resetType === "free" && !canResetForFree(previousFreeSkillResetAt))
      return false;
    if (resetType === "gems" && !hasEnoughGems) return false;

    return true;
  };

  const getCropMachineResetWarning = (): string | undefined => {
    return undefined;
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
          if (getRevampSkillTreeCategoriesByIsland(islandType).length <= 0)
            return;

          return (
            <div key={islandType} className="flex flex-col items-stretch">
              <div className="flex items-center gap-2 mt-1 mb-2">
                <Label
                  type={hasUnlockedIslandCategory ? "default" : "warning"}
                  className="capitalize"
                >
                  {t("skillCategory.islands", {
                    island:
                      islandType === "spring" ? "Petal Paradise" : islandType,
                  })}
                </Label>

                {!hasUnlockedIslandCategory && (
                  <Label type="warning">
                    {t("skillCategory.reachIsland", {
                      island:
                        islandType === "spring"
                          ? "Petal Paradise"
                          : `${capitalize(islandType)} Island`,
                    })}
                  </Label>
                )}
              </div>
              <div className="grid grid-cols-2 gap-1">
                {getRevampSkillTreeCategoriesByIsland(islandType).map(
                  (category) => {
                    const skills = getRevampSkills(category);
                    const icon = SKILL_TREE_ICONS[skills[0].tree];
                    const skillsAcquiredInCategoryCount = getKeys({
                      ...bumpkin?.skills,
                    }).filter((acquiredSkillName) =>
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
            </div>
          );
        })}
        <div className="flex flex-row items-center m-1">
          <p
            className="text-xs cursor-pointer underline py-1"
            onClick={() => setShowSkillsResetModal(true)}
          >
            {t("skillReset.resetSkills")}
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
        <SkillReset
          resetType={resetType}
          gemCost={gemCost}
          gemBalance={gemBalance}
          getNextResetDateAndTime={getNextResetDateAndTime}
          getCropMachineResetWarning={getCropMachineResetWarning}
          hasSkills={hasSkills}
          canResetSkills={canResetSkills}
          handleSkillsReset={handleSkillsReset}
          showSkillsResetConfirmation={showSkillsResetConfirmation}
          setShowSkillsResetConfirmation={setShowSkillsResetConfirmation}
        />
      </Modal>
    </>
  );
};
