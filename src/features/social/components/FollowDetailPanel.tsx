import React from "react";
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
};

export const FollowDetailPanel = ({
  farmId,
  playerId,
  tokenUri,
  username,
  lastOnlineAt,
}: Props) => {
  const { t } = useTranslation();
  const { equipped } = interpretTokenUri(tokenUri);
  const lastOnline = getRelativeTime(lastOnlineAt);

  const isOnline = lastOnlineAt > Date.now() - 30 * 60 * 1000;

  return (
    <ButtonPanel className="flex gap-3">
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
        <div>{username}</div>
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
