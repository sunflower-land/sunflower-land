import { useActor } from "@xstate/react";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";
import { Context } from "features/game/GameProvider";
import {
  PercentileData,
  fetchLeaderboardData,
} from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { FactionEmblem, FactionName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useEffect, useState } from "react";

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

type Rank = {
  name: string;
  percentile: 1 | 5 | 10 | 20 | 50 | 80 | 100;
  icon: string;
  boost?: string;
};

const BUMPKIN_RANKS: Rank[] = [
  {
    name: "Forager",
    percentile: 100,
    icon: bumpkins_chevron_zero,
  },
  {
    name: "Rancher",
    icon: bumpkins_chevron_one,
    percentile: 80,
    boost: "1.05x Marks",
  },
  {
    name: "Agrarian",
    icon: bumpkins_chevron_two,
    percentile: 50,
    boost: "2.5x Marks",
  },
  {
    name: "Steward",
    icon: bumpkins_chevron_three,
    percentile: 20,
    boost: "4x Marks",
  },
  {
    name: "Sentinel",
    icon: bumpkins_chevron_four,
    percentile: 10,
    boost: "4.5x Marks",
  },
  {
    name: "Warden",
    icon: bumpkins_chevron_five,
    percentile: 5,
    boost: "4.8x Marks",
  },
  {
    name: "Overseer",
    icon: bumpkins_chevron_six,
    percentile: 1,
    boost: "5x Marks",
  },
];

const NIGHTSHADE_RANKS: Rank[] = [
  {
    name: "Pagan",
    percentile: 100,
    icon: nightshades_chevron_zero,
  },
  {
    name: "Occultist",
    icon: nightshades_chevron_one,
    percentile: 80,
    boost: "1.05x Marks",
  },
  {
    name: "Enchanter",
    icon: nightshades_chevron_two,
    percentile: 50,
    boost: "2.5x Marks",
  },
  {
    name: "Raver",
    icon: nightshades_chevron_three,
    percentile: 20,
    boost: "4x Marks",
  },
  {
    name: "Witch",
    icon: nightshades_chevron_four,
    percentile: 10,
    boost: "4.5x Marks",
  },
  {
    name: "Sorcerer",
    icon: nightshades_chevron_five,
    percentile: 5,
    boost: "4.8x Marks",
  },
  {
    name: "Lich",
    icon: nightshades_chevron_six,
    percentile: 1,
    boost: "5x Marks",
  },
];

const GOBLIN_RANKS: Rank[] = [
  {
    name: "Hobgoblin",
    percentile: 100,
    icon: goblins_chevron_zero,
  },
  {
    name: "Grunt",
    icon: goblins_chevron_one,
    percentile: 80,
    boost: "1.05x Marks",
  },
  {
    name: "Marauder",
    icon: goblins_chevron_two,
    percentile: 50,
    boost: "2.5x Marks",
  },
  {
    name: "Elite",
    icon: goblins_chevron_three,
    percentile: 20,
    boost: "4x Marks",
  },
  {
    name: "Commander",
    icon: goblins_chevron_four,
    percentile: 10,
    boost: "4.5x Marks",
  },
  {
    name: "Warchief",
    icon: goblins_chevron_five,
    percentile: 5,
    boost: "4.8x Marks",
  },
  {
    name: "Warlord",
    icon: goblins_chevron_six,
    percentile: 1,
    boost: "5x Marks",
  },
];

const SUNFLORIAN_RANKS: Rank[] = [
  {
    name: "Initiate",
    percentile: 100,
    icon: sunflorians_chevron_zero,
  },
  {
    name: "Squire",
    icon: sunflorians_chevron_one,
    percentile: 80,
    boost: "1.05x Marks",
  },
  {
    name: "Captain",
    icon: sunflorians_chevron_two,
    percentile: 50,
    boost: "2.5x Marks",
  },
  {
    name: "Knight",
    icon: sunflorians_chevron_three,
    percentile: 20,
    boost: "4x Marks",
  },
  {
    name: "Guardian",
    icon: sunflorians_chevron_four,
    percentile: 10,
    boost: "4.5x Marks",
  },
  {
    name: "Paladin",
    icon: sunflorians_chevron_five,
    percentile: 5,
    boost: "4.8x Marks",
  },
  {
    name: "Archduke",
    icon: sunflorians_chevron_six,
    percentile: 1,
    boost: "5x Marks",
  },
];

const RANKS: Record<FactionName, Rank[]> = {
  bumpkins: BUMPKIN_RANKS,
  nightshades: NIGHTSHADE_RANKS,
  goblins: GOBLIN_RANKS,
  sunflorians: SUNFLORIAN_RANKS,
};

interface Props {
  emblem: FactionEmblem;
}

export const Emblems: React.FC<Props> = ({ emblem }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: {
      state: { username, faction },
      farmId,
    },
  } = gameState;

  const playerName = username ?? farmId;

  const { t } = useAppTranslation();

  const [percentileData, setPercentileData] = useState<
    { yourPercentile: number; percentiles: PercentileData } | null | undefined
  >(undefined);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        // If the player doesn't have a faction return
        if (!faction) {
          setPercentileData(null);
          return;
        }

        const data = await fetchLeaderboardData(farmId);

        // Error
        if (!data) {
          setPercentileData(null);
          return;
        }

        const rankDetails = data.factions.farmRankingDetails?.find(
          (rank) => rank.id === playerName
        );
        const yourRank = rankDetails?.rank;

        if (yourRank) {
          const totalMembers = data.factions.totalMembers[faction.name];

          const yourPercentile = (yourRank / totalMembers) * 100;

          setPercentileData({
            yourPercentile,
            percentiles: data.factions.percentiles[faction.name],
          });
        } else {
          // Something went wrong searching for the leaderboard
          // Default to the basic screens without statistics
          setPercentileData(null);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error loading leaderboards", e);

        if (!percentileData) setPercentileData(null);
      }
    };

    fetchLeaderboards();
  }, []);

  if (percentileData === undefined) {
    return <Loading />;
  }

  if (!faction || percentileData === null) {
    return (
      <div className="p-2">
        <Label type="default" className="-ml-1 mb-2">
          {t("faction.emblems")}
        </Label>
        <p>{t("faction.tradeEmblems")}</p>
      </div>
    );
  }

  const playerRank = [...RANKS[faction.name]]
    .reverse()
    .find((r) => r.percentile >= percentileData.yourPercentile);

  return (
    <div className="p-2">
      <Label type="default" className="-ml-1 mb-2">
        {playerRank?.name}
      </Label>
      <p className="mb-2">{t("faction.tradeEmblems")}</p>

      <table className="w-full text-xs table-fixed border-collapse">
        <tbody>
          {RANKS[faction.name].map((rank) => (
            <tr
              key={rank.name}
              className={classNames({
                "bg-[#ead4aa]": rank.name === playerRank?.name,
              })}
            >
              <td style={{ border: "1px solid #b96f50" }}>
                <div className="flex items-center">
                  <img src={rank.icon} className="mx-2" />
                  <p className="p-1.5">{rank.name}</p>
                </div>
              </td>
              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 truncate"
              >
                {`${percentileData.percentiles[rank.percentile]} ${t(
                  "faction.emblems"
                )}`}
              </td>
              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 relative"
              >
                {rank.boost && <Label type="vibrant">{rank.boost}</Label>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>{t("faction.marksBoost")}</div>
    </div>
  );
};
