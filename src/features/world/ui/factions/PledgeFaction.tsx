import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Factions as FactionTranslations } from "lib/i18n/dictionaries/types";

import giftIcon from "assets/icons/gift.png";
import { Context } from "features/game/GameProvider";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { capitalize } from "lib/utils/capitalize";
import { getTimeUntil } from "lib/utils/time";
import { FactionDetailsPanel } from "./FactionDetailsPanel";
import { FactionName } from "features/game/types/game";

const FACTION_DESCRIPTIONS: Record<FactionName, FactionTranslations> = {
  sunflorians: "faction.description.sunflorians",
  bumpkins: "faction.description.bumpkins",
  goblins: "faction.description.goblins",
  nightshades: "faction.description.nightshades",
};

/**
 * When faction donations end
 */
export const FACTIONS_START_TIME = new Date(Date.UTC(2024, 5, 14));

interface Props {
  faction: FactionName;
  onClose: () => void;
}

const _joinedFaction = (state: MachineState) => state.context.state.faction;

export const PledgeFaction: React.FC<Props> = ({ faction, onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [showConfirm, setShowConfirm] = useState(false);

  const joinedFaction = useSelector(gameService, _joinedFaction);

  useUiRefresher({
    active: getTimeUntil(FACTIONS_START_TIME).includes("second"),
  });

  const handlePledge = () => {
    gameService.send("faction.pledged", { faction });
  };

  return (
    <>
      {!showConfirm && !joinedFaction && (
        <>
          <div className="flex flex-col px-2 py-1 space-y-2">
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
          <div className="flex flex-col p-2 pt-1 space-y-2">
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
        <FactionDetailsPanel faction={joinedFaction} onClose={onClose} />
      )}
    </>
  );
};
