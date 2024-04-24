import React from "react";
import { Label } from "components/ui/Label";
import { Faction, FactionName } from "features/game/types/game";
import { capitalize } from "lib/utils/capitalize";
import { Factions as FactionTranslations } from "lib/i18n/dictionaries/types";
import { getTimeUntil } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { FACTIONS_START_TIME } from "./PledgeFaction";
import { Button } from "components/ui/Button";

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
  "2024-05-07T00:00:00Z"
).getTime();

export const FactionDetailsPanel: React.FC<Props> = ({ faction, onClose }) => {
  const { t } = useAppTranslation();

  const handleViewLeaderboard = () => {
    // eslint-disable-next-line no-console
    console.log("handle show leaderboard");
    onClose();
  };

  const seasonalDeliveriesStarted = Date.now() > SEASONAL_DELIVERIES_START_DATE;

  return (
    <>
      <div className="flex flex-col px-2 py-1 space-y-2">
        <div className="flex justify-between">
          <Label type="default">{capitalize(faction.name)}</Label>
          <Label type="default">
            {t("faction.points", { points: faction.points })}
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
        <span className="text-xs sm:text-sm">{t(`faction.emblems.tasks`)}</span>
        {!seasonalDeliveriesStarted && (
          <Label type="info">
            {t("faction.seasonal.delivery.start.at", {
              days: getTimeUntil(new Date(SEASONAL_DELIVERIES_START_DATE)),
            })}
          </Label>
        )}
      </div>
      <Button className="mt-2" onClick={handleViewLeaderboard}>
        {t("faction.view.leaderboard")}
      </Button>
    </>
  );
};
