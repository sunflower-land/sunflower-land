import React from "react";

import coins from "assets/icons/coins.webp";

import {
  AchievementName,
  ACHIEVEMENTS,
} from "features/game/types/achievements";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { GameState } from "features/game/types/game";
import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { setImageWidth } from "lib/images";
import Decimal from "decimal.js-light";
import { setPrecision } from "lib/utils/formatNumber";
import { SUNNYSIDE } from "assets/sunnyside";
import { ResizableBar } from "components/ui/ProgressBar";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onBack: () => void;
  onClaim: () => void;
  name: AchievementName;
  state: GameState;
  readonly: boolean;
}

export const AchievementDetails: React.FC<Props> = ({
  onBack,
  onClaim,
  name,
  state,
}) => {
  const achievement = ACHIEVEMENTS()[name];
  const progress = achievement.progress(state);
  const isComplete = progress >= achievement.requirement;

  const bumpkinAchievements = state.bumpkin?.achievements || {};
  const isAlreadyClaimed = !!bumpkinAchievements[name];
  const progressPercentage =
    Math.min(1, progress / achievement.requirement) * 100;
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col items-center">
      <InnerPanel className="relative flex-1 w-full flex flex-col justify-between items-center">
        <div className="flex flex-col justify-center items-center p-2 relative w-full">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="absolute self-start cursor-pointer"
            style={{
              top: `${PIXEL_SCALE * 2}px`,
              left: `${PIXEL_SCALE * 2}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
            alt="back"
            onClick={onBack}
          />
          <>
            <div className="flex flex-col mb-1 items-center w-full">
              <div className="ml-5 flex mb-1 items-center">
                <span className="text-center text-sm sm:text-base mr-2">
                  {name}
                </span>
                <img
                  src={ITEM_DETAILS[name].image}
                  style={{
                    opacity: 0,
                    marginRight: `${PIXEL_SCALE * 2}px`,
                    marginBottom: `${PIXEL_SCALE * 2}px`,
                  }}
                  onLoad={(e) => setImageWidth(e.currentTarget)}
                />
              </div>
              <div className="flex flex-col items-center justify-center w-full">
                <div className="flex-1 mt-2 sm:text-xs flex-wrap justify-center items-center text-center w-full">
                  <p className="text-xs mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-center border-t border-white pt-1 w-full">
                    {!isAlreadyClaimed && (
                      <div className="flex items-center mt-2 mb-1">
                        <ResizableBar
                          percentage={progressPercentage}
                          type="progress"
                          outerDimensions={{
                            width: 80,
                            height: 10,
                          }}
                        />
                        <span className="text-xxs ml-2">{`${setPrecision(
                          new Decimal(progress)
                        )}/${achievement.requirement}`}</span>
                      </div>
                    )}
                    {isAlreadyClaimed && (
                      <div className="flex items-center mt-2 mb-1">
                        <span className="w-auto -mt-2 mb-1 bg-blue-600 border text-xxs p-1 rounded-md">
                          {t("alr.claim")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {!isAlreadyClaimed && (
              <div className="w-full">
                <div className={classNames("flex flex-col items-center", {})}>
                  {achievement.coins > 0 && (
                    <div className={classNames("flex items-center mt-1", {})}>
                      <img
                        src={coins}
                        style={{
                          width: `${PIXEL_SCALE * 10}px`,
                          marginRight: `${PIXEL_SCALE * 4}px`,
                        }}
                      />
                      <span className="text-xs">{`${achievement.coins} coins`}</span>
                    </div>
                  )}
                  {getKeys(achievement.rewards || {}).map((name) => {
                    const amount =
                      achievement.rewards?.[name] || new Decimal(0);
                    const rewardAmount = amount.gt(1) ? `(${amount})` : "";

                    return (
                      <div key={name} className="flex items-center mt-1">
                        <img
                          src={ITEM_DETAILS[name].image}
                          style={{
                            opacity: 0,
                            marginRight: `${PIXEL_SCALE * 4}px`,
                          }}
                          onLoad={(e) => setImageWidth(e.currentTarget)}
                        />
                        <span className="text-xs">{`${name} ${rewardAmount}`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        </div>
        {!isAlreadyClaimed && (
          <Button className="text-xs" onClick={onClaim} disabled={!isComplete}>
            <span>{t("claim")}</span>
          </Button>
        )}
      </InnerPanel>
    </div>
  );
};
