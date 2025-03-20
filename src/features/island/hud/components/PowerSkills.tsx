import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { OuterPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { isReadyToHarvest } from "features/game/events/landExpansion/harvest";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import {
  BumpkinRevampSkillName,
  BumpkinSkillRevamp,
  getPowerSkills,
} from "features/game/types/bumpkinSkills";
import { InventoryItemName } from "features/game/types/game";
import { CROPS } from "features/game/types/crops";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import {
  INNER_CANVAS_WIDTH,
  SkillBox,
} from "features/bumpkins/components/revamp/SkillBox";
import { SkillSquareIcon } from "features/bumpkins/components/revamp/SkillSquareIcon";
import { getSkillImage } from "features/bumpkins/components/revamp/SkillPathDetails";
import tradeOffs from "src/assets/icons/tradeOffs.png";
import { powerSkillDisabledConditions } from "features/game/events/landExpansion/skillUsed";
import { getRelativeTime, millisecondsToString } from "lib/utils/time";

interface PowerSkillsProps {
  show: boolean;
  onHide: () => void;
}
export const PowerSkills: React.FC<PowerSkillsProps> = ({ show, onHide }) => {
  const { t } = useAppTranslation();
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <CloseButtonPanel
        onClose={onHide}
        container={OuterPanel}
        tabs={[
          {
            icon: SUNNYSIDE.icons.lightning,
            name: t("powerSkills.title"),
          },
        ]}
      >
        <PowerSkillsContent onClose={onHide} />
      </CloseButtonPanel>
    </Modal>
  );
};

const _state = (state: MachineState) => state.context.state;
interface PowerSkillsContentProps {
  onClose: () => void;
}
const PowerSkillsContent: React.FC<PowerSkillsContentProps> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { bumpkin, crops, fruitPatches, inventory } = state;
  const { skills, previousPowerUseAt } = bumpkin;

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

  const [useSkillConfirmation, setUseSkillConfirmation] = useState(false);

  const isCropFertiliserSkill =
    skillName === "Sprout Surge" || skillName === "Root Rocket";

  const isFruitFertiliserSkill = skillName === "Blend-tastic";

  const useSkill = () => {
    onClose();
    setUseSkillConfirmation(false);

    if (isCropFertiliserSkill) {
      Object.entries(crops).map(([id, cropPlot]) => {
        const readyToHarvest =
          !!cropPlot.crop &&
          isReadyToHarvest(
            Date.now(),
            cropPlot.crop,
            CROPS[cropPlot.crop.name],
          );
        if (!cropPlot.fertiliser && !readyToHarvest) {
          const state = gameService.send("plot.fertilised", {
            plotID: id,
            fertiliser:
              skillName === "Sprout Surge" ? "Sprout Mix" : "Rapid Root",
          });

          if (
            state.context.state.bumpkin?.activity?.["Crop Fertilised"] === 1
          ) {
            gameAnalytics.trackMilestone({
              event: "Tutorial:Fertilised:Completed",
            });
          }
        }
      });
    } else if (isFruitFertiliserSkill) {
      Object.entries(fruitPatches).map(([id, fruitPatch]) => {
        if (!fruitPatch.fertiliser) {
          gameService.send("fruitPatch.fertilised", {
            patchID: id,
            fertiliser: "Fruitful Blend",
          });
        }
      });
    } else {
      gameService.send("skill.used", { skill: skillName });
    }
  };

  const nextSkillUse = (previousPowerUseAt?.[skillName] ?? 0) + (cooldown ?? 0);

  const powerSkillReady = nextSkillUse < Date.now();

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
                  requirement={
                    new Decimal(
                      Object.values(crops).filter(
                        (plot) => !plot.fertiliser,
                      ).length,
                    )
                  }
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
                    time: getRelativeTime(nextSkillUse, "medium"),
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
                  {cooldown && (
                    // If power skill has a cooldown, show the cooldown
                    <Label
                      type="info"
                      icon={SUNNYSIDE.icons.stopwatch}
                      className="mb-2"
                    >
                      {t("skill.cooldown", {
                        cooldown: millisecondsToString(cooldown, {
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

          {power && (
            <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
              {useSkillConfirmation ? (
                <>
                  <Button
                    className="mr-1 sm:mr-0"
                    onClick={() => setUseSkillConfirmation(false)}
                  >
                    {t("cancel")}
                  </Button>
                  <Button disabled={disabled} onClick={useSkill}>
                    {t("powerSkills.use")}
                  </Button>
                </>
              ) : (
                <Button
                  disabled={disabled}
                  onClick={() => setUseSkillConfirmation(true)}
                >
                  {t("powerSkills.use")}
                </Button>
              )}
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
                        setUseSkillConfirmation(false);
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
                        setUseSkillConfirmation(false);
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
