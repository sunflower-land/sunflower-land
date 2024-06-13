import React, { useState } from "react";

import classNames from "classnames";
import { Label } from "components/ui/Label";
import { ButtonPanel, InnerPanel, OuterPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components";
import { TicketTable } from "features/game/expansion/components/leaderboard/TicketTable";
import {
  FactionLeaderboard,
  MarkLeaderboard,
} from "features/game/expansion/components/leaderboard/actions/leaderboard";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRelativeTime } from "lib/utils/time";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { FactionName } from "features/game/types/game";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { isMobile } from "mobile-device-detect";

import maximus from "assets/sfts/maximus.gif";
import trophy from "assets/icons/trophy.png";
import shadow from "assets/npcs/shadow.png";
import chevron from "assets/icons/factions/chevron.webp";
import goblin_chevron from "assets/icons/factions/goblin_chevron.webp";
import nightshade_chevron from "assets/icons/factions/nightshade_chevron.webp";
import mark from "assets/icons/faction_mark.webp";
import factions from "assets/icons/factions.webp";

import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { formatNumber } from "lib/utils/formatNumber";
import { FACTION_POINT_ICONS } from "features/world/ui/factions/FactionDonationPanel";
import { useSound } from "lib/utils/hooks/useSound";
import { FACTION_EMBLEM_ICONS } from "features/world/ui/factions/components/ClaimEmblems";
import { SquareIcon } from "components/ui/SquareIcon";
import { getKeys } from "features/game/types/craftables";

const POSITION_LABELS = ["1st", "2nd", "3rd", "4th"];

interface LeaderboardEntry {
  username: string;
  marks: number;
  emblems: number;
  faction: FactionName;
  rank: 1 | 2 | 3 | 4;
  farmId: 1 | 2 | 3 | 4;
}

/* TODO feat/marks-leaderboard REPLACE with real data */

const PLAYER_ID = 1;
const PLAYER_FACTION = "nightshades";
const DATA: LeaderboardEntry[] = [
  {
    username: "Parsley",
    marks: 100,
    emblems: 10,
    faction: "nightshades",
    rank: 1,
    farmId: 1,
  },
  {
    username: "Sage",
    marks: 50,
    faction: "bumpkins",
    rank: 2,
    farmId: 2,
    emblems: 5,
  },
  {
    username: "Rosemary",
    marks: 25,
    faction: "goblins",
    rank: 3,
    farmId: 3,
    emblems: 20000,
  },
  {
    username: "Thyme",
    marks: 10,
    faction: "sunflorians",
    rank: 4,
    farmId: 4,
    emblems: 60000,
  },
  {
    username: "Parsley",
    marks: 100,
    emblems: 10,
    faction: "nightshades",
    rank: 1,
    farmId: 1,
  },
  {
    username: "Sage",
    marks: 50,
    faction: "bumpkins",
    rank: 2,
    farmId: 2,
    emblems: 5,
  },
  {
    username: "Rosemary",
    marks: 25,
    faction: "goblins",
    rank: 3,
    farmId: 3,
    emblems: 20000,
  },
  {
    username: "Thyme",
    marks: 10,
    faction: "sunflorians",
    rank: 4,
    farmId: 4,
    emblems: 60000,
  },
  {
    username: "Parsley",
    marks: 100,
    emblems: 10,
    faction: "nightshades",
    rank: 1,
    farmId: 1,
  },
  {
    username: "Sage",
    marks: 50,
    faction: "bumpkins",
    rank: 2,
    farmId: 2,
    emblems: 5,
  },
  {
    username: "Rosemary",
    marks: 25,
    faction: "goblins",
    rank: 3,
    farmId: 3,
    emblems: 20000,
  },
  {
    username: "Thyme",
    marks: 10,
    faction: "sunflorians",
    rank: 4,
    farmId: 4,
    emblems: 60000,
  },
];

/* END TODO */

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

interface LeaderboardProps {}

export const MarksLeaderboard: React.FC<LeaderboardProps> = ({}) => {
  const { t } = useAppTranslation();

  const [selected, setSelected] = useState({
    nightshades: true,
    bumpkins: true,
    goblins: true,
    sunflorians: true,
  });
  const [leaderboard, setLeaderboard] = useState<"marks" | "emblems">("marks");

  const select = (faction: FactionName) => {
    const updated = { ...selected, [faction]: !selected[faction] };
    // At least one must be true
    if (!Object.values(updated).some((s) => s)) return;

    setSelected(updated);
  };

  return (
    <InnerPanel
      className={classNames(
        "flex flex-col h-full overflow-hidden overflow-y-auto scrollable"
      )}
    >
      <div className="flex justify-between">
        <div>
          <Label type="default">Kingdom</Label>
          <span className="text-xs flex-nowrap pl-1">
            {leaderboard === "marks" ? "Marks" : "Emblems"}
          </span>
        </div>
        <div className="flex space-x-1">
          {getKeys(FACTION_EMBLEM_ICONS).map((faction) => (
            <FilterCheckbox
              faction={faction}
              selected={selected[faction]}
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
              {leaderboard === "marks" && <p>Marks</p>}
              {leaderboard === "emblems" && <p>Emblems</p>}
            </th>
          </tr>
        </thead>
        <tbody>
          {DATA.filter(({ faction }) => selected[faction])
            .slice(0, 7)
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
                    className="p-1.5 truncate"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{username}</span>
                      {faction === "nightshades" && (
                        <img src={nightshade_chevron} className="h-auto" />
                      )}
                      {faction === "goblins" && (
                        <img src={goblin_chevron} className="h-auto" />
                      )}
                      {faction === "bumpkins" && (
                        <img src={chevron} className="h-auto" />
                      )}
                    </div>
                  </td>

                  <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                    <div className="flex items-center space-x-1 justify-end">
                      {/* <img
                        src={FACTION_EMBLEM_ICONS[faction]}
                        className="w-4"
                      /> */}
                      {leaderboard === "emblems" && (
                        <>
                          <span>{emblems}</span>
                          <img
                            src={FACTION_EMBLEM_ICONS[faction]}
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
            )}
          <tr>
            <td colSpan={3}>
              <div className="flex justify-center items-center">
                <p className="mb-[10px]">{"..."}</p>
              </div>
            </td>
          </tr>
          {DATA.filter(({ faction }) => selected[faction])
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
                    className="p-1.5 truncate"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{username}</span>
                      {faction === "nightshades" && (
                        <img src={nightshade_chevron} className="h-auto" />
                      )}
                      {faction === "goblins" && (
                        <img src={goblin_chevron} className="h-auto" />
                      )}
                      {faction === "bumpkins" && (
                        <img src={chevron} className="h-auto" />
                      )}
                    </div>
                  </td>

                  <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                    <div className="flex items-center space-x-1 justify-end">
                      {/* <img
                        src={FACTION_EMBLEM_ICONS[faction]}
                        className="w-4"
                      /> */}
                      {leaderboard === "emblems" && (
                        <>
                          <span>{emblems}</span>
                          <img
                            src={FACTION_EMBLEM_ICONS[faction]}
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
            )}
        </tbody>
      </table>
      <div className="flex justify-between font-secondary text-xs pt-1">
        <span>
          {t("last.updated")} {getRelativeTime(Date.now())}
        </span>
        <span>Total: 123k</span>
      </div>
    </InnerPanel>
  );
};
