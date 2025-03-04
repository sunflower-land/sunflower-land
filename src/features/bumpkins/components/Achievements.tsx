import React, { useContext, useEffect, useState } from "react";

import { Context } from "features/game/GameProvider";
import {
  AchievementName,
  ACHIEVEMENTS,
} from "features/game/types/achievements";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import classNames from "classnames";
import { AchievementDetails } from "./AchievementDetails";
import Decimal from "decimal.js-light";
import { shortenCount } from "lib/utils/formatNumber";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { setImageWidth } from "lib/images";
import { ResizableBar } from "components/ui/ProgressBar";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";

const CONTENT_HEIGHT = 350;
interface Props {
  onBack: () => void;
  onClose: () => void;
  readonly: boolean;
}

const _state = (state: MachineState) => state.context.state;

export const Achievements: React.FC<Props> = ({ onBack, readonly }) => {
  const [selected, setSelected] = useState<AchievementName>("Farm Hand");

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { bumpkin } = state;

  const achievements = ACHIEVEMENTS();

  useEffect(() => {
    const bumpkinAchievements = bumpkin?.achievements || {};
    const achievementKeys = getKeys(achievements).filter((achievement) => {
      const item = ACHIEVEMENTS()[achievement];
      return item.rewards || item.coins > 0;
    });

    const firstUnclaimedAchievementName = achievementKeys.find((name) => {
      const achievement = achievements[name];
      const progress = achievement.progress(state);
      const isComplete = progress >= achievement.requirement;
      const isAlreadyClaimed = !!bumpkinAchievements[name];

      return isComplete && !isAlreadyClaimed;
    });

    const defaultSelectedAchievement =
      firstUnclaimedAchievementName ?? achievementKeys[0];

    setSelected(defaultSelectedAchievement);
  }, []);

  const claim = () => {
    gameService.send("achievement.claimed", {
      achievement: selected,
    });
  };

  return (
    <>
      <div
        style={{
          minHeight: "200px",
        }}
      >
        <AchievementDetails
          name={selected as AchievementName}
          onBack={onBack}
          onClaim={claim}
          state={state}
          readonly={readonly}
        />
      </div>
      <div className="w-full mt-2">
        <div
          style={{ maxHeight: CONTENT_HEIGHT }}
          className="overflow-y-auto scrollable flex flex-wrap pt-1"
        >
          {getKeys(achievements)
            .filter((achievement) => {
              const item = ACHIEVEMENTS()[achievement];
              return item.rewards || item.coins > 0;
            })
            .map((name) => {
              const achievement = achievements[name];

              const progress = achievement.progress(state);
              const isComplete = progress >= achievement.requirement;
              const isAlreadyClaimed = !!(bumpkin?.achievements ?? {})[name];

              return (
                <div
                  className="flex flex-col items-center mb-1 w-1/3 sm:w-1/4"
                  key={name}
                >
                  {/* Achievement icon */}
                  <div
                    style={{
                      width: `${PIXEL_SCALE * 22}px`,
                      height: `${PIXEL_SCALE * 23}px`,
                    }}
                    onClick={() => setSelected(name)}
                    className={classNames(
                      "flex justify-center items-center p-1 rounded-md relative cursor-pointer hover:img-highlight",
                      {
                        "opacity-50": !isAlreadyClaimed && !isComplete,
                        "img-highlight": selected === name,
                      },
                    )}
                  >
                    <img
                      src={SUNNYSIDE.icons.disc}
                      className="absolute"
                      style={{
                        width: `${PIXEL_SCALE * 22}px`,
                      }}
                    />
                    <img
                      src={
                        ITEM_DETAILS[name].image ??
                        SUNNYSIDE.icons.expression_confused
                      }
                      className="absolute"
                      style={{
                        opacity: 0,
                        marginBottom: `${PIXEL_SCALE * 0.5}px`,
                      }}
                      onLoad={(e) => setImageWidth(e.currentTarget)}
                    />
                  </div>

                  {/* Achievement indicator */}
                  <div
                    className="h-12 cursor-pointer"
                    onClick={() => setSelected(name)}
                  >
                    {/* Ready to claim */}
                    {isComplete && !isAlreadyClaimed && (
                      <div className="flex flex-1 mt-1.5 text-xs flex-wrap justify-center">
                        <img
                          src={SUNNYSIDE.icons.expression_alerted}
                          style={{
                            width: `${PIXEL_SCALE * 4}px`,
                          }}
                        />
                      </div>
                    )}

                    {/* Claimed */}
                    {isAlreadyClaimed && (
                      <div className="flex flex-1 mt-1.5 text-xs flex-wrap justify-center">
                        <img
                          src={SUNNYSIDE.icons.confirm}
                          style={{
                            width: `${PIXEL_SCALE * 12}px`,
                          }}
                        />
                      </div>
                    )}

                    {/* In progress */}
                    {!isComplete && !isAlreadyClaimed && (
                      <div className="flex flex-col flex-1 mt-1.5 items-center justify-center">
                        <p className="mb-1 text-xxs text-center">{`${shortenCount(
                          new Decimal(progress),
                        )}/${shortenCount(
                          new Decimal(achievement.requirement),
                        )}`}</p>
                        <ResizableBar
                          percentage={
                            (progress / achievement.requirement) * 100
                          }
                          type="progress"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export const AchievementsModal: React.FC<Props> = ({
  onBack,
  onClose,
  readonly,
}) => {
  const [tab, setTab] = useState(0);
  const { t } = useAppTranslation();
  return (
    <CloseButtonPanel
      currentTab={tab}
      setCurrentTab={setTab}
      tabs={[{ icon: SUNNYSIDE.icons.player, name: t("achievements") }]}
      onClose={onClose}
    >
      {/* @note: There is only one tab, no extra judgment is needed. */}
      <Achievements onBack={onBack} onClose={onClose} readonly={readonly} />
    </CloseButtonPanel>
  );
};
