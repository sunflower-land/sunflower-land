import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { Skills } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  getAvailableBumpkinSkillPoints,
  getAvailableBumpkinSkillPointsForSkills,
  getPointsRemoved,
} from "features/game/events/landExpansion/choseSkill";
import {
  MAX_FREE_POINTS,
  REGEN_MS,
  getEffectiveFreeSkillPoints,
  getSkillEditCost,
} from "features/game/events/landExpansion/chargeSkillEdit";
import { useNow } from "lib/utils/hooks/useNow";

interface Props {
  // The skills the player is staging (drafts in edit mode, real otherwise).
  displayedSkills: Skills;
  isEditing: boolean;
  validationError?: string;
}

const getSkillKey = (skills: Skills) =>
  Object.keys(skills)
    .filter((skill) => !!skills[skill as keyof Skills])
    .sort()
    .join("|");

const _state = (state: MachineState) => state.context.state;

// Shared header chip row for the EDIT_SKILLSET cohort. Rendered above the
// category grid (SkillCategoryList) and above each path detail
// (SkillPathDetails) so the player keeps cost + draft context as they
// navigate between views.
export const SkillsEditHeader: React.FC<Props> = ({
  displayedSkills,
  isEditing,
  validationError,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { bumpkin } = state;

  // Anchor for the live regen countdown — auto-stops at the boundary so the
  // header doesn't keep re-rendering. Pre-migration saves have no anchor
  // yet; in that case run useNow live without an end (rare and short-lived).
  const nextRegenAnchor =
    bumpkin.lastFreeSkillPointsRegenAt != null
      ? bumpkin.lastFreeSkillPointsRegenAt + REGEN_MS
      : undefined;
  const now = useNow({ live: true, autoEndAt: nextRegenAnchor });
  const { balance: freeSkillPoints } = getEffectiveFreeSkillPoints(
    bumpkin,
    now,
  );

  const availableSkillPoints = isEditing
    ? getAvailableBumpkinSkillPointsForSkills(bumpkin, displayedSkills)
    : getAvailableBumpkinSkillPoints(bumpkin);

  // Only the draft diff drives the cost preview. Outside edit mode the player
  // is not removing anything, so the free-balance label stays at the live
  // (regen-aware) value.
  const pointsRemoved = isEditing
    ? getPointsRemoved(bumpkin.skills, displayedSkills)
    : 0;
  const { gemCost, freePointsConsumed } = getSkillEditCost(
    pointsRemoved,
    freeSkillPoints,
  );
  const projectedFreeBalance = freeSkillPoints - freePointsConsumed;

  const hasChanges =
    isEditing && getSkillKey(displayedSkills) !== getSkillKey(bumpkin.skills);

  return (
    <div className="flex flex-row flex-wrap items-center gap-1">
      <Label type="default">{`${t("skillPts")} ${availableSkillPoints}`}</Label>
      {isEditing && projectedFreeBalance > 0 && (
        <Label type="success">
          {t("skillEdit.freeBalance", {
            balance: projectedFreeBalance,
            cap: MAX_FREE_POINTS,
          })}
        </Label>
      )}
      {isEditing && gemCost > 0 && (
        <Label type="vibrant" icon={ITEM_DETAILS.Gem.image}>
          {t("skillEdit.cost.gems", { gemCost })}
        </Label>
      )}
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
  );
};
