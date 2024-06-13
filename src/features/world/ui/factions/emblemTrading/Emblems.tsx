import { useActor } from "@xstate/react";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { FactionEmblem } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";

type Rank = {
  name: string;
  icon: string;
  emblemsRequired: number;
  boost?: string;
};

const RANKS: Rank[] = [
  {
    name: "Peasant",
    icon: ITEM_DETAILS.Sunflower.image,
    emblemsRequired: 0,
  },
  {
    name: "Serf",
    icon: ITEM_DETAILS.Sunflower.image,
    emblemsRequired: 10,
    boost: "+0.2 ?",
  },
  {
    name: "King",
    icon: ITEM_DETAILS.Sunflower.image,
    emblemsRequired: 5000,
    boost: "+0.5 ?",
  },
];
interface Props {
  emblem: FactionEmblem;
}

export const Emblems: React.FC<Props> = ({ emblem }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  const emblems = gameState.context.state.inventory[emblem] ?? new Decimal(0);
  const playerRank = RANKS.find((r) => emblems.gte(r.emblemsRequired));

  return (
    <div className="p-2">
      <Label type="default" className="-ml-1 mb-2">
        {playerRank?.name}
      </Label>
      <p className="mb-2">{t("faction.tradeEmblems")}</p>

      <table className="w-full text-xs table-fixed border-collapse">
        <tbody>
          {RANKS.map((rank) => (
            <tr
              key={rank.name}
              className={classNames({
                "bg-[#ead4aa]": rank.name === playerRank?.name,
              })}
            >
              <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                <div className="flex">
                  <img src={rank.icon} className="h-4 mr-2" />
                  {rank.name}
                </div>
              </td>
              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 truncate"
              >
                {rank.emblemsRequired} {t("faction.emblems")}
              </td>
              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 relative"
              >
                {rank.boost && (
                  <Label type="vibrant" className=" absolute right-2 top-0">
                    {rank.boost}
                  </Label>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
