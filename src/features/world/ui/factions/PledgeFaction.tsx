import React from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Factions as FactionTranslations } from "lib/i18n/dictionaries/types";

import giftIcon from "assets/icons/gift.png";

type Faction = "Sunflorians" | "Bumpkins" | "Goblins" | "Nightshades";

const FACTION_DESCRIPTIONS: Record<Faction, FactionTranslations> = {
  Sunflorians: "faction.description.sunflorians",
  Bumpkins: "faction.description.bumpkins",
  Goblins: "faction.description.goblins",
  Nightshades: "faction.description.nightshades",
};

interface Props {
  faction: Faction;
}

export const PledgeFaction: React.FC<Props> = ({ faction }) => {
  const { t } = useAppTranslation();

  const handlePledge = () => {
    // eslint-disable-next-line no-console
    console.log("Pledge to faction", faction);
  };

  return (
    <Panel>
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
            {t("faction.countdown", { days: 4 })}
          </span>
          <span className="text-xs sm:text-sm">
            {t("faction.join.confirm", { faction })}
          </span>
        </div>
        <Button className="mt-2">{t("faction.join", { faction })}</Button>
      </>
    </Panel>
  );
};
