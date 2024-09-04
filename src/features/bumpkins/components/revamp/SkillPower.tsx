import React, { useContext, useRef, useState } from "react";
import {
  BumpkinSkillRevamp,
  getPowerSkills,
} from "features/game/types/bumpkinSkills";

import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";

// Component imports
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { SquareIcon } from "components/ui/SquareIcon";
import { ConfirmationModal } from "components/ui/ConfirmationModal";

// Function imports
//import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/choseSkill";
//import { gameAnalytics } from "lib/gameAnalytics";

// Icon imports
import { SUNNYSIDE } from "assets/sunnyside";
import { OuterPanel } from "components/ui/Panel";

interface Props {
  readonly: boolean;
  onBack: () => void;
}

export const SkillPower: React.FC<Props> = ({ readonly, onBack }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;
  const { bumpkin } = state;
  const divRef = useRef<HTMLDivElement>(null);
  const SKILLS = getPowerSkills();

  // States
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<BumpkinSkillRevamp>(
    SKILLS[0],
  );

  // Functions
  //const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);
  const hasSelectedSkill = !!bumpkin?.skills[selectedSkill?.name];
  const isInCooldown = false;
  const convertToHours = (timestamp?: number) => {
    if (!timestamp) return 0;
    return Math.ceil(timestamp / 3600 / 1000);
  };

  function getClaimedSkills() {
    return Object.values(SKILLS).filter((skill) => bumpkin?.skills[skill.name]);
  }

  function getUnclaimedSkills() {
    return Object.values(SKILLS).filter(
      (skill) => !bumpkin?.skills[skill.name],
    );
  }

  // Confirmation Modal
  const confirmationModal: React.ReactNode = (
    <ConfirmationModal
      show={showConfirmationModal}
      onHide={() => setShowConfirmationModal(false)}
      messages={[
        `Are you sure you want to use the power of ${selectedSkill?.name}?`,
        `This power will be available again in ${convertToHours(selectedSkill?.requirements.cooldown)} hours.`,
      ]}
      onCancel={() => setShowConfirmationModal(false)}
      onConfirm={() => setShowConfirmationModal(false)}
      confirmButtonLabel="Use Power"
      disabled={isInCooldown}
    />
  );

  return (
    <CloseButtonPanel
      onClose={onBack}
      tabs={[{ icon: SUNNYSIDE.icons.lightning, name: "Skill Powers" }]}
      container={OuterPanel}
    >
      <div className="min-h-fit">
        <SplitScreenView
          divRef={divRef}
          wideModal
          panel={
            <div className="flex flex-col h-full justify-between">
              {/* Header */}
              <div className="flex flex-col h-full px-1 py-0">
                <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse sm:my-0 my-2 md:space-x-0">
                  <div className="sm:mt-2">
                    <SquareIcon icon={selectedSkill.image} width={14} />
                  </div>
                  <span className="sm:text-center">{selectedSkill.name}</span>
                </div>
                <span className="text-xs mb-2 sm:mt-1 whitespace-pre-line sm:text-center py-2">
                  {selectedSkill.boosts}
                </span>
              </div>

              {/* Claim Button */}
              <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
                <Button
                  disabled={isInCooldown || readonly}
                  onClick={() => setShowConfirmationModal(true)}
                >
                  {hasSelectedSkill ? "Use" : "Claim"}
                </Button>
              </div>

              {/* Confirmation Modal */}
              {confirmationModal}
            </div>
          }
          content={
            <div className="pl-1">
              {/* Header */}
              <div
                className="flex flex-row my-2 items-center"
                style={{ margin: `${PIXEL_SCALE * 2}px` }}
              >
                <img
                  src={SUNNYSIDE.icons.arrow_left}
                  className="cursor-pointer"
                  alt="back"
                  style={{
                    width: `${PIXEL_SCALE * 11}px`,
                    marginRight: `${PIXEL_SCALE * 4}px`,
                  }}
                  onClick={onBack}
                />
                <Label type="default">{"Back"}</Label>
              </div>

              <div className="flex flex-col">
                <Label
                  type="default"
                  icon={SUNNYSIDE.icons.confirm}
                  className="ml-2"
                >
                  {"Claimed Skills"}
                </Label>
                <div className="flex flex-wrap mb-2">
                  {Object.values(getClaimedSkills()).map((skill) => (
                    <Box
                      key={skill.name}
                      className="m-1"
                      image={skill.image}
                      isSelected={selectedSkill === skill}
                      onClick={() => setSelectedSkill(skill)}
                      showOverlay={isInCooldown || readonly}
                      parentDivRef={divRef}
                      overlayIcon={
                        <img
                          src={SUNNYSIDE.icons.timer}
                          alt="Cooldown"
                          className="relative object-contain"
                          style={{
                            width: `${PIXEL_SCALE * 8}px`,
                            right: `${PIXEL_SCALE * -8}px`,
                            top: `${PIXEL_SCALE * -7}px`,
                          }}
                        />
                      }
                    >
                      {skill.name}
                    </Box>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <Label
                  type="warning"
                  icon={SUNNYSIDE.icons.lock}
                  className="ml-2"
                >
                  {"Locked Skills"}
                </Label>
                <div className="flex flex-wrap mb-2">
                  {Object.values(getUnclaimedSkills()).map((skill) => (
                    <Box
                      key={skill.name}
                      className="m-1"
                      image={skill.image}
                      isSelected={selectedSkill === skill}
                      onClick={() => setSelectedSkill(skill)}
                      parentDivRef={divRef}
                    >
                      {skill.name}
                    </Box>
                  ))}
                </div>
              </div>
            </div>
          }
        />
      </div>
    </CloseButtonPanel>
  );
};
