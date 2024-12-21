import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { OuterPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { SquareIcon } from "components/ui/SquareIcon";
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
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { millisecondsToString } from "lib/utils/time";
import React, { useContext, useState } from "react";

interface PowerSkillsProps {
  show: boolean;
  onHide: () => void;
}
export const PowerSkills: React.FC<PowerSkillsProps> = ({ show, onHide }) => {
  const { t } = useAppTranslation();
  return (
    <Modal show={show} onHide={onHide}>
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

const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _inventory = (state: MachineState) => state.context.state.inventory;
interface PowerSkillsContentProps {
  onClose: () => void;
}
const PowerSkillsContent: React.FC<PowerSkillsContentProps> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const bumpkin = useSelector(gameService, _bumpkin);
  const inventory = useSelector(gameService, _inventory);
  const { skills, previousPowerUseAt } = bumpkin;

  const powerSkills = getPowerSkills();
  const powerSkillsUnlocked = powerSkills.filter(
    (skill) => !!skills[skill.name as BumpkinRevampSkillName],
  );
  const [selectedSkill, setSelectedSkill] = useState<BumpkinSkillRevamp>(
    powerSkillsUnlocked[0],
  );
  const [useSkillConfirmation, setUseSkillConfirmation] = useState(false);
  const useSkill = () => {
    onClose();
    setUseSkillConfirmation(false);
    gameService.send("skill.used", { skill: selectedSkill?.name });
  };

  const { boosts, image, name, power, requirements } = selectedSkill;
  const { cooldown = 0, items } = requirements;
  const { buff, debuff } = boosts;

  const nextSkillUse =
    (previousPowerUseAt?.[selectedSkill.name as BumpkinRevampSkillName] ?? 0) +
    cooldown;
  const nextSkillUseCountdown = useCountdown(nextSkillUse);

  const powerSkillReady = nextSkillUse < Date.now();

  const itemsRequired =
    !items ||
    Object.entries(items).every(([item, quantity]) =>
      (inventory[item as InventoryItemName] ?? new Decimal(0)).gte(quantity),
    );

  return (
    <SplitScreenView
      panel={
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col h-full px-1 py-0">
            <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0 sm:py-0 py-2">
              <div className="sm:mt-2">
                <SquareIcon icon={image} width={14} />
              </div>
              <span className="sm:text-center">{name}</span>
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
            <div className="flex flex-col lg:items-center">
              <Label
                type={powerSkillReady ? "success" : "info"}
                icon={!powerSkillReady ? SUNNYSIDE.icons.stopwatch : undefined}
                secondaryIcon={
                  powerSkillReady ? SUNNYSIDE.icons.confirm : undefined
                }
                className="mb-2"
              >
                {powerSkillReady ? (
                  t("powerSkills.ready")
                ) : (
                  <div className="flex lg:flex-col items-center">
                    <p className="mr-1">{t("powerSkills.nextUse")}</p>
                    <TimerDisplay time={nextSkillUseCountdown} />
                  </div>
                )}
              </Label>
            </div>
          </div>

          {power && (
            <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
              <Button
                disabled={!powerSkillReady || !itemsRequired}
                onClick={() => setUseSkillConfirmation(true)}
              >
                {t("powerSkills.use")}
              </Button>
            </div>
          )}

          <ConfirmationModal
            show={useSkillConfirmation}
            onHide={() => setUseSkillConfirmation(false)}
            messages={[
              t("powerSkills.confirmationMessage", {
                skillName: name,
              }),
              t("powerSkills.cooldownMessage", {
                cooldown: millisecondsToString(cooldown, {
                  length: "short",
                  removeTrailingZeros: true,
                }),
              }),
            ]}
            onCancel={() => setUseSkillConfirmation(false)}
            onConfirm={useSkill}
            confirmButtonLabel={t("powerSkills.useSkill")}
          />
        </div>
      }
      content={
        <div className="pl-1">
          <div
            className="flex flex-row my-2 items-center"
            style={{ margin: `${PIXEL_SCALE * 2}px` }}
          >
            <Label type="default">{t("powerSkills.unlockedSkills")}</Label>
          </div>
          <div className="flex flex-wrap mb-2">
            {powerSkillsUnlocked.map((skill) => (
              <Box
                key={skill.name}
                className="mb-1"
                image={skill.image}
                isSelected={selectedSkill === skill}
                onClick={() => setSelectedSkill(skill)}
              >
                {skill.name}
              </Box>
            ))}
          </div>
        </div>
      }
    />
  );
};
