import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { OuterPanel, InnerPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { PaymentType } from "features/game/events/landExpansion/resetSkills";
import { ITEM_DETAILS } from "features/game/types/images";
import React from "react";

interface SkillResetProps {
  resetType: PaymentType;
  gemCost: number;
  gemBalance: Decimal;
  getNextResetDateAndTime: () => {
    date: string;
    time: string;
  };
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
  gemBalance,
  getNextResetDateAndTime,
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
        <Label type="default">{`Skills Reset`}</Label>

        <Label
          type={resetType === "free" ? "success" : "vibrant"}
          icon={resetType === "gems" ? ITEM_DETAILS.Gem.image : undefined}
        >
          {resetType === "free" ? `Free Reset` : `Gem Reset`}
        </Label>

        {resetType === "free" ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-center">
              {`Reset all your skills for free.`}
            </p>
            <Label type="warning">
              {`You can do this once every 180 days.`}
            </Label>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <RequirementLabel
              type="item"
              item={"Gem"}
              balance={gemBalance}
              requirement={new Decimal(gemCost)}
            />
            <p className="text-xs text-center">
              {`Reset your skills immediately using gems.`}
            </p>
            <Label type="warning">
              {`Cost doubles with each use until next free reset.`}
            </Label>
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {`Next free reset on ${getNextResetDateAndTime().date} at ${getNextResetDateAndTime().time}`}
            </Label>
          </div>
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
