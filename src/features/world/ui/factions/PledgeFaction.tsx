import React, { useContext, useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Factions as FactionTranslations } from "lib/i18n/dictionaries/types";

import giftIcon from "assets/icons/gift.png";
import { Context } from "features/game/GameProvider";
import { getRelativeTime, getTimeUntil } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { capitalize } from "lib/utils/capitalize";
import {
  FactionLeaderboard,
  fetchLeaderboardData,
} from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { Leaderboards } from "features/game/expansion/components/leaderboard/actions/cache";
import { FactionName } from "features/game/types/game";
import { Loading } from "features/auth/components";
import { TicketTable } from "features/game/expansion/components/leaderboard/TicketTable";

type Faction = "sunflorians" | "bumpkins" | "goblins" | "nightshades";

const FACTION_DESCRIPTIONS: Record<Faction, FactionTranslations> = {
  sunflorians: "faction.description.sunflorians",
  bumpkins: "faction.description.bumpkins",
  goblins: "faction.description.goblins",
  nightshades: "faction.description.nightshades",
};

const FACTION_JOINED_INTROS: Record<Faction, FactionTranslations> = {
  sunflorians: "faction.joined.sunflorians.intro",
  bumpkins: "faction.joined.bumpkins.intro",
  goblins: "faction.joined.goblins.intro",
  nightshades: "faction.joined.nightshades.intro",
};

const FACTIONS_START_TIME = new Date(Date.UTC(2024, 6, 1));

interface Props {
  faction: Faction;
  onClose: () => void;
}

const _faction = (state: MachineState) => state.context.state.faction?.name;

export const PledgeFaction: React.FC<Props> = ({ faction, onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const joinedFaction = useSelector(gameService, _faction);

  const [data, setData] = useState<Leaderboards | null | undefined>(undefined);

  useEffect(() => {
    if (!joinedFaction) return;

    const fetchLeaderboards = async () => {
      try {
        const data = await fetchLeaderboardData(
          gameService.state.context.farmId
        );
        setData(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error loading leaderboards", e);

        if (!data) setData(null);
      }
    };

    fetchLeaderboards();
  }, [joinedFaction]);

  useUiRefresher({
    active: getTimeUntil(FACTIONS_START_TIME).includes("second"),
  });

  const handlePledge = () => {
    gameService.send("faction.pledged", { faction });
  };

  const handleViewLeaderboard = () => {
    setShowLeaderboard(true);
  };

  const id =
    gameService.state.context.state.username ??
    String(gameService.state.context.farmId);

  return (
    <Panel>
      {!showConfirm && !joinedFaction && (
        <>
          <div className="flex flex-col p-2 space-y-2">
            <div className="flex justify-between">
              <Label type="default">{capitalize(faction)}</Label>
              <Label type="default" icon={giftIcon}>
                {t("banner")}
              </Label>
            </div>
            <span className="text-xs sm:text-sm">
              {t(FACTION_DESCRIPTIONS[faction])}
            </span>
            <span className="text-xs sm:text-sm">
              {t("faction.countdown", {
                timeUntil: getTimeUntil(FACTIONS_START_TIME),
              })}
            </span>
            <span className="text-xs sm:text-sm">
              {t("faction.join.confirm", { faction: capitalize(faction) })}
            </span>
          </div>
          <Button className="mt-2" onClick={() => setShowConfirm(true)}>
            {t("faction.join", { faction: capitalize(faction) })}
          </Button>
        </>
      )}
      {showConfirm && !joinedFaction && (
        <>
          <div className="flex flex-col p-2 space-y-2">
            <Label type="danger">{t("are.you.sure")}</Label>
            <span className="text-xs sm:text-sm">
              {t("faction.cannot.change")}
            </span>
          </div>
          <div className="flex space-x-1">
            <Button onClick={onClose}>{t("cancel")}</Button>
            <Button onClick={handlePledge}>{t("confirm")}</Button>
          </div>
        </>
      )}
      {!showLeaderboard && joinedFaction && (
        <>
          <div className="flex flex-col p-2 space-y-3">
            <Label type="success">{capitalize(faction)}</Label>
            <span className="text-xs sm:text-sm">
              {t(FACTION_JOINED_INTROS[faction])}
            </span>
            <div className="flex justify-between">
              <Label type="default">{t("faction.earn.emblems")}</Label>
              <Label type="info">
                {t("faction.earn.emblems.time.left", {
                  timeLeft: getTimeUntil(FACTIONS_START_TIME),
                })}
              </Label>
            </div>
            <span className="text-xs sm:text-sm">
              {t(`faction.emblems.tasks`)}
            </span>
          </div>
          <Button className="mt-2" onClick={handleViewLeaderboard}>
            {t("faction.view.leaderboard")}
          </Button>
        </>
      )}
      {showLeaderboard && joinedFaction && (
        <MiniFactionLeaderboard
          id={id}
          faction={faction}
          isLoading={data === undefined}
          data={data?.factions ?? null}
        />
      )}
    </Panel>
  );
};

interface LeaderboardProps {
  id: string;
  faction: FactionName;
  isLoading: boolean;
  data: FactionLeaderboard | null | undefined;
}

const MiniFactionLeaderboard: React.FC<LeaderboardProps> = ({
  id,
  faction,
  isLoading,
  data,
}) => {
  const { t } = useAppTranslation();

  if (isLoading && !data) return <Loading />;

  if (!data)
    return (
      <div className="p-1">
        <Label type="danger">{t("leaderboard.error")}</Label>
      </div>
    );

  const topTen = data.topTens[faction];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between px-1 pt-1">
        <Label type="default" className="capitalize">{`${faction.slice(
          0,
          -1
        )} ${t("leaderboard.leaderboard")}`}</Label>
        <p className="text-[12px]">
          {t("last.updated")} {getRelativeTime(data.lastUpdated)}
        </p>
      </div>

      <div className="scrollable overflow-y-auto max-h-full p-1">
        {data.farmRankingDetails && (
          <div className="mb-3">
            <Label type="info" className="mb-1">
              {t("leaderboard.yourPosition")}
            </Label>
            <TicketTable
              showHeader={true}
              rankings={data.farmRankingDetails}
              id={id}
            />
          </div>
        )}

        {topTen && (
          <>
            <Label type="info" className="mb-1">
              {t("leaderboard.topTen")}
            </Label>
            <TicketTable rankings={topTen} id={id} />
          </>
        )}
      </div>
    </>
  );
};
