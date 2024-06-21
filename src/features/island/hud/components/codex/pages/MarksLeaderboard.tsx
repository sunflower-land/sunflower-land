import React, { useState } from "react";

import classNames from "classnames";
import { Label } from "components/ui/Label";
import { InnerPanel, OuterPanel } from "components/ui/Panel";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRelativeTime } from "lib/utils/time";

import { FactionName } from "features/game/types/game";

import mark from "assets/icons/faction_mark.webp";
import factions from "assets/icons/factions.webp";

import { FACTION_EMBLEM_ICONS } from "features/world/ui/factions/components/ClaimEmblems";
import { SquareIcon } from "components/ui/SquareIcon";
import { getKeys } from "features/game/types/craftables";
import { KingdomLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { Loading } from "features/auth/components";
import { RANKS } from "features/game/lib/factionRanks";

interface FilterCheckboxProps {
  faction: FactionName;
  selected: boolean;
  onClick: () => void;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  faction,
  selected,
  onClick,
}) => (
  <OuterPanel
    className={classNames(
      "flex items-center relative p-0.5 mb-1 cursor-pointer"
    )}
    onClick={onClick}
    style={{
      background: selected ? "#ead4aa" : undefined,
    }}
  >
    <SquareIcon icon={FACTION_EMBLEM_ICONS[faction]} width={9} />
  </OuterPanel>
);

interface MarksLeaderboardProps {
  isLoading: boolean;
  data: KingdomLeaderboard | null;
  id: string;
}

export const MarksLeaderboard: React.FC<MarksLeaderboardProps> = ({
  data,
  isLoading,
  id: playerId,
}) => {
  const { t } = useAppTranslation();

  const [selected, setSelected] = useState<FactionName>();
  const [leaderboard, setLeaderboard] = useState<"marks" | "emblems">("marks");

  const select = (faction: FactionName) => {
    setSelected((prevFaction) =>
      prevFaction === faction ? undefined : faction
    );
  };

  if (isLoading && !data) return <Loading />;

  if (!data)
    return (
      <div className="p-1">
        <Label type="danger">{t("leaderboard.error")}</Label>
      </div>
    );

  const topN = Object.entries(data[leaderboard].topTens)
    .filter(([faction]) => !selected || selected === faction)
    .flatMap(([faction, entries]) =>
      entries.map((entry) => ({ ...entry, faction }))
    )
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0));

  return (
    <InnerPanel
      className={classNames(
        "flex flex-col h-full overflow-hidden overflow-y-auto scrollable"
      )}
    >
      <div className="flex justify-between">
        <div>
          <Label type="default">{`Kingdom`}</Label>
          <span className="text-xs flex-nowrap pl-1">
            {`${leaderboard === "marks" ? "Marks" : "Emblems"}`}
          </span>
        </div>
        <div className="flex space-x-1">
          {getKeys(FACTION_EMBLEM_ICONS).map((faction) => (
            <FilterCheckbox
              key={`faction-${faction}`}
              faction={faction}
              selected={selected === faction}
              onClick={() => select(faction)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end pb-1"></div>
      <table className="w-full text-xs table-auto border-collapse">
        <thead>
          <tr>
            <th className="w-4">
              <div
                className="flex text-xxs"
                onClick={() =>
                  setLeaderboard((prev) =>
                    prev === "marks" ? "emblems" : "marks"
                  )
                }
              >
                <OuterPanel
                  className={classNames(
                    "flex items-center relative cursor-pointer"
                  )}
                  style={{
                    background: leaderboard === "marks" ? "#ead4aa" : undefined,
                  }}
                >
                  {leaderboard === "marks" && (
                    <SquareIcon icon={factions} width={9} />
                  )}
                  {leaderboard === "emblems" && (
                    <SquareIcon icon={mark} width={9} />
                  )}
                </OuterPanel>
              </div>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
              <p>{t("player")}</p>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="w-2/5 p-1.5">
              {leaderboard === "marks" && <p>{`Marks`}</p>}
              {leaderboard === "emblems" && <p>{`Emblems`}</p>}
            </th>
          </tr>
        </thead>
        <tbody>
          {topN
            .slice(0, 7)
            .map(({ id, rank, count, faction, factionRank }, index) => {
              const playerRank = RANKS[factionRank];

              return (
                <tr
                  key={index}
                  className={classNames({
                    "bg-[#ead4aa]": id === playerId,
                  })}
                >
                  <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                    {rank ?? index + 1}
                  </td>
                  <td
                    style={{ border: "1px solid #b96f50" }}
                    className="truncate"
                  >
                    <div className="flex items-center space-x-1">
                      <span className="p-1.5">{id}</span>
                      <img src={playerRank?.icon} className="h-auto" />
                    </div>
                  </td>

                  <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                    <div className="flex items-center space-x-1 justify-end">
                      {leaderboard === "emblems" && (
                        <>
                          <span>{count}</span>
                          <img
                            src={FACTION_EMBLEM_ICONS[faction as FactionName]}
                            className="h-4"
                          />
                        </>
                      )}
                      {leaderboard === "marks" && (
                        <>
                          <span>{count}</span>
                          <img src={mark} className="h-4" />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          <tr>
            <td colSpan={3}>
              <div className="flex justify-center items-center">
                <p className="mb-[10px]">{"..."}</p>
              </div>
            </td>
          </tr>
          {/* {DATA.filter(({ faction }) => selected[faction])
            .slice(0, 3)
            .map(
              ({ farmId, rank, marks, username, faction, emblems }, index) => (
                <tr
                  key={index}
                  className={classNames({
                    "bg-[#ead4aa]": farmId === PLAYER_ID,
                  })}
                >
                  <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                    {rank ?? index + 1}
                  </td>
                  <td
                    style={{ border: "1px solid #b96f50" }}
                    className="truncate"
                  >
                    <div className="flex items-center space-x-1">
                      <span className="p-1.5">{username}</span>
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
                      {leaderboard === "emblems" && (
                        <>
                          <span>{emblems}</span>
                          <img
                            src={FACTION_EMBLEM_ICONS[faction as FactionName]}
                            className="h-4"
                          />
                        </>
                      )}
                      {leaderboard === "marks" && (
                        <>
                          <span>{marks}</span>
                          <img src={mark} className="h-4" />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            )} */}
        </tbody>
      </table>
      <div className="flex justify-between font-secondary text-xs pt-1">
        <span>
          {t("last.updated")} {getRelativeTime(Date.now())}
        </span>
        <span>{`Total: 123k`}</span>
      </div>
    </InnerPanel>
  );
};
