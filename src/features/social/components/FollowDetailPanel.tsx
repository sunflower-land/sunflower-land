import React from "react";
import { ButtonPanel } from "components/ui/Panel";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { OnlineStatus } from "./OnlineStatus";
import { getRelativeTime } from "lib/utils/time";
import { useTranslation } from "react-i18next";

type Props = {
  status: "online" | "offline";
  tokenUri: string;
  username: string;
  lastOnlineAt: number;
};

export const FollowDetailPanel = ({
  status,
  tokenUri,
  username,
  lastOnlineAt,
}: Props) => {
  const { t } = useTranslation();
  const { equipped } = interpretTokenUri(tokenUri);
  const lastOnline = getRelativeTime(lastOnlineAt);

  return (
    <ButtonPanel className="flex gap-3">
      <div className="relative">
        <div className="z-10">
          <NPCIcon parts={equipped} />
        </div>
        <div className="absolute -top-1 -right-1">
          <OnlineStatus status={status} />
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <div>{username}</div>
        {status !== "online" ? (
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
