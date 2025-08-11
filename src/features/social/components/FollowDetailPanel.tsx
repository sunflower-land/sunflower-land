import React, { useCallback } from "react";
import { ButtonPanel } from "components/ui/Panel";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { OnlineStatus } from "./OnlineStatus";
import { getRelativeTime } from "lib/utils/time";
import { useTranslation } from "react-i18next";
import { Equipped } from "features/game/types/bumpkin";
import { Label } from "components/ui/Label";
import socialPointsIcon from "assets/icons/social_score.webp";
import giftIcon from "assets/icons/gift.png";
import helpIcon from "assets/icons/help.webp";
import helpedIcon from "assets/icons/helped.webp";
import { ActiveProjects } from "../types/types";
import { getKeys } from "features/game/lib/crafting";
import { SUNNYSIDE } from "assets/sunnyside";
import { RAFFLE_REWARDS } from "features/game/types/monuments";

type Props = {
  loggedInFarmId: number;
  playerId: number;
  clothing: Equipped;
  username: string;
  haveHelpedToday: boolean;
  haveTheyHelpedYouToday: boolean;
  socialPoints: number;
  lastOnlineAt: number;
  projects: ActiveProjects;
  navigateToPlayer: (playerId: number) => void;
  friendStreak: number;
};

export const FollowDetailPanel: React.FC<Props> = ({
  loggedInFarmId,
  playerId,
  clothing,
  username,
  haveHelpedToday,
  haveTheyHelpedYouToday,
  socialPoints,
  lastOnlineAt,
  projects = {},
  navigateToPlayer,
  friendStreak,
}: Props) => {
  const { t } = useTranslation();
  const lastOnline = getRelativeTime(lastOnlineAt);

  const isOnline = lastOnlineAt > Date.now() - 30 * 60 * 1000;
  const isYou = loggedInFarmId === playerId;

  // Use useCallback to memoize the click handler
  const handleClick = useCallback(() => {
    navigateToPlayer(playerId);
  }, [navigateToPlayer, playerId]);

  const hasCookingPot = getKeys(projects).some(
    (project) => project in RAFFLE_REWARDS,
  );

  return (
    <ButtonPanel
      className="flex gap-3 justify-between hover:bg-brown-300 transition-colors active:bg-brown-400"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="z-10">
            <NPCIcon parts={clothing} />
          </div>
          <div className="absolute -top-1 -right-1">
            <OnlineStatus
              loggedInFarmId={loggedInFarmId}
              playerId={playerId}
              lastUpdatedAt={lastOnlineAt}
            />
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex flex-col justify-center gap-1">
            <div className="text-xs">{isYou ? `${t("you")}` : username}</div>
            {!isOnline ? (
              <div className="text-xxs">
                {t("social.lastOnline", { time: lastOnline })}
              </div>
            ) : (
              <div className="text-xxs">{t("social.farming")}</div>
            )}
            <div className="flex items-center gap-1 flex-wrap">
              {haveHelpedToday && <img src={helpIcon} className="w-4 h-4" />}
              {haveTheyHelpedYouToday && (
                <img src={helpedIcon} className="w-4 h-4" />
              )}
              {hasCookingPot && <img src={giftIcon} className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <Label type="chill" className="mb-0.5" icon={socialPointsIcon}>
          {socialPoints}
        </Label>
        {friendStreak > 0 && (
          <Label type="vibrant" icon={SUNNYSIDE.icons.heart}>
            {t("friendStreak.short", { days: friendStreak })}
          </Label>
        )}
      </div>
    </ButtonPanel>
  );
};
