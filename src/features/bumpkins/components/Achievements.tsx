import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";
import { Context } from "features/game/GameProvider";
import {
  AchievementName,
  ACHIEVEMENTS,
} from "features/game/types/achievements";
import { getKeys } from "features/game/types/craftables";
import { getUnclaimedAchievementNames } from "features/game/events/landExpansion/claimAchievement";
import { AchievementIcon } from "./AchievementIcon";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { AchievementDetails } from "components/ui/layouts/AchievementDetails";
import { Button } from "components/ui/Button";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import token from "assets/icons/token_2.png";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  onBack: () => void;
}

export const Achievements: React.FC<Props> = ({ onBack }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { setToast } = useContext(ToastContext);

  const firstUnclaimedAchievementName = getUnclaimedAchievementNames(state);

  const achievements = getKeys(ACHIEVEMENTS());
  const defaultSelectedAchievement =
    firstUnclaimedAchievementName[0] ?? achievements[0];
  const [selected, setSelected] = useState<AchievementName>(
    defaultSelectedAchievement
  );

  const claimedAchievements = getKeys(state.bumpkin?.achievements ?? {});

  const achievement = ACHIEVEMENTS()[selected];
  const progress = achievement.progress(state);
  const isComplete = progress >= achievement.requirement;
  const isVisiting = gameService.state.matches("visiting");
  const bumpkinAchievements = state.bumpkin?.achievements || {};
  const isAlreadyClaimed = !!bumpkinAchievements[selected];

  const onClaim = () => {
    gameService.send("achievement.claimed", {
      achievement: selected,
    });
    if (achievement.sfl?.greaterThan(0)) {
      setToast({
        icon: token,
        content: `+${achievement.sfl}`,
      });
    }
    getKeys(achievement.rewards || {}).map((reward) => {
      const item = ITEM_DETAILS[reward];
      setToast({
        icon: item.image,
        content: `+${achievement.rewards?.[reward]}`,
      });
    });
  };

  const backNavigationView = (
    <div
      className="flex flex-wrap space-x-2 space-y-2 items-center justify-start"
      style={{
        margin: `${PIXEL_SCALE * 2}px`,
        marginTop: "0px",
        marginRight: "0px",
      }}
    >
      <img
        src={SUNNYSIDE.icons.arrow_left}
        className="cursor-pointer"
        alt="back"
        style={{
          width: `${PIXEL_SCALE * 11}px`,
          marginTop: `${PIXEL_SCALE * 2.5}px`,
        }}
        onClick={onBack}
      />
      <Label
        type={
          claimedAchievements.length === achievements.length
            ? "success"
            : "info"
        }
      >{`Claimed: ${claimedAchievements.length}/${achievements.length}`}</Label>
    </div>
  );

  return (
    <>
      <div className="sm:hidden">{backNavigationView}</div>
      <SplitScreenView
        tallMobileContent={isVisiting || isAlreadyClaimed}
        contentScrollable={false}
        header={
          <AchievementDetails
            gameState={state}
            details={{
              achievement: selected as AchievementName,
            }}
            showRewards={!isVisiting && !isAlreadyClaimed}
            actionView={
              <>
                {!isVisiting && (
                  <>
                    {isAlreadyClaimed ? (
                      <div className="flex w-full items-center justify-center">
                        <Label type="success" className="my-1">
                          Claimed!
                        </Label>
                      </div>
                    ) : (
                      <Button
                        className="text-xs"
                        onClick={onClaim}
                        disabled={!isComplete}
                      >
                        <span>Claim</span>
                      </Button>
                    )}
                  </>
                )}
              </>
            }
          />
        }
        content={
          <>
            <div className="hidden sm:block w-full -ml-1 -mt-2">
              {backNavigationView}
            </div>
            <div className="overflow-y-auto scrollable overflow-x-hidden flex flex-wrap">
              {achievements.map((name) => (
                <div
                  key={name}
                  className="flex flex-col items-center my-1 w-1/3 cursor-pointer"
                  onClick={() => setSelected(name)}
                >
                  <AchievementIcon
                    gameState={state}
                    name={name}
                    isSelected={name === selected}
                  />
                </div>
              ))}
            </div>
          </>
        }
      />
    </>
  );
};
