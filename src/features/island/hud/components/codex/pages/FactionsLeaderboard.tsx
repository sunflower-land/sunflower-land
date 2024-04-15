import React from "react";

import classNames from "classnames";
import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components";
import { TicketTable } from "features/game/expansion/components/leaderboard/TicketTable";
import {
  FactionLeaderboard,
  FactionName,
} from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { getSeasonalTicket } from "features/game/types/seasons";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import { getRelativeTime } from "lib/utils/time";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { tab } from "lib/utils/sfx";

interface LeaderboardProps {
  farmId: number;
  data: FactionLeaderboard | undefined;
}
export const FactionsLeaderboard: React.FC<LeaderboardProps> = ({
  farmId,
  data,
}) => {
  const { t } = useAppTranslation();
  const seasonTicket = getSeasonalTicket();

  // TODO FACTION - get faction from game state
  const [selected, setSelected] = React.useState<FactionName>("bumpkins");
  const positions: Record<FactionName, string> = {
    bumpkins: "1st",
    goblins: "2nd",
    nightshades: "3rd",
    sunflorians: "4th",
  };

  const select = (faction: FactionName) => {
    setSelected(faction);
    tab.play();
  };

  return data ? (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 w-full scrollable overflow-y-auto pl-1">
        <Faction
          name={"bumpkins"}
          position={positions.bumpkins}
          isSelected={selected === "bumpkins"}
          onClick={() => select("bumpkins")}
        />
        <Faction
          name={"goblins"}
          position={positions.goblins}
          isSelected={selected === "goblins"}
          onClick={() => select("goblins")}
        />
        <Faction
          name={"nightshades"}
          position={positions.nightshades}
          isSelected={selected === "nightshades"}
          onClick={() => select("nightshades")}
        />
        <Faction
          name={"sunflorians"}
          position={positions.sunflorians}
          isSelected={selected === "sunflorians"}
          onClick={() => select("sunflorians")}
        />
      </div>

      <div className="p-1 mb-1 space-y-1">
        <p className="text-sm capitalize">{`${selected.slice(0, -1)} ${t(
          "leaderboard.leaderboard"
        )}`}</p>
        <p className="text-[12px]">
          {t("last.updated")} {getRelativeTime(data.lastUpdated)}
        </p>
      </div>
      {data.topTens[selected] && (
        <TicketTable
          rankings={data.topTens[selected]}
          farmId={Number(farmId)}
        />
      )}
      {data.farmRankingDetails && (
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
  ) : (
    <Loading />
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
        <div className="flex flex-col pb-2">
          <div className="flex items-center my-1">
            <div className="relative mb-2 mr-0.5 -ml-1">
              <NPCIcon parts={NPC_WEARABLES["betty"]} />
            </div>
            <span className="text-xxs">{name}</span>
          </div>
        </div>

        <Label
          type="success"
          // TODO FACTIONS
          // icon={coinsImg}
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
