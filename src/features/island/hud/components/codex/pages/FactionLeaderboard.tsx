import React, { useState } from "react";

import classNames from "classnames";
import { Label } from "components/ui/Label";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRelativeTime, secondsToString } from "lib/utils/time";

import { FactionName } from "features/game/types/game";

import chevron from "assets/icons/factions/sunflorians/chevron_one.webp";

import mark from "assets/icons/faction_mark.webp";
import trophy from "assets/icons/trophy.png";

import {
  KingdomLeaderboard,
  RankData,
} from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { Loading } from "features/auth/components";
import {
  getFactionScores,
  secondsTillWeekReset,
} from "features/game/lib/factions";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { formatNumber, shortenCount } from "lib/utils/formatNumber";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { ChampionsPrizes } from "features/world/ui/factions/Champions";

const npcs: Record<FactionName, NPCName> = {
  nightshades: "nyx",
  bumpkins: "barlow",
  goblins: "graxle",
  sunflorians: "reginald",
};

const POSITION_LABELS = ["1st", "2nd", "3rd", "4th"];

interface Props {
  leaderboard: KingdomLeaderboard | null;
  // Either username or fallback to farm ID
  playerId: string;
  faction: FactionName;
  isLoading: boolean;
}
export const FactionLeaderboard: React.FC<Props> = ({
  leaderboard,
  playerId,
  faction,
  isLoading,
}) => {
  const { t } = useAppTranslation();

  const [selected, setSelected] = useState<FactionName>();

  if (isLoading) {
    return (
      <InnerPanel className="p-1">
        <Loading />
      </InnerPanel>
    );
  }

  if (!leaderboard)
    return (
      <InnerPanel className="p-1">
        <Label type="danger">{t("leaderboard.error")}</Label>
      </InnerPanel>
    );

  const data = leaderboard.marks;

  const { scores } = getFactionScores({ leaderboard });

  const sortedFactions = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([key], i) => [key, POSITION_LABELS[i]]);

  if (selected) {
    return (
      <InnerPanel
        className={classNames(
          "flex flex-col h-full overflow-hidden overflow-y-auto scrollable",
        )}
      >
        <FactionDetails
          playerId={playerId}
          faction={selected}
          onBack={() => setSelected(undefined)}
          leaderboard={leaderboard}
          isPledged={faction === selected}
        />
      </InnerPanel>
    );
  }

  return (
    <InnerPanel
      className={classNames(
        "flex flex-col h-full overflow-hidden overflow-y-auto scrollable",
      )}
    >
      <div className="p-1">
        <div className="flex justify-between">
          <Label type="default">{`Weekly War`}</Label>
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            {`${secondsToString(secondsTillWeekReset(), {
              length: "short",
            })} left`}
          </Label>
        </div>
        <span className="text-xs mb-1">
          {`Complete tasks for your faction to win rewards and glory!`}
        </span>
        <div
          className="w-full  -mx-2"
          style={{
            width: `calc(100% + ${PIXEL_SCALE * 2}px)`,
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 w-full justify-between mb-2">
            {sortedFactions.map(([faction, position]) => (
              <div className="py-1 px-2" key={faction}>
                <ButtonPanel
                  className={classNames("w-full pt-2 relative")}
                  style={{ paddingBottom: "20px" }}
                  onClick={() => setSelected(faction as FactionName)}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-xs capitalize">{faction}</span>
                    <div className="h-11">
                      <div className="flex h-full items-center justify-center">
                        <div className="relative">
                          <NPCIcon
                            parts={
                              NPC_WEARABLES[
                                npcs[faction as FactionName] as NPCName
                              ]
                            }
                          />
                        </div>
                        <div className="flex pt-1">
                          <span className="font-secondary text-xs">
                            {shortenCount(
                              data.score[faction as FactionName] ?? 0,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Label
                    type="success"
                    icon={position === "1st" ? trophy : undefined}
                    className="absolute -bottom-2 text-center mt-1 p-1 left-[-8px] z-10 h-6"
                    style={{ width: "calc(100% + 16px)" }}
                  >
                    {position}
                  </Label>
                </ButtonPanel>
              </div>
            ))}
          </div>
        </div>
        <ChampionsPrizes />
      </div>
    </InnerPanel>
  );
};

export const FactionDetails: React.FC<{
  faction: FactionName;
  playerId: string;
  onBack: () => void;
  leaderboard: KingdomLeaderboard;
  isPledged?: boolean;
}> = ({ leaderboard, faction, playerId, onBack, isPledged }) => {
  const { t } = useAppTranslation();

  const topTen = leaderboard.marks.topTens[faction];

  // Where is the player ranked?
  let ranks: RankData[] = [];
  if (isPledged) {
    ranks = leaderboard.marks.marksRankingData ?? [];
  }

  return (
    <>
      <div className="flex mb-2">
        <div
          className="flex items-start"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            height: `${PIXEL_SCALE * 11}px`,
          }}
        >
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="cursor-pointer flex-none"
            onClick={onBack}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>
        <div className="flex-1 flex justify-center">
          <h2 className="text-center capitalize">{faction}</h2>
        </div>
        <div
          className="flex-none"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>
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
              <p>{t("leaderboard.weeklyScore")}</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {topTen.slice(0, 7).map(({ id, rank, count }, index) => (
            <tr
              key={index}
              className={classNames({
                "bg-[#ead4aa]": id === playerId,
              })}
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
                    <span>{formatNumber(count)}</span>
                    <img src={mark} className="h-4" />
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
              className={classNames({
                "bg-[#ead4aa]": id === playerId,
              })}
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
                    <span>{formatNumber(count)}</span>
                    <img src={mark} className="h-4" />
                  </>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between font-secondary text-xs pt-1">
        <span>
          {t("last.updated")} {getRelativeTime(leaderboard.lastUpdated)}
        </span>
      </div>
    </>
  );
};
