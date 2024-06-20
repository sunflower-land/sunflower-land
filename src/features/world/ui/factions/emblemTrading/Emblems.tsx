import { useActor } from "@xstate/react";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";

import { FactionEmblem, FactionName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";

import sunflorians_chevron_zero from "assets/icons/factions/sunflorians/chevron_zero.webp";
import sunflorians_chevron_one from "assets/icons/factions/sunflorians/chevron_one.webp";
import sunflorians_chevron_two from "assets/icons/factions/sunflorians/chevron_two.webp";
import sunflorians_chevron_three from "assets/icons/factions/sunflorians/chevron_three.webp";
import sunflorians_chevron_four from "assets/icons/factions/sunflorians/chevron_four.webp";
import sunflorians_chevron_five from "assets/icons/factions/sunflorians/chevron_five.webp";
import sunflorians_chevron_six from "assets/icons/factions/sunflorians/chevron_six.webp";

import bumpkins_chevron_zero from "assets/icons/factions/bumpkins/chevron_zero.webp";
import bumpkins_chevron_one from "assets/icons/factions/bumpkins/chevron_one.webp";
import bumpkins_chevron_two from "assets/icons/factions/bumpkins/chevron_two.webp";
import bumpkins_chevron_three from "assets/icons/factions/bumpkins/chevron_three.webp";
import bumpkins_chevron_four from "assets/icons/factions/bumpkins/chevron_four.webp";
import bumpkins_chevron_five from "assets/icons/factions/bumpkins/chevron_five.webp";
import bumpkins_chevron_six from "assets/icons/factions/bumpkins/chevron_six.webp";

import nightshades_chevron_zero from "assets/icons/factions/nightshades/chevron_zero.webp";
import nightshades_chevron_one from "assets/icons/factions/nightshades/chevron_one.webp";
import nightshades_chevron_two from "assets/icons/factions/nightshades/chevron_two.webp";
import nightshades_chevron_three from "assets/icons/factions/nightshades/chevron_three.webp";
import nightshades_chevron_four from "assets/icons/factions/nightshades/chevron_four.webp";
import nightshades_chevron_five from "assets/icons/factions/nightshades/chevron_five.webp";
import nightshades_chevron_six from "assets/icons/factions/nightshades/chevron_six.webp";

import goblins_chevron_zero from "assets/icons/factions/goblins/chevron_zero.webp";
import goblins_chevron_one from "assets/icons/factions/goblins/chevron_one.webp";
import goblins_chevron_two from "assets/icons/factions/goblins/chevron_two.webp";
import goblins_chevron_three from "assets/icons/factions/goblins/chevron_three.webp";
import goblins_chevron_four from "assets/icons/factions/goblins/chevron_four.webp";
import goblins_chevron_five from "assets/icons/factions/goblins/chevron_five.webp";
import goblins_chevron_six from "assets/icons/factions/goblins/chevron_six.webp";
import Decimal from "decimal.js-light";

import mark from "assets/icons/faction_mark.webp";
import lightning from "assets/icons/lightning.png";

type Rank = {
  name: string;
  emblemsRequired: number;
  icon: string;
  boost?: string;
};

const BUMPKIN_RANKS: Rank[] = [
  {
    name: "Forager",
    emblemsRequired: 0,
    icon: bumpkins_chevron_zero,
  },
  {
    name: "Rancher",
    icon: bumpkins_chevron_one,
    emblemsRequired: 35,
    boost: "1.05x Marks",
  },
  {
    name: "Agrarian",
    icon: bumpkins_chevron_two,
    emblemsRequired: 300,
    boost: "2.5x Marks",
  },
  {
    name: "Steward",
    icon: bumpkins_chevron_three,
    emblemsRequired: 2500,
    boost: "4x Marks",
  },
  {
    name: "Sentinel",
    icon: bumpkins_chevron_four,
    emblemsRequired: 5000,
    boost: "4.5x Marks",
  },
  {
    name: "Warden",
    icon: bumpkins_chevron_five,
    emblemsRequired: 9000,
    boost: "4.8x Marks",
  },
  {
    name: "Overseer",
    icon: bumpkins_chevron_six,
    emblemsRequired: 16000,
    boost: "5x Marks",
  },
];

const NIGHTSHADE_RANKS: Rank[] = [
  {
    name: "Pagan",
    emblemsRequired: 0,
    icon: nightshades_chevron_zero,
  },
  {
    name: "Occultist",
    icon: nightshades_chevron_one,
    emblemsRequired: 35,
    boost: "1.05x Marks",
  },
  {
    name: "Enchanter",
    icon: nightshades_chevron_two,
    emblemsRequired: 350,
    boost: "2.5x Marks",
  },
  {
    name: "Raver",
    icon: nightshades_chevron_three,
    emblemsRequired: 2700,
    boost: "4x Marks",
  },
  {
    name: "Witch",
    icon: nightshades_chevron_four,
    emblemsRequired: 5500,
    boost: "4.5x Marks",
  },
  {
    name: "Sorcerer",
    icon: nightshades_chevron_five,
    emblemsRequired: 8500,
    boost: "4.8x Marks",
  },
  {
    name: "Lich",
    icon: nightshades_chevron_six,
    emblemsRequired: 15000,
    boost: "5x Marks",
  },
];

const GOBLIN_RANKS: Rank[] = [
  {
    name: "Hobgoblin",
    emblemsRequired: 0,
    icon: goblins_chevron_zero,
  },
  {
    name: "Grunt",
    icon: goblins_chevron_one,
    emblemsRequired: 45,
    boost: "1.05x Marks",
  },
  {
    name: "Marauder",
    icon: goblins_chevron_two,
    emblemsRequired: 500,
    boost: "2.5x Marks",
  },
  {
    name: "Elite",
    icon: goblins_chevron_three,
    emblemsRequired: 4200,
    boost: "4x Marks",
  },
  {
    name: "Commander",
    icon: goblins_chevron_four,
    emblemsRequired: 8000,
    boost: "4.5x Marks",
  },
  {
    name: "Warchief",
    icon: goblins_chevron_five,
    emblemsRequired: 13000,
    boost: "4.8x Marks",
  },
  {
    name: "Warlord",
    icon: goblins_chevron_six,
    emblemsRequired: 17000,
    boost: "5x Marks",
  },
];

const SUNFLORIAN_RANKS: Rank[] = [
  {
    name: "Initiate",
    emblemsRequired: 0,
    icon: sunflorians_chevron_zero,
  },
  {
    name: "Squire",
    icon: sunflorians_chevron_one,
    emblemsRequired: 45,
    boost: "1.05x Marks",
  },
  {
    name: "Captain",
    icon: sunflorians_chevron_two,
    emblemsRequired: 400,
    boost: "2.5x Marks",
  },
  {
    name: "Knight",
    icon: sunflorians_chevron_three,
    emblemsRequired: 3000,
    boost: "4x Marks",
  },
  {
    name: "Guardian",
    icon: sunflorians_chevron_four,
    emblemsRequired: 6000,
    boost: "4.5x Marks",
  },
  {
    name: "Paladin",
    icon: sunflorians_chevron_five,
    emblemsRequired: 11000,
    boost: "4.8x Marks",
  },
  {
    name: "Archduke",
    icon: sunflorians_chevron_six,
    emblemsRequired: 17000,
    boost: "5x Marks",
  },
];

export const RANKS: Record<FactionName, Rank[]> = {
  bumpkins: BUMPKIN_RANKS,
  nightshades: NIGHTSHADE_RANKS,
  goblins: GOBLIN_RANKS,
  sunflorians: SUNFLORIAN_RANKS,
};

interface Props {
  emblem: FactionEmblem;
  factionName: FactionName;
}

export const Emblems: React.FC<Props> = ({ emblem, factionName }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  const emblems = gameState.context.state.inventory[emblem] ?? new Decimal(0);
  const playerRank = [...RANKS[factionName]]
    .reverse()
    .find((r) => emblems.gte(r.emblemsRequired));

  return (
    <div className="p-2">
      <Label type="default" className="-ml-1 mb-2">
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
          {RANKS[factionName].map((rank) => (
            <tr
              key={rank.name}
              className={classNames({
                "bg-[#ead4aa]": rank.name === playerRank?.name,
              })}
            >
              <td style={{ border: "1px solid #b96f50" }}>
                <div className="flex items-center">
                  <img src={rank.icon} className="mx-1 sm:mx-2" />
                  <p className="p-1.5 truncate">{rank.name}</p>
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
                  <Label type="vibrant" icon={lightning} secondaryIcon={mark}>
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
