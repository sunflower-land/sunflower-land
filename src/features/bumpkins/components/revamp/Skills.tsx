import React, { useContext, useState } from "react";
import {
  type BumpkinSkillRevamp,
  type BumpkinRevampSkillTree,
  type BumpkinRevampSkillName,
  getRevampSkills,
} from "features/game/types/bumpkinSkills";

import { SkillCategoryList } from "./SkillCategoryList";
import {
  getSkillSelectionErrorMessage,
  SkillPathDetails,
} from "./SkillPathDetails";
import type { Skills as BumpkinSkills } from "features/game/types/game";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import { validateSkillSelection } from "features/game/events/landExpansion/choseSkill";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  readonly: boolean;
  // Signals draft-mode transitions so the host (BumpkinModal / its outer
  // Modal) can suppress dismiss handlers and prevent accidental loss of
  // unsaved skill edits.
  onEditingChange?: (editing: boolean) => void;
}

const _state = (state: MachineState) => state.context.state;

const getSkillKey = (skills: BumpkinSkills) =>
  Object.keys(skills)
    .filter((skill) => !!skills[skill as keyof BumpkinSkills])
    .sort()
    .join("|");

export const Skills: React.FC<Props> = ({ readonly, onEditingChange }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const [selectedSkillPath, setSelectedSkillPath] =
    useState<BumpkinRevampSkillTree | null>(null);
  const [skillsInPath, setSkillsInTree] = useState<BumpkinSkillRevamp[]>([]);
  const [draftSkills, setDraftSkills] = useState<BumpkinSkills | null>(null);

  const isEditing = !!draftSkills;
  const displayedSkills = draftSkills ?? state.bumpkin.skills;
  const hasChanges = isEditing
    ? getSkillKey(draftSkills) !== getSkillKey(state.bumpkin.skills)
    : false;

  const validationError = (() => {
    if (!draftSkills) return;

    try {
      validateSkillSelection({ state, skills: draftSkills });
    } catch (error) {
      return getSkillSelectionErrorMessage(error, t);
    }
  })();

  const onSkillCategoryClickHandler = (category: BumpkinRevampSkillTree) => {
    setSelectedSkillPath(category);

    const skillsInCategory: BumpkinSkillRevamp[] = getRevampSkills(category);

    setSkillsInTree(skillsInCategory);
  };

  const handleBackToSkillList = () => {
    setSelectedSkillPath(null);
  };

  const startEditing = () => {
    setDraftSkills({ ...state.bumpkin.skills });
    onEditingChange?.(true);
  };

  const cancelEditing = () => {
    setDraftSkills(null);
    onEditingChange?.(false);
  };

  const removeAllDraftSkills = () => {
    if (!draftSkills) return;

    setDraftSkills({});
  };

  const clearDraftSkillPath = () => {
    if (!draftSkills) return;

    setDraftSkills((current) => {
      if (!current) return current;

      const next = { ...current };

      skillsInPath.forEach(({ name }) => {
        delete next[name as keyof BumpkinSkills];
      });

      return next;
    });
  };

  const applyEditing = ({ useTicket }: { useTicket: boolean }) => {
    if (!draftSkills || validationError || !hasChanges) return;

    gameService.send("skills.updated", { skills: draftSkills, useTicket });
    setDraftSkills(null);
    onEditingChange?.(false);
  };

  const toggleDraftSkill = (skillName: BumpkinRevampSkillName) => {
    if (!draftSkills) return;

    setDraftSkills((current) => {
      if (!current) return current;

      const next = { ...current };

      if (next[skillName]) {
        delete next[skillName];
      } else {
        next[skillName] = 1;
      }

      return next;
    });
  };

  return (
    <div
      style={{
        minHeight: "200px",
        maxHeight: "calc(100vh - 200px)",
      }}
    >
      {!selectedSkillPath && (
        <SkillCategoryList
          onClick={(category) => onSkillCategoryClickHandler(category)}
          skills={displayedSkills}
          isEditing={isEditing}
          hasChanges={hasChanges}
          validationError={validationError}
          onStartEditing={startEditing}
          onCancelEditing={cancelEditing}
          onRemoveAllSkills={removeAllDraftSkills}
          onApplyEditing={applyEditing}
        />
      )}
      {selectedSkillPath && (
        <SkillPathDetails
          selectedSkillPath={selectedSkillPath}
          skillsInPath={skillsInPath}
          readonly={readonly}
          onBack={handleBackToSkillList}
          skills={displayedSkills}
          isEditing={isEditing}
          validationError={validationError}
          onToggleDraftSkill={toggleDraftSkill}
          onClearDraftSkillPath={clearDraftSkillPath}
        />
      )}
    </div>
  );
};
