import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";
import { Context } from "features/game/GameProvider";
import {
  getChampionsLeaderboard,
  KingdomLeaderboard,
} from "features/game/expansion/components/leaderboard/actions/leaderboard";
import {
  BONUS_FACTION_PRIZES,
  FACTION_PRIZES,
  getFactionScores,
  getWeekKey,
  getPreviousWeek,
  getWeekNumber,
} from "features/game/lib/factions";
import { getKeys } from "features/game/types/decorations";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import gift from "assets/icons/gift.png";
import trophy from "assets/icons/trophy.png";
import coins from "assets/icons/coins.webp";
import sfl from "assets/icons/sfl.webp";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import {
  FactionName,
  FactionPrize,
  InventoryItemName,
} from "features/game/types/game";
import { Fireworks } from "./components/Fireworks";
import { ITEM_DETAILS } from "features/game/types/images";
import { formatNumber } from "lib/utils/formatNumber";
import { getSeasonalTicket } from "features/game/types/seasons";
import { toOrdinalSuffix } from "features/retreat/components/auctioneer/AuctionLeaderboardTable";
import { NPC } from "features/island/bumpkin/components/NPC";

interface Props {
  onClose: () => void;
}

export const Champions: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);

  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel
      onClose={onClose}
      tabs={[
        {
          name: t("leaderboard.champions"),
          icon: trophy,
        },
        {
          name: t("leaderboard.prizes"),
          icon: gift,
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === 0 && <ChampionsLeaderboard onClose={onClose} />}
      {tab === 1 && (
        <div
          className="p-1 overflow-y-scroll scrollable pr-1"
          style={{ maxHeight: "350px" }}
        >
          <ChampionsPrizes />
        </div>
      )}
    </CloseButtonPanel>
  );
};

