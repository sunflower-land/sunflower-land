import React, { useCallback } from "react";
import { ButtonPanel } from "components/ui/Panel";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { OnlineStatus } from "./OnlineStatus";
import { getRelativeTime } from "lib/utils/time";
import { useTranslation } from "react-i18next";

type Props = {
  farmId: number;
  playerId: number;
  tokenUri: string;
  username: string;
  lastOnlineAt: number;
  navigateToPlayer: (playerId: number) => void;
};

export const FollowDetailPanel: React.FC<Props> = ({
  farmId,
  playerId,
  tokenUri,
  username,
  lastOnlineAt,
  navigateToPlayer,
}: Props) => {
  const { t } = useTranslation();
  const { equipped } = interpretTokenUri(tokenUri);
  const lastOnline = getRelativeTime(lastOnlineAt);

  const isOnline = lastOnlineAt > Date.now() - 30 * 60 * 1000;
  const isYou = farmId === playerId;

  // Use useCallback to memoize the click handler
  const handleClick = useCallback(() => {
    navigateToPlayer(playerId);
  }, [navigateToPlayer, playerId]);

  return (
    <ButtonPanel
      className="flex gap-3 hover:bg-brown-300 transition-colors active:bg-brown-400"
      disabled={isYou}
      onClick={handleClick}
    >
      <div className="relative">
        <div className="z-10">
          <NPCIcon parts={equipped} />
        </div>
        <div className="absolute -top-1 -right-1">
          <OnlineStatus
            farmId={farmId}
            playerId={playerId}
            lastUpdatedAt={lastOnlineAt}
          />
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <div>{isYou ? `${t("you")}` : username}</div>
        {!isOnline ? (
          <div className="text-xxs">
            {t("social.lastOnline", { time: lastOnline })}
          </div>
        ) : (
          <div className="text-xxs">{t("social.farming")}</div>
        )}
      </div>
    </ButtonPanel>
  );
};
