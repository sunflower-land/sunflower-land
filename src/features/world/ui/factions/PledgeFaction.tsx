import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Factions as FactionTranslations } from "lib/i18n/dictionaries/types";

import giftIcon from "assets/icons/gift.png";
import { Context } from "features/game/GameProvider";
import { getTimeUntil } from "lib/utils/time";

type Faction = "Sunflorians" | "Bumpkins" | "Goblins" | "Nightshades";

const FACTION_DESCRIPTIONS: Record<Faction, FactionTranslations> = {
  Sunflorians: "faction.description.sunflorians",
  Bumpkins: "faction.description.bumpkins",
  Goblins: "faction.description.goblins",
  Nightshades: "faction.description.nightshades",
};

const FACTIONS_START_TIME = new Date(Date.UTC(2024, 6, 1));

interface Props {
  faction: Faction;
  onClose: () => void;
}

export const PledgeFaction: React.FC<Props> = ({ faction, onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePledge = () => {
    gameService.send("faction.pledged", { faction });
  };

  return (
    <Panel>
      {!showConfirm && (
        <>
          <div className="flex flex-col p-2 space-y-2">
            <div className="flex justify-between">
              <Label type="default">{faction}</Label>
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
              {t("faction.join.confirm", { faction })}
            </span>
          </div>
          <Button className="mt-2" onClick={() => setShowConfirm(true)}>
            {t("faction.join", { faction })}
          </Button>
        </>
      )}
      {showConfirm && (
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
    </Panel>
  );
};
