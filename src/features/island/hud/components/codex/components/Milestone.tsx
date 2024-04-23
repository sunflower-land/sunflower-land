import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";
import { ResizableBar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { GameState } from "features/game/types/game";

import chest from "assets/icons/chest.png";
import { Collapse } from "components/ui/Collapse";
import { Button } from "components/ui/Button";
import { Milestone as MilestoneDetail } from "features/game/types/milestones";
import { getKeys } from "features/game/types/craftables";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getImageUrl } from "lib/utils/getImageURLS";

export const MilestonePanel: React.FC<{
  milestone: MilestoneDetail;
  isExpanded: boolean;
  farmActivity: GameState["farmActivity"];
  onClick: () => void;
  onClaim: () => void;
}> = ({ milestone, farmActivity, isExpanded, onClick, onClaim }) => {
  const { t } = useAppTranslation();

  const percentageComplete = milestone.percentageComplete(farmActivity);

  // Currently only supporting one reward per milestone
  const reward = getKeys(milestone.reward)[0];

  // TODO: Support inventory items as rewards as well
  const buffLabel = BUMPKIN_ITEM_BUFF_LABELS[reward as BumpkinItem];

  return (
    <OuterPanel>
      <div
        className="flex p-0.5 justify-between cursor-pointer"
        onClick={onClick}
      >
        <>
          <div className="space-y-1">
            <p className="text-xxs mb-1">{milestone.task}</p>
            <div className="relative inline-block">
              <ResizableBar
                type="progress"
                outerDimensions={{
                  width: 60,
                  height: 7,
                }}
                percentage={percentageComplete}
              />
              <img
                src={chest}
                alt="Treasure Chest"
                style={{
                  width: "22px",
                  top: "-1px",
                  right: "-14px",
                }}
                className={classNames("absolute", {
                  ready: percentageComplete === 100,
                })}
              />
            </div>
          </div>
          <div
            className={classNames("flex items-center", {
              "transform rotate-180": isExpanded,
            })}
          >
            <img
              style={{
                width: `${PIXEL_SCALE * 8}px`,
              }}
              src={SUNNYSIDE.icons.indicator}
              alt="Collapse Controller"
            />
          </div>
        </>
      </div>
      <Collapse isExpanded={isExpanded} className="space-y-1">
        <div className="flex pt-1">
          <img
            src={getImageUrl(ITEM_IDS[reward as BumpkinItem])}
            className="w-1/3 rounded-md mr-2"
          />
          <div className="space-y-2">
            <p className="text-xs">{reward}</p>
            <div className="flex flex-col space-y-1">
              {buffLabel && (
                <Label
                  type={buffLabel.labelType}
                  icon={buffLabel.boostTypeIcon}
                  secondaryIcon={buffLabel.boostedItemIcon}
                >
                  {buffLabel.shortDescription}
                </Label>
              )}
              <Label type="default">{t("wearables")}</Label>
            </div>
          </div>
        </div>
        <Button onClick={onClaim} disabled={percentageComplete < 100}>
          <div className="flex items-center">
            <img src={chest} className="mr-1" />
            <span>{t("detail.Claim.Reward")}</span>
          </div>
        </Button>
      </Collapse>
    </OuterPanel>
  );
};
