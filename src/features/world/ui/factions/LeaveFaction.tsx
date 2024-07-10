import React from "react";
import { GameState } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { FACTION_EMBLEMS } from "features/game/events/landExpansion/joinFaction";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import mark from "assets/icons/faction_mark.webp";

export const LeaveFaction: React.FC<{
  game: GameState;
  onClose: () => void;
  onLeave: () => void;
}> = ({ game, onClose, onLeave }) => {
  const { t } = useAppTranslation();

  const emblem = FACTION_EMBLEMS[game.faction!.name];
  const emblems = game.inventory[emblem];
  const marks = game.inventory.Mark;
  const isNew =
    Date.now() - (game.faction?.pledgedAt ?? 0) < 24 * 60 * 60 * 1000;

  return (
    <div>
      <div className="p-1">
        <div className="flex">
          <Label type="danger" className="mb-1">
            {t("faction.leave")}
          </Label>
          {!!emblems && (
            <Label type="danger" className="mb-1">
              {t("faction.leave.hasEmblems")}
            </Label>
          )}
        </div>
        <p className="text-sm mb-2">{t("faction.leave.areYouSure")}</p>
        <p className="text-sm mb-2">{t("faction.leave.marks")}</p>
        {!!emblems && (
          <p className="text-sm mb-2">{t("faction.leave.sellEmblems")}</p>
        )}
        {!!isNew && <p className="text-sm mb-2">{t("faction.leave.isNew")}</p>}
        {!!marks && (
          <Label
            type="danger"
            className="mb-2"
            icon={mark}
          >{`${marks} will be lost`}</Label>
        )}
      </div>
      <div className="flex items-center">
        <Button onClick={onClose} className="mr-1">
          {t("no")}
        </Button>
        <Button disabled={isNew || !!emblems} onClick={onLeave}>
          {t("yes")}
        </Button>
      </div>
    </div>
  );
};
