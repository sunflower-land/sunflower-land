import React, { useContext, useEffect, useState } from "react";
import { Label } from "components/ui/Label";
import { Faction, FactionName } from "features/game/types/game";
import { capitalize } from "lib/utils/capitalize";
import { Factions as FactionTranslations } from "lib/i18n/dictionaries/types";
import { getTimeUntil } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { FACTIONS_START_TIME } from "./PledgeFaction";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { Leaderboards } from "features/game/expansion/components/leaderboard/actions/cache";
import { fetchLeaderboardData } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { MiniFactionLeaderboard } from "./MiniFactionLeaderboard";

interface Props {
  faction: Faction;
  onClose: () => void;
}

const FACTION_JOINED_INTROS: Record<FactionName, FactionTranslations> = {
  sunflorians: "faction.joined.sunflorians.intro",
  bumpkins: "faction.joined.bumpkins.intro",
  goblins: "faction.joined.goblins.intro",
  nightshades: "faction.joined.nightshades.intro",
};

const SEASONAL_DELIVERIES_START_DATE = new Date(
  "2024-05-07T00:00:00Z",
).getTime();

const _farmId = (state: MachineState) => state.context.farmId;
const _username = (state: MachineState) => state.context.state.username;

export const FactionDetailsPanel: React.FC<Props> = ({ faction, onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [data, setData] = useState<Leaderboards | null | undefined>(undefined);

  useUiRefresher({
    active: getTimeUntil(FACTIONS_START_TIME).includes("second"),
  });

  const farmId = useSelector(gameService, _farmId);
  const username = useSelector(gameService, _username);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        const data = await fetchLeaderboardData(farmId);
        setData(data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error loading leaderboards", e);

        if (!data) setData(null);
      }
    };

    fetchLeaderboards();
  }, []);

  const id = username ?? String(farmId);

  const seasonalDeliveriesStarted = Date.now() > SEASONAL_DELIVERIES_START_DATE;

  return (
    <>
      {!showLeaderboard && (
        <>
          <div className="flex flex-col px-2 py-1 space-y-2">
            <div className="flex justify-between">
              <Label type="default">{capitalize(faction.name)}</Label>
              <Label type="default">
                {t("faction.points.with.number", {
                  points: faction.points ?? 0,
                })}
              </Label>
            </div>
            <span className="text-xs sm:text-sm">
              {t(FACTION_JOINED_INTROS[faction.name])}
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
            {!seasonalDeliveriesStarted && (
              <Label type="info">
                {t("faction.seasonal.delivery.start.at", {
                  days: getTimeUntil(new Date(SEASONAL_DELIVERIES_START_DATE)),
                })}
              </Label>
            )}
          </div>
          <Button className="mt-2" onClick={() => setShowLeaderboard(true)}>
            {t("faction.view.leaderboard")}
          </Button>
        </>
      )}
      {showLeaderboard && (
        <MiniFactionLeaderboard
          id={id}
          faction={faction.name}
          isLoading={data === undefined}
          data={data?.factions ?? null}
          onBack={() => setShowLeaderboard(false)}
        />
      )}
    </>
  );
};
