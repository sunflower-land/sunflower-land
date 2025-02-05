import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { OuterPanel, InnerPanel } from "components/ui/Panel";
import { PaymentType } from "features/game/events/landExpansion/resetSkills";
import { ITEM_DETAILS } from "features/game/types/images";
import React from "react";

interface SkillResetProps {
  resetType: PaymentType;
  gemCost: number;
  hasEnoughGems: boolean;
  getTimeUntilNextResetText: () => string;
  getCropMachineResetWarning: () => string | undefined;
  hasSkills: boolean;
  canResetSkills: () => boolean;
  handleSkillsReset: () => void;
  showSkillsResetConfirmation: boolean;
  setShowSkillsResetConfirmation: (show: boolean) => void;
}

export const SkillReset: React.FC<SkillResetProps> = ({
  resetType,
  gemCost,
  hasEnoughGems,
  getTimeUntilNextResetText,
  getCropMachineResetWarning,
  hasSkills,
  canResetSkills,
  handleSkillsReset,
  showSkillsResetConfirmation,
  setShowSkillsResetConfirmation,
}) => (
  <OuterPanel>
    <InnerPanel className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full gap-2 my-1">
        <Label type="warning">{`Skills Reset`}</Label>

        <Label type={resetType === "free" ? "success" : "vibrant"}>
          {resetType === "free" ? `Free Reset` : `Gem Reset`}
        </Label>

        {resetType === "free" ? (
          <p className="text-xs text-center">
            {`Reset all your skills for free. You can do this once every 6 months.`}
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

        {!hasSkills && <Label type="danger">{`No skills to reset`}</Label>}

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
);
