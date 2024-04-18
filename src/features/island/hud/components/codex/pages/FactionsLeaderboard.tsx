import React from "react";

import classNames from "classnames";
import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components";
import { TicketTable } from "features/game/expansion/components/leaderboard/TicketTable";
import { FactionLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRelativeTime } from "lib/utils/time";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import { PIXEL_SCALE, TEST_FARM } from "features/game/lib/constants";
import { tab } from "lib/utils/sfx";
import { hasFeatureAccess } from "lib/flags";

import { FactionName } from "features/game/types/game";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { isMobile } from "mobile-device-detect";

import maximus from "assets/sfts/maximus.gif";
import trophy from "assets/icons/trophy.png";

const POSITION_LABELS = ["1st", "2nd", "3rd", "4th"];

interface LeaderboardProps {
  farmId: number;
  faction: FactionName;
  isLoading: boolean;
  data: FactionLeaderboard | null;
}

export const FactionsLeaderboard: React.FC<LeaderboardProps> = ({
  farmId,
  faction,
  isLoading,
  data,
}) => {
  const { t } = useAppTranslation();

  // TODO FACTION - get faction from game state
  const [selected, setSelected] = React.useState<FactionName>(faction);

  const select = (faction: FactionName) => {
    setSelected(faction);
    hasFeatureAccess(TEST_FARM, "SOUND") && tab.play();
  };

  if (isLoading && !data) return <Loading />;

  if (!data)
    return (
      <div className="p-1">
        <Label type="danger">{t("leaderboard.error")}</Label>
      </div>
    );

  const topTen = data.topTens[selected];

  const sortedFactions = Object.entries(data.totalTickets)
    .sort((a, b) => b[1] - a[1])
    .map(([key], i) => [key, POSITION_LABELS[i]]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 w-full scrollable overflow-y-auto pl-1">
        {sortedFactions.map(([faction, position]) => (
          <Faction
            name={faction as FactionName}
            position={position}
            isSelected={selected === faction}
            onClick={() => select(faction as FactionName)}
          />
        ))}
      </div>

      {!isMobile && (
        <div className="p-1 mb-1 space-y-1">
          <p className="text-sm capitalize">{`${selected.slice(0, -1)} ${t(
            "leaderboard.leaderboard"
          )}`}</p>
          <p className="text-[12px]">
            {t("last.updated")} {getRelativeTime(data.lastUpdated)}
          </p>
        </div>
      )}
      {!isMobile && topTen && (
        <TicketTable rankings={topTen} farmId={Number(farmId)} />
      )}
      {!isMobile && data.farmRankingDetails && (
        <>
          <div className="flex justify-center items-center">
            <p className="mb-[13px]">{"..."}</p>
          </div>
          <TicketTable
            showHeader={false}
            rankings={data.farmRankingDetails}
            farmId={Number(farmId)}
          />
        </>
      )}
    </div>
  );
};

interface FactionProps {
  name: FactionName;
  position: string;
  isSelected: boolean;
  onClick: () => void;
}
const Faction: React.FC<FactionProps> = ({
  name,
  onClick,
  isSelected,
  position,
}) => {
  const npcs: Record<Exclude<FactionName, "nightshades">, NPCName> = {
    bumpkins: "lady day",
    goblins: "grommy",
    sunflorians: "robert",
  };

  return (
    <div className="py-1 px-2" key={name}>
      <OuterPanel
        onClick={onClick}
        className={classNames(
          "w-full cursor-pointer hover:bg-brown-200 !py-2 relative",
          {
            "bg-brown-200 img-highlight": isSelected,
          }
        )}
        style={{ paddingBottom: "20px" }}
      >
        <div className="flex flex-col items-center space-y-1">
          <span className="text-xs capitalize">{name}</span>
          <div className="relative h-[3.25rem]">
            {name === "nightshades" ? (
              <img
                src={maximus}
                className="-scale-x-100"
                style={{ width: 14 * PIXEL_SCALE }}
              />
            ) : (
              <NPCIcon parts={NPC_WEARABLES[npcs[name]]} />
            )}
          </div>
        </div>
        <Label
          type="success"
          icon={position === "1st" ? trophy : undefined}
          className="absolute -bottom-2 text-center mt-1 p-1 left-[-8px] z-10 h-6"
          style={{ width: "calc(100% + 15px)" }}
        >
          {position}
        </Label>
        {isSelected && (
          <div id="select-box" className="hidden md:block">
            <img
              className="absolute pointer-events-none"
              src={selectBoxTL}
              style={{
                top: `${PIXEL_SCALE * -3}px`,
                left: `${PIXEL_SCALE * -3}px`,
                width: `${PIXEL_SCALE * 8}px`,
              }}
            />
            <img
              className="absolute pointer-events-none"
              src={selectBoxTR}
              style={{
                top: `${PIXEL_SCALE * -3}px`,
                right: `${PIXEL_SCALE * -3}px`,
                width: `${PIXEL_SCALE * 8}px`,
              }}
            />
          </div>
        )}
      </OuterPanel>
    </div>
  );
};
