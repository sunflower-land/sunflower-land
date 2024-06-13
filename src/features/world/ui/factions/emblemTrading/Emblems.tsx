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
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useEffect, useState } from "react";

type Rank = {
  name: string;
  percentile: 1 | 5 | 10 | 20 | 50 | 80 | 100;
  icon?: string;
  boost?: string;
};

const BUMPKIN_RANKS: Rank[] = [
  {
    name: "Forager",
    percentile: 100,
  },
  {
    name: "Rancher",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 80,
    boost: "1.05x Marks",
  },
  {
    name: "Agrarian",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 50,
    boost: "2.5x Marks",
  },
  {
    name: "Steward",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 20,
    boost: "4x Marks",
  },
  {
    name: "Sentinel",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 10,
    boost: "4.5x Marks",
  },
  {
    name: "Warden",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 5,
    boost: "4.8x Marks",
  },
  {
    name: "Overseer",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 1,
    boost: "5x Marks",
  },
];

const NIGHTSHADE_RANKS: Rank[] = [
  {
    name: "Pagan",
    percentile: 100,
  },
  {
    name: "Occultist",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 80,
    boost: "1.05x Marks",
  },
  {
    name: "Enchanter",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 50,
    boost: "2.5x Marks",
  },
  {
    name: "Raver",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 20,
    boost: "4x Marks",
  },
  {
    name: "Witch",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 10,
    boost: "4.5x Marks",
  },
  {
    name: "Sorcerer",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 5,
    boost: "4.8x Marks",
  },
  {
    name: "Lich",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 1,
    boost: "5x Marks",
  },
];

const GOBLIN_RANKS: Rank[] = [
  {
    name: "Hobgoblin",
    percentile: 100,
  },
  {
    name: "Grunt",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 80,
    boost: "1.05x Marks",
  },
  {
    name: "Marauder",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 50,
    boost: "2.5x Marks",
  },
  {
    name: "Elite",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 20,
    boost: "4x Marks",
  },
  {
    name: "Commander",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 10,
    boost: "4.5x Marks",
  },
  {
    name: "Warchief",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 5,
    boost: "4.8x Marks",
  },
  {
    name: "Warlord",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 1,
    boost: "5x Marks",
  },
];

const SUNFLORIAN_RANKS: Rank[] = [
  {
    name: "Initiate",
    percentile: 100,
  },
  {
    name: "Squire",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 80,
    boost: "1.05x Marks",
  },
  {
    name: "Captain",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 50,
    boost: "2.5x Marks",
  },
  {
    name: "Knight",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 20,
    boost: "4x Marks",
  },
  {
    name: "Guardian",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 10,
    boost: "4.5x Marks",
  },
  {
    name: "Paladin",
    icon: ITEM_DETAILS.Sunflower.image,
    percentile: 5,
    boost: "4.8x Marks",
  },
  {
    name: "Archduke",
    icon: ITEM_DETAILS.Sunflower.image,
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
              <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                <div className="flex">
                  {rank.icon && <img src={rank.icon} className="h-4 mr-2" />}
                  {rank.name}
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
