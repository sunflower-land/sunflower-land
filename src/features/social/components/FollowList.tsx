import React from "react";
import useSWR from "swr";
import { useTranslation } from "react-i18next";
import { useSocial } from "../hooks/useSocial";
import { Label } from "components/ui/Label";
import { FollowDetailPanel } from "./FollowDetailPanel";
import { getFollowNetworkDetails } from "../actions/getFollowNetworkDetails";
import { Button } from "components/ui/Button";
import { Equipped } from "features/game/types/bumpkin";

type Props = {
  farmId: number;
  token: string;
  networkFarmId: number;
  networkList: number[];
  networkCount: number;
  playerLoading?: boolean;
  showLabel?: boolean;
  type: "followers" | "following";
  navigateToPlayer: (playerId: number) => void;
};

export const FollowList: React.FC<Props> = ({
  farmId,
  token,
  networkFarmId,
  networkList,
  networkCount,
  playerLoading,
  showLabel = true,
  type,
  navigateToPlayer,
}) => {
  const { online } = useSocial({
    farmId: networkFarmId,
    following: networkList,
  });
  const { t } = useTranslation();

  const { data, isLoading, error, mutate } = useSWR(
    [
      networkCount > 0 ? "followNetworkDetails" : null,
      token,
      farmId,
      networkFarmId,
    ],
    ([, token, farmId, networkFarmId]) => {
      return getFollowNetworkDetails({
        token: token as string,
        farmId,
        networkFarmId,
      });
    },
    {
      revalidateOnFocus: false,
    },
  );

  const networkDetails = data?.data?.network;

  const sortedNetworkList = networkList.sort((a, b) => {
    const aLastOnlineAt = online[a] ?? networkDetails?.[a]?.lastUpdatedAt ?? 0;
    const bLastOnlineAt = online[b] ?? networkDetails?.[b]?.lastUpdatedAt ?? 0;

    return bLastOnlineAt - aLastOnlineAt;
  });

  if (isLoading || playerLoading) {
    return (
      <div className="flex flex-col gap-1 pl-1">
        <div className="sticky top-0 bg-brown-200 z-10 pb-1">
          {showLabel && (
            <Label type="default">
              {t(`playerModal.${type}`, { count: networkCount })}
            </Label>
          )}
        </div>

        <div className="w-[60%] h-6 bg-brown-300 animate-pulse mb-2" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="flex flex-col gap-1 pl-1 mb-2">
          <div className="sticky top-0 bg-brown-200 z-10 pb-1">
            {showLabel && (
              <Label type="default">
                {t(`playerModal.${type}`, { count: networkCount })}
              </Label>
            )}
          </div>
          <div className="text-xs">{t("error.wentWrong")}</div>
        </div>
        <Button onClick={() => mutate()}>{t("reload")}</Button>
      </>
    );
  }

  if (networkCount === 0) {
    return (
      <div className="flex flex-col gap-1 pl-1 mb-1">
        <div className="sticky top-0 bg-brown-200 z-10 pb-1">
          {showLabel && (
            <Label type="default">
              {t(`playerModal.${type}`, { count: networkCount })}
            </Label>
          )}
        </div>
        <div className="text-xs">{t(`playerModal.no.${type}`)}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 pt-1">
      <div className="sticky top-0 bg-brown-200 z-10 pb-1">
        {showLabel && (
          <Label type="default">
            {t(`playerModal.${type}`, { count: networkCount })}
          </Label>
        )}
      </div>
      {sortedNetworkList.map((followerId) => {
        return (
          <FollowDetailPanel
            key={`flw-${followerId}`}
            farmId={farmId}
            playerId={followerId}
            clothing={networkDetails?.[followerId]?.clothing as Equipped}
            username={networkDetails?.[followerId]?.username ?? ""}
            lastOnlineAt={networkDetails?.[followerId]?.lastUpdatedAt ?? 0}
            socialPoints={networkDetails?.[followerId]?.socialPoints ?? 0}
            navigateToPlayer={navigateToPlayer}
          />
        );
      })}
    </div>
  );
};