export const ChampionsLeaderboard: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<KingdomLeaderboard>();

  const { t } = useAppTranslation();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await getChampionsLeaderboard({
        farmId: Number(gameState.context.farmId),
        date: getPreviousWeek(),
      });

      setLeaderboard(data);
      setIsLoading(false);
    };

    load();
  }, []);

  if (isLoading || !leaderboard) {
    return <Loading />;
  }

  if (leaderboard.status === "pending") {
    return <Label type="formula">{t("leaderboard.resultsPending")}</Label>;
  }

  const { winner } = getFactionScores({ leaderboard });

  if (!winner) {
    return null;
  }

  const topRanks = leaderboard.marks.topTens[winner];

  const playerId = gameState.context.state.username ?? gameState.context.farmId;

  return (
    <>
      <Fireworks />

      <div className="flex justify-between items-center mb-1">
        <Label type="default">{t("leaderboard.champions")}</Label>
        <Label type="formula">{`Week #${getWeekNumber() - 3}`}</Label>
      </div>
      <p className="text-sm mb-2 pl-1">
        {t("leaderboard.congratulations", { faction: winner })}
      </p>
      <Label type="default" className="mb-2">
        {t("leaderboard.leaderboard")}
      </Label>
      <table className="w-full text-xs table-auto border-collapse">
        <thead>
          <tr>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
              <p>{t("leaderboard.position")}</p>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
              <p>{t("leaderboard.player")}</p>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="w-2/5 p-1.5">
              <p>{t("leaderboard.score")}</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {topRanks.slice(0, 7).map(({ id, rank, count, bumpkin }, index) => (
            <tr
              key={index}
              className={classNames({
                "bg-[#ead4aa]": id === playerId,
              })}
            >
              <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                {toOrdinalSuffix(rank ?? index + 1)}
              </td>
              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 text-left pl-8 relative truncate"
              >
                {bumpkin && (
                  <div
                    className="absolute"
                    style={{ left: "4px", top: "-7px" }}
                  >
                    <NPC width={20} parts={bumpkin} />
                  </div>
                )}

                {id}
              </td>

              <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                <div className="flex items-center space-x-1 justify-end">
                  <>
                    <span>{formatNumber(count)}</span>
                  </>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const TROPHIES: Record<FactionName, Record<number, InventoryItemName>> = {
  goblins: {
    1: "Goblin Gold Champion",
    2: "Goblin Silver Champion",
    3: "Goblin Bronze Champion",
  },
  bumpkins: {
    1: "Bumpkin Gold Champion",
    2: "Bumpkin Silver Champion",
    3: "Bumpkin Bronze Champion",
  },
  nightshades: {
    1: "Nightshade Gold Champion",
    2: "Nightshade Silver Champion",
    3: "Nightshade Bronze Champion",
  },
  sunflorians: {
    1: "Sunflorian Gold Champion",
    2: "Sunflorian Silver Champion",
    3: "Sunflorian Bronze Champion",
  },
};

type PrizeRow = FactionPrize & { from: number; to?: number };

export const ChampionsPrizes: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const currentFaction = state.faction?.name;

  const week = getWeekKey();
  const ticket = getSeasonalTicket(new Date(week));

  const isPharaohsTreasure = false;

  const MONTHLY_PRIZES = BONUS_FACTION_PRIZES[week];

  // Group together rows that have the same prize
  const prizes: PrizeRow[] = [];
  let previous: PrizeRow | undefined = undefined;
  getKeys(FACTION_PRIZES(ticket, isPharaohsTreasure)).forEach((key, index) => {
    const prize = FACTION_PRIZES(ticket, isPharaohsTreasure)[key];

    let isSameAsPrevious = false;
    if (previous) {
      const { from, to, ...old } = previous;
      isSameAsPrevious = JSON.stringify(prize) === JSON.stringify(old);
    }

    if (!isSameAsPrevious) {
      if (previous) {
        prizes.push({ ...previous, to: index }); // Close the previous prize range
      }

      previous = {
        ...prize,
        from: index + 1,
      };
    } else if (previous) {
      previous.to = index + 1; // Extend the current prize range
    }
  });

  if (previous) prizes.push(previous as PrizeRow);

  return (
    <>
      <div className="flex justify-between items-center">
        <Label type="default" className="mb-2 ml-1" icon={trophy}>
          {t("leaderboard.faction.champion")}
        </Label>
        {!!MONTHLY_PRIZES && (
          <Label type="vibrant" className="mb-2 ml-1" icon={gift}>
            {t("leaderboard.faction.bonusPrizeWeek")}
          </Label>
        )}
      </div>
      <p className="text-xs mb-2">{t("leaderboard.faction.championPrizes")}</p>

      <table className="w-full text-xs table-auto border-collapse mb-2">
        <tbody>
          <tr>
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
              {`All`}
            </td>
            <td style={{ border: "1px solid #b96f50" }} className="truncate">
              <div className="flex items-center space-x-1">
                <span className="p-1.5">
                  {t("leaderboard.faction.bonusMarks")}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <Label type="default" className="mb-2 ml-1" icon={gift}>
        {t("leaderboard.faction.topPlayers")}
      </Label>
      <p className="text-xs mb-2">{t("leaderboard.faction.topPlayerPrizes")}</p>
      <table className="w-full text-xs table-auto border-collapse">
        <tbody>
          {prizes.map((prize, index) => {
            const trophy =
              currentFaction && TROPHIES[currentFaction][index + 1];
            const bonus = MONTHLY_PRIZES?.[prize.from];

            return (
              <tr key={index}>
                <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                  {prize.from === prize.to || !prize.to
                    ? prize.from
                    : [prize.from, prize.to].join(" - ")}
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="truncate"
                >
                  <div className="flex items-center space-x-2 pl-1 flex-wrap">
                    {!!prize.coins && (
                      <div className="flex items-center">
                        <span className="text-xs">{`${prize.coins} `}</span>
                        <img src={coins} className="h-4 ml-0.5" />
                      </div>
                    )}
                    {!!prize.sfl && (
                      <div className="flex items-center">
                        <span className="text-xs">{`${prize.sfl} `}</span>
                        <img src={sfl} className="h-4 ml-0.5" />
                      </div>
                    )}
                    {getKeys(prize.items)
                      .filter((item) => (prize.items[item] ?? 0) > 0)
                      .map((item, index) => {
                        const count = prize.items[item];
                        return (
                          <div key={index} className="flex items-center">
                            <span className="text-xs">{`${count} `}</span>
                            <img
                              src={ITEM_DETAILS[item].image}
                              className="h-4 ml-0.5"
                            />
                          </div>
                        );
                      })}
                    {!!trophy && (
                      <div className="flex items-center">
                        <span className="text-xs">{`Trophy `}</span>
                        <img
                          src={ITEM_DETAILS[trophy].image}
                          className="h-4 ml-0.5"
                        />
                      </div>
                    )}
                  </div>
                  {getKeys(bonus?.items ?? {}).map((item, index) => {
                    return (
                      <Label
                        key={index}
                        type="vibrant"
                        icon={ITEM_DETAILS[item].image}
                        className="m-1"
                      >
                        {`${bonus.items?.[item] ?? 0} x ${item} `}
                      </Label>
                    );
                  })}
                  {getKeys(bonus?.wearables ?? {}).map((item, index) => {
                    return (
                      <Label
                        key={index}
                        type="vibrant"
                        icon={gift}
                        className="mt-1 ml-2 mb-1"
                      >
                        {`${bonus.wearables?.[item] ?? 0} x ${item} `}
                      </Label>
                    );
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
