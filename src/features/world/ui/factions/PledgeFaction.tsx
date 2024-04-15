import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Factions as FactionTranslations } from "lib/i18n/dictionaries/types";

import giftIcon from "assets/icons/gift.png";
import { Context } from "features/game/GameProvider";
import { getTimeUntil } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { capitalize } from "lib/utils/capitalize";

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

  const joinedFaction = useSelector(gameService, _faction);

  useUiRefresher({
    active: getTimeUntil(FACTIONS_START_TIME).includes("second"),
  });

  const handlePledge = () => {
    gameService.send("faction.pledged", { faction });
  };

  const handleViewLeaderboard = () => {
    onClose();
  };

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
      {joinedFaction && (
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
    </Panel>
  );
};
