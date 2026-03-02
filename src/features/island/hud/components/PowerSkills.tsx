import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import {
  BumpkinRevampSkillName,
  BumpkinSkillRevamp,
  getPowerSkills,
} from "features/game/types/bumpkinSkills";
import { InventoryItemName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import {
  INNER_CANVAS_WIDTH,
  SkillBox,
} from "features/bumpkins/components/revamp/SkillBox";
import { SkillSquareIcon } from "features/bumpkins/components/revamp/SkillSquareIcon";
import { getSkillImage } from "features/bumpkins/components/revamp/SkillPathDetails";
import tradeOffs from "src/assets/icons/tradeOffs.png";
import {
  getSkillCooldown,
  powerSkillDisabledConditions,
} from "features/game/events/landExpansion/skillUsed";
import { getPlotsToFertilise } from "features/game/events/landExpansion/bulkFertilisePlot";
import { getRelativeTime, millisecondsToString } from "lib/utils/time";
import { ConfirmButton } from "components/ui/ConfirmButton";
import { useNow } from "lib/utils/hooks/useNow";

interface PowerSkillsProps {
  onHide: () => void;
  onBack: () => void;
  readonly: boolean;
}
export const PowerSkills: React.FC<PowerSkillsProps> = ({
  onHide,
  onBack,
  readonly,
}) => {
  const { t } = useAppTranslation();
  return (
    <CloseButtonPanel
      onClose={onHide}
      container={OuterPanel}
      tabs={[
        {
          id: "powerSkills",
          icon: SUNNYSIDE.icons.lightning,
          name: t("powerSkills.title"),
        },
      ]}
    >
      <PowerSkillsContent onBack={onBack} readonly={readonly} />
    </CloseButtonPanel>
  );
};

const _state = (state: MachineState) => state.context.state;

const PowerSkillsContent: React.FC<{
  onBack: () => void;
  readonly: boolean;
}> = ({ onBack, readonly }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { bumpkin, fruitPatches, inventory } = state;
  const { skills, previousPowerUseAt } = bumpkin;
  const now = useNow();

  const powerSkills = getPowerSkills();
  const powerSkillsUnlocked = powerSkills.filter(
    (skill) => !!skills[skill.name as BumpkinRevampSkillName],
  );
  const [fertiliserSkill, nonFertiliserSkill] = powerSkillsUnlocked.reduce(
    (acc, skill) => {
      const isFertilizer = [
        "Sprout Surge",
        "Root Rocket",
        "Blend-tastic",
      ].includes(skill.name);
      acc[isFertilizer ? 0 : 1].push(skill);
      return acc;
    },
    [[], []] as [BumpkinSkillRevamp[], BumpkinSkillRevamp[]],
  );

  const [selectedSkill, setSelectedSkill] = useState<BumpkinSkillRevamp>(
    powerSkillsUnlocked[0],
  );

  const {
    boosts,
    image,
    name: skillName,
    power,
    requirements,
    npc,
    tree,
  } = selectedSkill as { name: BumpkinRevampSkillName } & BumpkinSkillRevamp;
  const { cooldown, items, tier } = requirements;
  const { buff, debuff } = boosts;

  const isCropFertiliserSkill =
    skillName === "Sprout Surge" || skillName === "Root Rocket";

  const isFruitFertiliserSkill = skillName === "Blend-tastic";

  const cropFertiliseEligible = isCropFertiliserSkill
    ? getPlotsToFertilise(state, now)
    : [];

  const useSkill = () => {
    if (isCropFertiliserSkill) {
      gameService.send({
        type: "plots.bulkFertilised",
        fertiliser: skillName === "Sprout Surge" ? "Sprout Mix" : "Rapid Root",
      });

      return;
    }

    if (isFruitFertiliserSkill) {
      Object.entries(fruitPatches).map(([id, fruitPatch]) => {
        if (!fruitPatch.fertiliser) {
          gameService.send({
            type: "fruitPatch.fertilised",
            patchID: id,
            fertiliser: "Fruitful Blend",
          });
        }
      });

      return;
    }

    gameService.send({ type: "skill.used", skill: skillName });
  };

  const boostedCooldown = getSkillCooldown({ cooldown: cooldown ?? 0, state });

  const nextSkillUse = (previousPowerUseAt?.[skillName] ?? 0) + boostedCooldown;
  const powerSkillReady = nextSkillUse < now;

  const { disabled, reason } = powerSkillDisabledConditions({
    state,
    skillTree: selectedSkill,
  });

  return (
    <SplitScreenView
      wideModal
      panel={
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col h-full px-1 py-0">
            <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0 sm:py-0 py-2">
              <img
                src={SUNNYSIDE.icons.arrow_left}
                className="cursor-pointer block sm:hidden"
                alt="back"
                style={{
                  width: `${PIXEL_SCALE * 11}px`,
                  marginRight: `${PIXEL_SCALE * 1}px`,
                }}
                onClick={onBack}
              />
              <div className="sm:mt-2">
                <SkillSquareIcon
                  icon={getSkillImage(image, buff.boostedItemIcon, tree)}
                  width={INNER_CANVAS_WIDTH}
                  tier={tier}
                  npc={npc}
                />
              </div>
              <span className="sm:text-center">{skillName}</span>
            </div>
            <div className="flex flex-col items-start mt-2">
              {buff && (
                <Label
                  type={buff.labelType}
                  icon={buff.boostTypeIcon}
                  secondaryIcon={buff.boostedItemIcon}
                  className="mb-2"
                >
                  {buff.shortDescription}
                </Label>
              )}
              {debuff && (
                <Label
                  type={debuff.labelType}
                  icon={debuff.boostTypeIcon}
                  secondaryIcon={debuff.boostedItemIcon}
                  className="mb-2"
                >
                  {debuff.shortDescription}
                </Label>
              )}
            </div>
            {items && (
              <div className="flex flex-col items-center mb-2">
                {Object.entries(items).map(([name, amount]) => (
                  <RequirementLabel
                    key={name}
                    type="item"
                    requirement={amount}
                    item={name as InventoryItemName}
                    balance={
                      inventory[name as InventoryItemName] ?? new Decimal(0)
                    }
                  />
                ))}
              </div>
            )}
            {isCropFertiliserSkill && (
              <div className="flex flex-col items-center mb-2">
                <RequirementLabel
                  type="item"
                  requirement={new Decimal(cropFertiliseEligible.length)}
                  item={
                    skillName === "Sprout Surge" ? "Sprout Mix" : "Rapid Root"
                  }
                  balance={
                    inventory[
                      skillName === "Sprout Surge" ? "Sprout Mix" : "Rapid Root"
                    ] ?? new Decimal(0)
                  }
                />
              </div>
            )}
            {isFruitFertiliserSkill && (
              <div className="flex flex-col items-center mb-2">
                <RequirementLabel
                  type="item"
                  requirement={
                    new Decimal(
                      Object.values(fruitPatches).filter(
                        (patch) => !patch.fertiliser,
                      ).length,
                    )
                  }
                  item={"Fruitful Blend"}
                  balance={inventory["Fruitful Blend"] ?? new Decimal(0)}
                />
              </div>
            )}
            <div className="flex flex-wrap justify-between gap-x-2 sm:flex-col lg:items-center">
              {!powerSkillReady ? (
                // If power skill is not ready, show the next use time
                <Label
                  type="info"
                  icon={SUNNYSIDE.icons.stopwatch}
                  className="mb-2"
                >
                  {t("powerSkills.nextUse", {
                    time: getRelativeTime(nextSkillUse, now, "medium"),
                  })}
                </Label>
              ) : (
                <>
                  {disabled ? (
                    // If power skill is disabled, show the reason if it exists
                    reason && (
                      <Label type="danger" className="mb-2">
                        {reason}
                      </Label>
                    )
                  ) : (
                    // If power skill is not disabled, show the ready label
                    <Label
                      type="success"
                      secondaryIcon={SUNNYSIDE.icons.confirm}
                      className="mb-2"
                    >
                      {t("powerSkills.ready")}
                    </Label>
                  )}
                  {!!boostedCooldown && (
                    // If power skill has a cooldown, show the cooldown
                    <Label
                      type="info"
                      icon={SUNNYSIDE.icons.stopwatch}
                      className="mb-2"
                    >
                      {t("skill.cooldown", {
                        cooldown: millisecondsToString(boostedCooldown, {
                          length: "short",
                          isShortFormat: true,
                          removeTrailingZeros: true,
                        }),
                      })}
                    </Label>
                  )}
                </>
              )}
            </div>
          </div>

          {power && !readonly && (
            <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
              <ConfirmButton
                onConfirm={useSkill}
                confirmLabel={t("powerSkills.use")}
                disabled={disabled}
                divClassName="flex-row sm:flex-col"
              >
                {t("powerSkills.use")}
              </ConfirmButton>
            </div>
          )}
        </div>
      }
      content={
        <div className="pl-1">
          {nonFertiliserSkill.length > 0 && (
            <>
              <div
                className="flex flex-row my-2 items-center"
                style={{ margin: `${PIXEL_SCALE * 2}px` }}
              >
                <img
                  src={SUNNYSIDE.icons.arrow_left}
                  className="cursor-pointer hidden sm:block"
                  alt="back"
                  style={{
                    width: `${PIXEL_SCALE * 11}px`,
                    marginRight: `${PIXEL_SCALE * 4}px`,
                  }}
                  onClick={onBack}
                />
                <Label type="default">{t("powerSkills.title")}</Label>
              </div>
              <div className="flex flex-wrap mb-2">
                {nonFertiliserSkill.map((skill: BumpkinSkillRevamp) => {
                  const {
                    name,
                    image,
                    tree,
                    npc,
                    power,
                    boosts,
                    requirements,
                  } = skill;
                  const { boostTypeIcon, boostedItemIcon } = boosts.buff;
                  return (
                    <SkillBox
                      key={name}
                      className="mb-1"
                      image={getSkillImage(image, boostedItemIcon, tree)}
                      isSelected={selectedSkill === skill}
                      onClick={() => {
                        setSelectedSkill(skill);
                      }}
                      tier={requirements.tier}
                      npc={npc}
                      secondaryImage={
                        boosts.debuff
                          ? tradeOffs
                          : power
                            ? SUNNYSIDE.icons.lightning
                            : boostTypeIcon
                      }
                    />
                  );
                })}
              </div>
            </>
          )}
          {fertiliserSkill.length > 0 && (
            <>
              <div
                className="flex flex-row my-2 items-center"
                style={{ margin: `${PIXEL_SCALE * 2}px` }}
              >
                {nonFertiliserSkill.length <= 0 && (
                  <img
                    src={SUNNYSIDE.icons.arrow_left}
                    className="cursor-pointer hidden sm:block"
                    alt="back"
                    style={{
                      width: `${PIXEL_SCALE * 11}px`,
                      marginRight: `${PIXEL_SCALE * 4}px`,
                    }}
                    onClick={onBack}
                  />
                )}
                <Label type="default">{t("powerSkills.fertiliser")}</Label>
              </div>
              <div className="flex flex-wrap mb-2">
                {fertiliserSkill.map((skill: BumpkinSkillRevamp) => {
                  const {
                    name,
                    image,
                    tree,
                    npc,
                    power,
                    boosts,
                    requirements,
                  } = skill;
                  const { boostTypeIcon, boostedItemIcon } = boosts.buff;
                  return (
                    <SkillBox
                      key={name}
                      className="mb-1"
                      image={getSkillImage(image, boostedItemIcon, tree)}
                      isSelected={selectedSkill === skill}
                      onClick={() => {
                        setSelectedSkill(skill);
                      }}
                      tier={requirements.tier}
                      npc={npc}
                      secondaryImage={
                        boosts.debuff
                          ? tradeOffs
                          : power
                            ? SUNNYSIDE.icons.lightning
                            : boostTypeIcon
                      }
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      }
    />
  );
};
