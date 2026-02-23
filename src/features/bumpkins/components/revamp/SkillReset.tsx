import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { OuterPanel, InnerPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { PaymentType } from "features/game/events/landExpansion/resetSkills";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

interface SkillResetProps {
  resetType: PaymentType;
  gemCost: number;
  gemBalance: Decimal;
  getNextResetDateAndTime: () => {
    date: string;
    time: string;
  };
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
  hasSkills,
  canResetSkills,
  handleSkillsReset,
  showSkillsResetConfirmation,
  setShowSkillsResetConfirmation,
}) => {
  const { t } = useAppTranslation();
  const { date, time } = getNextResetDateAndTime();
  return (
    <OuterPanel>
      <InnerPanel className="flex flex-col items-center">
        <div className="flex flex-col items-center w-full gap-2 my-1">
          <Label type="default">{t("skillReset.skillsReset")}</Label>

          <Label
            type={resetType === "free" ? "success" : "vibrant"}
            icon={resetType === "gems" ? ITEM_DETAILS.Gem.image : undefined}
          >
            {t(resetType === "free" ? "skillReset.free" : "skillReset.gems")}
          </Label>

          {resetType === "free" ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-center">
                {t("skillReset.freeDescription")}
              </p>
              <Label type="warning">{t("skillReset.180Days")}</Label>
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
                {t("skillReset.gemsDescription")}
              </p>
              <Label type="warning">{t("skillReset.costDoubles")}</Label>
              <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                {t("skillReset.nextFreeReset", { date, time })}
              </Label>
            </div>
          )}

          {!hasSkills && (
            <Label type="danger">{t("skillReset.noSkills")}</Label>
          )}

          {!showSkillsResetConfirmation ? (
            <Button
              onClick={() => setShowSkillsResetConfirmation(true)}
              disabled={!canResetSkills()}
            >
              {t("skillReset.resetSkills")}
            </Button>
          ) : (
            <div className="flex justify-between gap-2 w-full">
              <Button
                className="w-full"
                onClick={() => setShowSkillsResetConfirmation(false)}
              >
                {t("cancel")}
              </Button>
              <Button
                className="w-full"
                onClick={handleSkillsReset}
                disabled={!canResetSkills()}
              >
                {t("confirm")}
              </Button>
            </div>
          )}
        </div>
      </InnerPanel>
    </OuterPanel>
  );
};
