import React, { useContext, useState } from "react";
import { ButtonPanel, InnerPanel, OuterPanel } from "components/ui/Panel";
import {
  BumpkinRevampSkillTree,
  getRevampSkills,
  getRevampSkillTreeCategoriesByIsland,
} from "features/game/types/bumpkinSkills";

import { Modal } from "components/ui/Modal";
import { Label } from "components/ui/Label";
import { getKeys } from "lib/object";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { SUNNYSIDE } from "assets/sunnyside";
import {
  getAvailableBumpkinSkillPoints,
  getAvailableBumpkinSkillPointsForSkills,
} from "features/game/events/landExpansion/choseSkill";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ITEM_DETAILS } from "features/game/types/images";
import { ISLAND_EXPANSIONS, Skills } from "features/game/types/game";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import classNames from "classnames";
import { SquareIcon } from "components/ui/SquareIcon";
import { MachineState } from "features/game/lib/gameMachine";
import {
  canResetForFree,
  getGemCost,
  PaymentType,
  getTimeUntilNextFreeReset,
} from "features/game/events/landExpansion/resetSkills";
import fruits from "assets/fruit/fruits.png";
import { capitalize } from "lib/utils/capitalize";
import { Button } from "components/ui/Button";
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
  Aging: ITEM_DETAILS["Salt"].image,
};

const _state = (state: MachineState) => state.context.state;

