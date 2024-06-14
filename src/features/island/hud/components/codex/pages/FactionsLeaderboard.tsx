import React from "react";

import classNames from "classnames";
import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components";
import { KingdomLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";

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

import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { formatNumber } from "lib/utils/formatNumber";
import { useSound } from "lib/utils/hooks/useSound";
import { FACTION_EMBLEM_ICONS } from "features/world/ui/factions/components/ClaimEmblems";
import { FactionTicketsTable } from "features/game/expansion/components/leaderboard/FactionTicketTable";

const POSITION_LABELS = ["1st", "2nd", "3rd", "4th"];

interface LeaderboardProps {
  id: string;
  faction: FactionName;
  isLoading: boolean;
  data: KingdomLeaderboard["emblems"] | null;
  lastUpdated: number | null;
}

export const FactionsLeaderboard: React.FC<LeaderboardProps> = ({
  id,
  faction,
  isLoading,
  data,
  lastUpdated,
}) => {
  const { t } = useAppTranslation();

  const tab = useSound("tab");

  // TODO FACTION - get faction from game state
  const [selected, setSelected] = React.useState<FactionName>(faction);
  const [mobileFullScreen, setMobileFullScreen] =
    React.useState<boolean>(false);

  const back = () => {
    setSelected(faction);
    setMobileFullScreen(false);
  };

  const select = (faction: FactionName) => {
    setSelected(faction);
    setMobileFullScreen(true);
    tab.play();
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

  const showLabel = !isMobile || mobileFullScreen || data.emblemRankingData;

  return (
    <>
      {(!isMobile || !mobileFullScreen) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 w-full justify-between pl-1">
          {sortedFactions.map(([faction, position]) => (
            <Faction
              key={faction}
              name={faction as FactionName}
              position={position}
              isSelected={selected === faction}
              onClick={() => select(faction as FactionName)}
              totalTickets={data.totalTickets[faction as FactionName]}
            />
          ))}
        </div>
      )}

      {showLabel ? (
        <div className="flex flex-col md:flex-row md:items-center justify-between px-1 pt-1 mb-1">
          <div className="flex items-center">
            {/** Show Back Button on Mobile  */}
            {isMobile && mobileFullScreen && (
              <img
                src={SUNNYSIDE.icons.arrow_left}
                className="cursor-pointer mr-2"
                onClick={back}
                style={{
                  width: `${PIXEL_SCALE * 8}px`,
                }}
              />
            )}
            <Label type="default" className="capitalize">{`${selected.slice(
              0,
              -1
            )} ${t("leaderboard.leaderboard")}`}</Label>
          </div>
          {lastUpdated && (
            <p className="font-secondary text-xs">
              {t("last.updated")} {getRelativeTime(lastUpdated)}
            </p>
          )}
        </div>
      ) : (
        <div className="p-1 pt-2">
          <Label type="info">{t("leaderboard.initialising")}</Label>
        </div>
      )}

      {(!isMobile || mobileFullScreen) && (
        <div className="scrollable overflow-y-auto max-h-full p-1">
          {selected === faction && data.emblemRankingData && (
            <div className="mb-3">
              <Label type="info" className="my-2">
                {t("leaderboard.yourPosition")}
              </Label>
              <FactionTicketsTable
                showHeader={true}
                rankings={data.emblemRankingData}
                id={id}
                factionName={selected}
              />
            </div>
          )}

          {topTen && (
            <>
              <Label type="info" className="my-2">
                {t("leaderboard.topTen")}
              </Label>
              <FactionTicketsTable
                rankings={topTen}
                id={id}
                factionName={selected}
              />
            </>
          )}
          <div className="flex justify-end">
            <p className="font-secondary text-xs">
              {`${t("leaderboard.factionMembers")}: ${formatNumber(
                data.totalMembers?.[selected] ?? 0
              )}`}
            </p>
          </div>
        </div>
      )}

      {isMobile && !mobileFullScreen && (
        <>
          {data.emblemRankingData && (
            <FactionTicketsTable
              showHeader={true}
              rankings={data.emblemRankingData}
              id={id}
              factionName={selected}
            />
          )}
          <div className="flex flex-col h-full justify-end">
            <Button onClick={() => setMobileFullScreen(true)}>
              {t("leaderboard.topTen")}
            </Button>
          </div>
        </>
      )}
    </>
  );
};

interface FactionProps {
  name: FactionName;
  position: string;
  totalTickets: number;
  isSelected: boolean;
  onClick: () => void;
}
const Faction: React.FC<FactionProps> = ({
  name,
  onClick,
  isSelected,
  position,
  totalTickets,
}) => {
  const npcs: Record<Exclude<FactionName, "nightshades">, NPCName> = {
    bumpkins: "robert",
    goblins: "grommy",
    sunflorians: "lady day",
  };

  return (
    <div className="py-1 px-2" key={name}>
      <ButtonPanel
        onClick={onClick}
        className={classNames(
          "w-full cursor-pointer hover:bg-brown-200 pt-2 relative"
        )}
        style={{ paddingBottom: "20px" }}
      >
        <div className="flex flex-col items-center space-y-1">
          <span className="text-xs capitalize">{name}</span>
          <div className="h-11">
            {name === "nightshades" ? (
              <div className="flex justify-center items-center">
                <div>
                  <img
                    src={maximus}
                    className="-scale-x-100"
                    style={{ width: 14 * PIXEL_SCALE }}
                  />
                  <div className="relative flex justify-center">
                    <img
                      src={shadow}
                      style={{
                        width: `${PIXEL_SCALE * 12}px`,
                        bottom: `${PIXEL_SCALE * -2}px`,
                      }}
                      className="absolute pointer-events-none"
                    />
                  </div>
                </div>
                <div className="flex pt-2">
                  <img
                    src={FACTION_EMBLEM_ICONS[name]}
                    className="w-4 h-4 inline-block mx-1"
                  />
                  <span className="font-secondary text-xs">
                    {formatNumber(totalTickets ?? 0)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="relative">
                  <NPCIcon parts={NPC_WEARABLES[npcs[name]]} />
                </div>
                <div className="flex pt-1">
                  <img
                    src={FACTION_EMBLEM_ICONS[name]}
                    className="w-4 h-4 inline-block mx-1"
                  />
                  <span className="font-secondary text-xs">
                    {formatNumber(totalTickets ?? 0)}
                  </span>
                </div>
              </div>
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
      </ButtonPanel>
    </div>
  );
};
