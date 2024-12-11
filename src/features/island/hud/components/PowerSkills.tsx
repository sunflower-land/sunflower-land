import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { OuterPanel } from "components/ui/Panel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { SquareIcon } from "components/ui/SquareIcon";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  BumpkinRevampSkillName,
  BumpkinSkillRevamp,
  getPowerSkills,
} from "features/game/types/bumpkinSkills";
import { millisecondsToString } from "lib/utils/time";
import React, { useContext, useState } from "react";

interface PowerSkillsProps {
  show: boolean;
  onHide: () => void;
}
export const PowerSkills: React.FC<PowerSkillsProps> = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <CloseButtonPanel
        onClose={onHide}
        container={OuterPanel}
        tabs={[
          {
            icon: SUNNYSIDE.icons.player,
            name: "Power Skills",
          },
        ]}
      >
        <PowerSkillsContent onClose={onHide} />
      </CloseButtonPanel>
    </Modal>
  );
};

interface PowerSkillsContentProps {
  onClose: () => void;
}
const PowerSkillsContent: React.FC<PowerSkillsContentProps> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { bumpkin } = state;
  const { skills } = bumpkin;
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

  const { cooldown = 0 } = selectedSkill.requirements;

  const canUsePowerSkill =
    (bumpkin.previousPowerUseAt?.[
      selectedSkill.name as BumpkinRevampSkillName
    ] ?? 0) +
      cooldown <
    Date.now();
  return (
    <>
      {/* {powerSkillsUnlocked.map((skill, index) => {
        return <div key={index}>{skill.name}</div>;
      })} */}
      <SplitScreenView
        panel={
          <div className="flex flex-col h-full justify-between">
            {/* Header */}
            <div className="flex flex-col h-full px-1 py-0">
              <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0 sm:py-0 py-2">
                <div className="sm:mt-2">
                  <SquareIcon icon={selectedSkill.image} width={14} />
                </div>
                <span className="sm:text-center">{selectedSkill.name}</span>
              </div>
              <span className="text-xs mb-2 sm:mt-1 whitespace-pre-line sm:text-center py-2">
                {selectedSkill.boosts}
              </span>
            </div>

            {/* Claim/Claimed/Use Button */}
            <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
              {selectedSkill.power && (
                <Button
                  disabled={!canUsePowerSkill}
                  onClick={() => setUseSkillConfirmation(true)}
                >
                  {"Use"}
                </Button>
              )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
              show={useSkillConfirmation}
              onHide={() => setUseSkillConfirmation(false)}
              messages={[
                `Are you sure you want to use ${selectedSkill.name}?`,
                `You won't be able to use this skill again for ${millisecondsToString(selectedSkill.requirements.cooldown ?? 0, { length: "short", removeTrailingZeros: true })}`,
              ]}
              onCancel={() => setUseSkillConfirmation(false)}
              onConfirm={useSkill}
              confirmButtonLabel={"Use Skill"}
            />
          </div>
        }
        content={
          <div className="pl-1">
            <div
              className="flex flex-row my-2 items-center"
              style={{ margin: `${PIXEL_SCALE * 2}px` }}
            >
              <Label type="default">{"Unlocked Skills"}</Label>
            </div>
            <div className="flex flex-wrap mb-2">
              {powerSkillsUnlocked.map((skill) => {
                return (
                  <Box
                    key={skill.name}
                    className="mb-1"
                    image={skill.image}
                    isSelected={selectedSkill === skill}
                    onClick={() => setSelectedSkill(skill)}
                  >
                    {skill.name}
                  </Box>
                );
              })}
            </div>
          </div>
        }
      />
    </>
  );
};
