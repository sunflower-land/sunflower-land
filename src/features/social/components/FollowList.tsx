import React from "react";
import useSWR from "swr";
import { useTranslation } from "react-i18next";
import { useSocial } from "../hooks/useSocial";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { FollowDetailPanel } from "./FollowDetailPanel";
import { getFollowNetworkDetails } from "../actions/getFollowNetworkDetails";
import { Button } from "components/ui/Button";

type Props = {
  farmId: number;
  token: string;
  networkFarmId: number;
  networkList: number[];
  networkCount: number;
  playerLoading: boolean;
  type: "followers" | "following";
};

export const FollowList: React.FC<Props> = ({
  farmId,
  token,
  networkFarmId,
  networkList,
  networkCount,
  playerLoading,
  type,
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
      <InnerPanel>
        <div className="flex flex-col gap-1 pl-1">
          <div className="sticky top-0 bg-brown-200 z-10 pb-1">
            <Label type="default">
              {t(`playerModal.${type}`, { count: networkCount })}
            </Label>
          </div>

          <div className="w-[60%] h-6 bg-brown-300 animate-pulse mb-2" />
        </div>
      </InnerPanel>
    );
  }

  if (error) {
    return (
      <InnerPanel>
        <div className="flex flex-col gap-1 pl-1 mb-2">
          <div className="sticky top-0 bg-brown-200 z-10 pb-1">
            {t(`playerModal.${type}`, { count: networkCount })}
          </div>
          <div className="text-xs">{t("error.wentWrong")}</div>
        </div>
        <Button onClick={() => mutate()}>{t("reload")}</Button>
      </InnerPanel>
    );
  }

  if (networkCount === 0) {
    return (
      <InnerPanel>
        <div className="flex flex-col gap-1 pl-1 mb-1">
          <div className="sticky top-0 bg-brown-200 z-10 pb-1">
            <Label type="default">
              {t(`playerModal.${type}`, { count: networkCount })}
            </Label>
          </div>
          <div className="text-xs">{t(`playerModal.no.${type}`)}</div>
        </div>
      </InnerPanel>
    );
  }

  return (
    <InnerPanel>
      <div className="flex flex-col gap-1 pt-1">
        <div className="sticky top-0 bg-brown-200 z-10 pb-1">
          <Label type="default">
            {t(`playerModal.${type}`, { count: networkCount })}
          </Label>
        </div>
        {sortedNetworkList.map((follower) => {
          const isOnline =
            (online[follower] ?? 0) > Date.now() - 30 * 60 * 1000;

          const lastOnlineAt =
            online[follower] ??
            data?.data?.network[follower]?.lastUpdatedAt ??
            0;

          return (
            <FollowDetailPanel
              key={`flw-${follower}`}
              status={isOnline ? "online" : "offline"}
              tokenUri={networkDetails?.[follower]?.tokenUri ?? ""}
              username={networkDetails?.[follower]?.username ?? ""}
              lastOnlineAt={lastOnlineAt}
            />
          );
        })}
      </div>
    </InnerPanel>
  );
};
