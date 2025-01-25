import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";

import chest from "assets/icons/chest.png";
import { Button } from "components/ui/Button";
import { Milestone as MilestoneDetail } from "features/game/types/milestones";
import { getKeys } from "features/game/types/craftables";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getImageUrl } from "lib/utils/getImageURLS";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ResizableBar } from "components/ui/ProgressBar";

import { getFishByType } from "../lib/utils";
import { FishName, MarineMarvelName } from "features/game/types/fishing";
import { pixelDarkBorderStyle } from "features/game/lib/style";

import TwilightAnglerfish from "assets/fish/twilight_anglerfish_trophy.png";
import StarlightTuna from "assets/fish/starlight_tuna_trophy.png";
import RadiantRay from "assets/fish/radiant_ray_trophy.png";
import PhantomBarracuda from "assets/fish/phantom_barracuda_trophy.png";
import GildedSwordfish from "assets/fish/gilded_swordfish_trophy.png";

export const MilestonePanel: React.FC<{
  milestone: MilestoneDetail;
  farmActivity: GameState["farmActivity"];
  onClaim: () => void;
  onBack: () => void;
  setSelectedFish: (fish: FishName | MarineMarvelName) => void;
  isClaimed?: boolean;
}> = ({
  milestone,
  farmActivity,
  onClaim,
  onBack,
  setSelectedFish,
  isClaimed,
}) => {
  const { t } = useAppTranslation();

  const percentageComplete = milestone.percentageComplete(farmActivity);

  // Currently only supporting one reward per milestone
  const reward = getKeys(milestone.reward)[0];

  // TODO: Support inventory items as rewards as well
  const buffLabel = BUMPKIN_ITEM_BUFF_LABELS[reward as BumpkinItem];

  const nonSeasonalMarvels = [
    TwilightAnglerfish,
    StarlightTuna,
    RadiantRay,
    PhantomBarracuda,
    GildedSwordfish,
  ];

  const FISH_BY_TYPE = getFishByType();

  return (
    <InnerPanel>
      <div
        className="flex items-center mt-1"
        style={{
          height: `${PIXEL_SCALE * 11}px`,
        }}
      >
        <img
          src={SUNNYSIDE.icons.arrow_left}
          className="cursor-pointer flex-none"
          onClick={onBack}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
        <p className="ml-2">{reward}</p>
      </div>
      <div className="flex pt-1 mb-1 mt-2">
        <img
          src={getImageUrl(ITEM_IDS[reward as BumpkinItem])}
          className="w-1/3 h-1/3 rounded-md mr-2 ml-0.5"
        />
        <div className="space-y-2 mr-1">
          <div className="flex flex-col space-y-1">
            {buffLabel && (
              <div className="flex flex-col gap-1">
                {buffLabel.map(
                  (
                    {
                      labelType,
                      boostTypeIcon,
                      boostedItemIcon,
                      shortDescription,
                    },
                    index,
                  ) => (
                    <Label
                      key={index}
                      type={labelType}
                      icon={boostTypeIcon}
                      secondaryIcon={boostedItemIcon}
                    >
                      {shortDescription}
                    </Label>
                  ),
                )}
              </div>
            )}
            <Label type="default">{t("wearable")}</Label>
          </div>

          <div>
            <p className="text-xxs mb-1">{milestone.task}</p>
            {reward === "Luminous Anglerfish Topper" && (
              <div className="flex items-center flex-wrap mb-2">
                {nonSeasonalMarvels.map((name) => (
                  <img
                    key={name}
                    src={name}
                    className="h-7 sm:h-8 mr-1 sm:mr-1.5 mt-0.5"
                  />
                ))}
              </div>
            )}
            {reward === "Sunflower Rod" && (
              <div className="flex items-center flex-wrap mb-1">
                {FISH_BY_TYPE["basic"].map((name) => (
                  <div className="relative" key={name}>
                    <div
                      className="flex justify-center w-8 sm:w-12 h-8 sm:h-12 m-1 p-0.5 bg-brown-600 cursor-pointer"
                      style={{ ...pixelDarkBorderStyle }}
                      onClick={() => setSelectedFish(name)}
                    >
                      <img
                        className={classNames({
                          silhouette: !farmActivity[`${name} Caught`],
                        })}
                        src={ITEM_DETAILS[name].image}
                      />
                      {farmActivity[`${name} Caught`] && (
                        <img
                          src={SUNNYSIDE.icons.confirm}
                          className="h-3 sm:h-5 absolute -top-0 -right-0 sm:-top-1 sm:-right-1"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {reward === "Fishing Hat" && (
              <div className="flex items-center flex-wrap mb-1">
                {FISH_BY_TYPE["advanced"].map((name) => (
                  <div className="relative" key={name}>
                    <div
                      className="flex justify-center w-8 sm:w-12 h-8 sm:h-12 m-1 p-0.5 bg-brown-600 cursor-pointer"
                      style={{ ...pixelDarkBorderStyle }}
                      onClick={() => setSelectedFish(name)}
                    >
                      <img
                        className={classNames({
                          silhouette: !farmActivity[`${name} Caught`],
                        })}
                        src={ITEM_DETAILS[name].image}
                      />
                      {farmActivity[`${name} Caught`] && (
                        <img
                          src={SUNNYSIDE.icons.confirm}
                          className="h-3 sm:h-5 absolute -top-0 -right-0 sm:-top-1 sm:-right-1"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="relative inline-block mt-1">
              <ResizableBar
                type="progress"
                outerDimensions={{
                  width: 57,
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
                  ready: percentageComplete === 100 && !isClaimed,
                })}
              />
            </div>
          </div>
        </div>
      </div>
      {!isClaimed && (
        <Button onClick={onClaim} disabled={percentageComplete < 100}>
          <div className="flex items-center">
            <img src={chest} className="mr-1" />
            <span>{t("detail.Claim.Reward")}</span>
          </div>
        </Button>
      )}
    </InnerPanel>
  );
};
