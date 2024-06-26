import { useActor } from "@xstate/react";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";

import { FactionEmblem, FactionName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";

import Decimal from "decimal.js-light";

import mark from "assets/icons/faction_mark.webp";
import powerup from "assets/icons/level_up.png";
import { RANKS, getFactionRanking } from "features/game/lib/factionRanks";

interface Props {
  emblem: FactionEmblem;
  factionName: FactionName;
}

export const Emblems: React.FC<Props> = ({ emblem, factionName }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  const emblems = gameState.context.state.inventory[emblem] ?? new Decimal(0);
  const playerRank = getFactionRanking(factionName, emblems.toNumber());

  return (
    <div className="p-2">
      <Label type="default" className="-ml-1 mb-2 capitalize">
        {playerRank?.name}
      </Label>
      <p className="mb-2">{t("faction.tradeEmblems")}</p>

      <table className="w-full text-xxs sm:text-xs table-fixed border-collapse">
        <thead>
          <tr>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5 w-1/3">
              <p>{t("rank")}</p>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5 w-1/4">
              <p>{t("faction.emblems")}</p>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
              <p>{t("buff")}</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.values(RANKS)
            .filter((rank) => rank.faction === factionName)
            .map((rank) => (
              <tr
                key={rank.name}
                className={classNames({
                  "bg-[#ead4aa]": rank.name === playerRank?.name,
                })}
              >
                <td style={{ border: "1px solid #b96f50" }}>
                  <div className="flex items-center">
                    <img src={rank.icon} className="mx-1 sm:mx-2" />
                    <p className="p-1.5 truncate capitalize">{rank.name}</p>
                  </div>
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 truncate"
                >
                  {rank.emblemsRequired}
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 relative"
                >
                  {rank.boost && (
                    <Label type="success" icon={powerup} secondaryIcon={mark}>
                      <span className="text-xxs sm:text-xs whitespace-nowrap">
                        {rank.boost}
                      </span>
                    </Label>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <span className="text-xs pt-1">{t("faction.marksBoost")}</span>
    </div>
  );
};
