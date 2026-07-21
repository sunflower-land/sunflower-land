import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "components/ui/Label";
import { FollowDetailPanel } from "./FollowDetailPanel";
import { Button } from "components/ui/Button";
import type { Equipped } from "features/game/types/bumpkin";
import { useFollowNetwork } from "../hooks/useFollowNetwork";
import { useInView } from "react-intersection-observer";
import { Loading } from "features/auth/components";
import type { Detail } from "../actions/getFollowNetworkDetails";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import { useNow } from "lib/utils/hooks/useNow";

const EMPTY_FARMS: number[] = [];

const _cheersGiven = (state: MachineState) => {
  const game = state.context.visitorState ?? state.context.state;
  return game.socialFarming.cheersGiven;
};

type Props = {
  loggedInFarmId: number;
  token: string;
  searchResults?: Detail[];
  networkFarmId: number;
  networkList: number[];
  networkCount: number;
  networkType: "followers" | "following";
  playerLoading?: boolean;
  showLabel?: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  navigateToPlayer: (playerId: number) => void;
};

export const FollowList: React.FC<Props> = ({
  loggedInFarmId,
  token,
  networkFarmId,
  networkCount,
  playerLoading,
  showLabel = true,
  networkType,
  scrollContainerRef,
  searchResults = [],
  navigateToPlayer,
}) => {
  const { t } = useTranslation();
  const { gameService } = useContext(Context);
  // Minute granularity: the "cheered today" key only flips at UTC midnight.
  const now = useNow({ live: true, intervalMs: 60_000 });
  const cheersGiven = useSelector(gameService, _cheersGiven);
  const today = new Date(now).toISOString().split("T")[0];
  const cheeredFarmsToday =
    cheersGiven.date === today ? cheersGiven.farms : EMPTY_FARMS;
  const [isScrollable, setIsScrollable] = useState(false);
  // Intersection observer to load more details when the loader is in view
  const { ref: intersectionRef, inView } = useInView({
    root: scrollContainerRef.current,
    rootMargin: "0px",
    threshold: 0.1,
  });

  const {
    network,
    isLoadingInitialData,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    mutate,
  } = useFollowNetwork(token, loggedInFarmId, networkFarmId, networkType);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const checkScrollable = () => {
      setIsScrollable(el.scrollHeight > el.clientHeight);
    };

    checkScrollable();

    const observer = new ResizeObserver(checkScrollable);
    observer.observe(el);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network]);

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore && isScrollable) {
      loadMore();
    }
  }, [inView, hasMore, isLoadingMore, loadMore, isScrollable]);

  if (isLoadingInitialData || playerLoading) {
    return (
      <div className="flex flex-col gap-1 pl-1">
        <div className="sticky top-0 bg-brown-200 z-10 pb-1">
          {showLabel && (
            <Label type="default">
              {t(`playerModal.${networkType}`, { count: networkCount })}
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
                {t(`playerModal.${networkType}`, { count: networkCount })}
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
        {showLabel && (
          <div className="sticky top-0 bg-brown-200 z-10 pb-1">
            <Label type="default">
              {t(`playerModal.${networkType}`, { count: networkCount })}
            </Label>
          </div>
        )}

        <div className="text-xs">{t(`playerModal.no.${networkType}`)}</div>
      </div>
    );
  }

  const data = searchResults.length > 0 ? searchResults : network;

  return (
    <div className="flex flex-col pr-0.5">
      {showLabel && (
        <div className="sticky -top-1 bg-brown-200 z-10 pb-1 pt-1">
          <Label type="default">
            {t(`playerModal.${networkType}`, { count: networkCount })}
          </Label>
        </div>
      )}

      <div className="flex flex-col gap-1">
        {data.map((detail) => {
          return (
            <FollowDetailPanel
              key={`flw-${detail.id}`}
              loggedInFarmId={loggedInFarmId}
              playerId={detail.id}
              clothing={detail.clothing as Equipped}
              username={detail.username ?? ""}
              lastOnlineAt={detail.lastUpdatedAt ?? 0}
              navigateToPlayer={navigateToPlayer}
              hasCookingPot={detail.hasCookingPot}
              socialPoints={detail.socialPoints ?? 0}
              helpedThemToday={detail.helpedThemToday}
              helpedYouToday={detail.helpedYouToday}
              cheeredThemToday={cheeredFarmsToday.includes(detail.id)}
              helpStreak={detail.helpStreak}
            />
          );
        })}
      </div>

      <div
        ref={intersectionRef}
        className="text-xs flex justify-center py-1 h-5"
      >
        {hasMore && <Loading dotsOnly />}
      </div>
    </div>
  );
};
