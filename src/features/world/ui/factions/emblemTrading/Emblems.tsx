import { useActor } from "@xstate/react";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";

import { FactionEmblem, FactionName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useEffect, useState } from "react";

import Decimal from "decimal.js-light";

import chevron from "assets/icons/factions/sunflorians/chevron_one.webp";

import mark from "assets/icons/faction_mark.webp";
import powerup from "assets/icons/level_up.png";
import { RANKS, getFactionRanking } from "features/game/lib/factionRanks";

import {
  EmblemsLeaderboard,
  getLeaderboard,
  RankData,
} from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router";
import { LeaveFaction } from "../LeaveFaction";
import { LastUpdatedAt } from "components/LastUpdatedAt";

interface Props {
  emblem: FactionEmblem;
  factionName: FactionName;
}

export const Emblems: React.FC<Props> = ({ emblem, factionName }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [leaderboard, setLeaderboard] = useState<EmblemsLeaderboard>();
  const [showLeaveFaction, setShowLeaveFaction] = useState(false);
  const { t } = useAppTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await getLeaderboard<EmblemsLeaderboard>({
        leaderboardName: "emblems",
        farmId: gameState.context.farmId,
      });
      setLeaderboard(data);
    };

    load();
  }, []);

  const leave = () => {
    gameService.send({ type: "faction.left" });
    gameService.send({ type: "SAVE" });
    navigate("/world/kingdom");
  };

  if (showLeaveFaction) {
    return (
      <LeaveFaction
        onClose={() => setShowLeaveFaction(false)}
        game={gameState.context.state}
        onLeave={leave}
      />
    );
  }

  const emblems = gameState.context.state.inventory[emblem] ?? new Decimal(0);
  const playerRank = getFactionRanking(factionName, emblems.toNumber());

  const id =
    gameService.getSnapshot()?.context?.state?.username ??
    String(gameService?.state?.context?.farmId);

  return (
    <div
      style={{ maxHeight: "400px" }}
      className="overflow-y-auto scrollable flex flex-wrap p-2"
    >
      <Label type="default" className="-ml-1 mb-2 capitalize">
        {playerRank?.name}
      </Label>
      <p className="mb-2">{t("faction.tradeEmblems")}</p>

      <table className="w-full text-xxs sm:text-xs table-fixed border-collapse mb-2">
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
            .sort((a, b) => b.emblemsRequired - a.emblemsRequired)
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

      {leaderboard ? (
        <Leaderboard
          faction={factionName}
          playerId={id}
          leaderboard={leaderboard}
          emblem={emblem}
        />
      ) : (
        <Label type="formula">{t("loading")}</Label>
      )}

      <Button className="mt-2" onClick={() => setShowLeaveFaction(true)}>
        {t("faction.leave")}
      </Button>
    </div>
  );
};

const Leaderboard: React.FC<{
  faction: FactionName;
  playerId: string;
  leaderboard: EmblemsLeaderboard;
  emblem: FactionEmblem;
}> = ({ leaderboard, faction, playerId, emblem }) => {
  const { t } = useAppTranslation();
  const topTen = leaderboard.emblems.topTens[faction];

  // Where is the player ranked?
  const ranks: RankData[] = leaderboard.emblems.emblemRankingData ?? [];

  return (
    <>
      <Label type="default" className="mb-1">
        {t("leaderboard.leaderboard")}
      </Label>
      <table className="w-full text-xs table-auto border-collapse">
        <thead>
          <tr>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
              <p>{t("leaderboard.position")}</p>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
              <p>{t("player")}</p>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="w-2/5 p-1.5">
              <p>{`Emblems`}</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {topTen.slice(0, 7).map(({ id, rank, count }, index) => (
            <tr
              key={index}
              className={classNames({ "bg-[#ead4aa]": id === playerId })}
            >
              <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                {rank ?? index + 1}
              </td>
              <td style={{ border: "1px solid #b96f50" }} className="truncate">
                <div className="flex items-center space-x-1">
                  <span className="p-1.5">{id}</span>
                </div>
              </td>

              <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                <div className="flex items-center space-x-1 justify-end">
                  <>
                    <span>{count}</span>
                    <img src={ITEM_DETAILS[emblem].image} className="h-4" />
                  </>
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={3}>
              <div className="flex justify-center items-center">
                <p className="mb-[10px]">{"..."}</p>
              </div>
            </td>
          </tr>
          {ranks.slice(0, 3).map(({ id, rank, count }, index) => (
            <tr
              key={index}
              className={classNames({ "bg-[#ead4aa]": id === playerId })}
            >
              <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                {rank ?? index + 1}
              </td>
              <td style={{ border: "1px solid #b96f50" }} className="truncate">
                <div className="flex items-center space-x-1">
                  <span className="p-1.5">{id}</span>
                  {faction === "nightshades" && (
                    <img src={chevron} className="h-auto" />
                  )}
                  {faction === "goblins" && (
                    <img src={chevron} className="h-auto" />
                  )}
                  {faction === "bumpkins" && (
                    <img src={chevron} className="h-auto" />
                  )}
                </div>
              </td>

              <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                <div className="flex items-center space-x-1 justify-end">
                  <>
                    <span>{count}</span>
                    <img src={ITEM_DETAILS[emblem].image} className="h-4" />
                  </>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between font-secondary text-xs pt-1">
        <LastUpdatedAt lastUpdated={leaderboard.lastUpdated} />
      </div>
    </>
  );
};