export const SkillCategoryList: React.FC<{
  onClick: (category: BumpkinRevampSkillTree) => void;
  skills: Skills;
  isEditing: boolean;
  hasChanges: boolean;
  validationError?: string;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onRemoveAllSkills: () => void;
  onApplyEditing: (paymentType: PaymentType) => void;
}> = ({
  onClick,
  skills: displayedSkills,
  isEditing,
  hasChanges,
  validationError,
  onStartEditing,
  onCancelEditing,
  onRemoveAllSkills,
  onApplyEditing,
}) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const [showEditSkillsModal, setShowEditSkillsModal] = useState(false);
  const [showApplyChangesConfirmation, setShowApplyChangesConfirmation] =
    useState(false);
  const [resetReferenceTime] = useState(() => Date.now());

  const { bumpkin, inventory } = state;
  const availableSkillPoints = isEditing
    ? getAvailableBumpkinSkillPointsForSkills(bumpkin, displayedSkills)
    : getAvailableBumpkinSkillPoints(bumpkin);
  const { previousFreeSkillResetAt = 0, paidSkillResets = 0, skills } = bumpkin;

  const hasSkills = getKeys(skills).length > 0;

  const getNextResetDateAndTime = () => {
    const nextResetTime =
      resetReferenceTime +
      getTimeUntilNextFreeReset(previousFreeSkillResetAt, resetReferenceTime);
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
  const hasTicket = inventory["Skill Reset Ticket"]?.gte(1) ?? false;
  const hasDisplayedSkills = getKeys(displayedSkills).length > 0;

  const resetType: PaymentType = canResetForFree(previousFreeSkillResetAt)
    ? "free"
    : hasTicket
      ? "ticket"
      : "gems";

  const editCostLabel =
    resetType === "free"
      ? t("skillEdit.cost.free")
      : resetType === "ticket"
        ? t("skillEdit.cost.ticket")
        : t("skillEdit.cost.gems", { gemCost });

  const canApplySkillChanges = () => {
    if (resetType === "free" && !canResetForFree(previousFreeSkillResetAt))
      return false;
    if (resetType === "ticket" && !hasTicket) return false;
    if (resetType === "gems" && !hasEnoughGems) return false;

    return true;
  };

  const handleStartEditing = () => {
    onStartEditing();
    setShowEditSkillsModal(false);
  };

  const handleCancelEditing = () => {
    onCancelEditing();
    setShowApplyChangesConfirmation(false);
  };

  const handleApplyEditing = () => {
    onApplyEditing(resetType);
    setShowApplyChangesConfirmation(false);
  };

  return (
    <>
      <InnerPanel className="flex flex-col h-full overflow-y-auto scrollable max-h-96">
        <div className="flex flex-row flex-wrap mt-2 mb-1 items-center gap-1">
          <Label type="default">{`${t("skillPts")} ${availableSkillPoints}`}</Label>
          {isEditing && (
            <>
              <Label type={validationError ? "danger" : "info"}>
                {validationError ?? t("skillEdit.draftSkillBuild")}
              </Label>
              {!hasChanges && (
                <Label type="warning">{t("skillEdit.noChanges")}</Label>
              )}
            </>
          )}
        </div>
        {ISLAND_EXPANSIONS.map((islandType) => {
          const hasUnlockedIslandCategory = hasRequiredIslandExpansion(
            state.island.type,
            islandType,
          );
          const categories = getRevampSkillTreeCategoriesByIsland(islandType);
          if (categories.length <= 0) return;

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
                {categories.map((category) => {
                  const skills = getRevampSkills(category);
                  const icon = SKILL_TREE_ICONS[skills[0].tree];
                  const skillsAcquiredInCategoryCount = getKeys({
                    ...displayedSkills,
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
                })}
              </div>
            </div>
          );
        })}
        <div className="flex flex-col m-1">
          <div className="flex flex-row items-center justify-between gap-3">
            {!isEditing ? (
              <p
                className="text-xs cursor-pointer underline py-1"
                onClick={() => setShowEditSkillsModal(true)}
              >
                {t("skillEdit.editSkills")}
              </p>
            ) : (
              <>
                <p
                  className={classNames("text-xs underline py-1", {
                    "cursor-pointer":
                      hasDisplayedSkills && !showApplyChangesConfirmation,
                    "opacity-50 cursor-not-allowed": !hasDisplayedSkills,
                  })}
                  onClick={
                    hasDisplayedSkills && !showApplyChangesConfirmation
                      ? onRemoveAllSkills
                      : undefined
                  }
                >
                  {t("skillEdit.removeAllSkills")}
                </p>
                <div className="flex flex-row items-center gap-3">
                  <p
                    className="text-xs cursor-pointer underline py-1"
                    onClick={handleCancelEditing}
                  >
                    {t("cancel")}
                  </p>
                  <p
                    className={classNames("text-xs underline py-1", {
                      "cursor-pointer": hasChanges && !validationError,
                      "opacity-50 cursor-not-allowed":
                        !hasChanges || !!validationError,
                    })}
                    onClick={
                      hasChanges && !validationError
                        ? () => setShowApplyChangesConfirmation(true)
                        : undefined
                    }
                  >
                    {t("skillEdit.applyChanges")}
                  </p>
                  <Label
                    type={
                      resetType === "free"
                        ? "success"
                        : resetType === "ticket"
                          ? "success"
                          : "vibrant"
                    }
                    icon={
                      resetType === "gems"
                        ? ITEM_DETAILS.Gem.image
                        : resetType === "ticket"
                          ? ITEM_DETAILS["Skill Reset Ticket"].image
                          : undefined
                    }
                  >
                    {editCostLabel}
                  </Label>
                </div>
              </>
            )}
          </div>
        </div>
      </InnerPanel>

      <Modal
        show={showEditSkillsModal}
        onHide={() => setShowEditSkillsModal(false)}
      >
        <OuterPanel>
          <InnerPanel className="flex flex-col items-center">
            <div className="flex flex-col items-center w-full gap-2 my-1">
              <Label type="default">{t("skillEdit.editSkills")}</Label>
              <p className="text-xs text-center">
                {t("skillEdit.description")}
              </p>
              {!hasSkills && (
                <Label type="danger">{t("skillEdit.cannotEditYet")}</Label>
              )}
              <Button
                className="w-full"
                disabled={!hasSkills}
                onClick={handleStartEditing}
              >
                {t("skillEdit.startEditing")}
              </Button>
            </div>
          </InnerPanel>
        </OuterPanel>
      </Modal>
      <Modal
        show={showApplyChangesConfirmation}
        onHide={() => setShowApplyChangesConfirmation(false)}
      >
        <OuterPanel>
          <InnerPanel className="flex flex-col items-center">
            <div className="flex flex-col items-center w-full gap-2 my-1">
              <Label type="default">{t("skillEdit.applyChanges")}</Label>
              <Label
                type={
                  resetType === "free"
                    ? "success"
                    : resetType === "ticket"
                      ? "success"
                      : "vibrant"
                }
                icon={
                  resetType === "gems"
                    ? ITEM_DETAILS.Gem.image
                    : resetType === "ticket"
                      ? ITEM_DETAILS["Skill Reset Ticket"].image
                      : undefined
                }
              >
                {editCostLabel}
              </Label>
              <p className="text-xs text-center">
                {t("skillEdit.applyConfirmation")}
              </p>
              {resetType === "free" ? (
                <Label type="warning">{t("skillReset.180Days")}</Label>
              ) : (
                <>
                  {resetType === "gems" && (
                    <Label type="warning">{t("skillReset.costDoubles")}</Label>
                  )}
                  <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                    {t("skillReset.nextFreeReset", {
                      date: getNextResetDateAndTime().date,
                      time: getNextResetDateAndTime().time,
                    })}
                  </Label>
                </>
              )}
              {!canApplySkillChanges() && (
                <Label type="danger">{t("skillEdit.cannotApplyChanges")}</Label>
              )}
              <div className="flex justify-between gap-2 w-full">
                <Button
                  className="w-full"
                  onClick={() => setShowApplyChangesConfirmation(false)}
                >
                  {t("cancel")}
                </Button>
                <Button
                  className="w-full"
                  onClick={handleApplyEditing}
                  disabled={
                    !hasChanges || !!validationError || !canApplySkillChanges()
                  }
                >
                  {t("confirm")}
                </Button>
              </div>
            </div>
          </InnerPanel>
        </OuterPanel>
      </Modal>
    </>
  );
};
