import React, { useEffect, useState } from "react";

import { Faction, FactionName } from "features/game/types/game";
import { InlineDialogue } from "../../TypingMessage";
import { capitalize } from "lib/utils/capitalize";
import { OuterPanel } from "components/ui/Panel";

import { FACTION_POINT_ICONS } from "../FactionDonationPanel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";

import factions from "assets/icons/factions.webp";
import trophy from "assets/icons/trophy.png";
import confetti from "canvas-confetti";
import { useTranslation } from "react-i18next";

import goblinEmblem from "assets/icons/goblin_emblem.webp";
import bumpkinEmblem from "assets/icons/bumpkin_emblem.webp";
import sunflorianEmblem from "assets/icons/sunflorian_emblem.webp";
import nightshadeEmblem from "assets/icons/nightshade_emblem.webp";
import { formatNumber, setPrecision } from "lib/utils/formatNumber";
import { ShareClaimedEmblems } from "./ShareClaimedEmblems";
import { fetchLeaderboardData } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import Decimal from "decimal.js-light";

export const FACTION_EMBLEM_ICONS: Record<FactionName, string> = {
  goblins: goblinEmblem,
  bumpkins: bumpkinEmblem,
  sunflorians: sunflorianEmblem,
  nightshades: nightshadeEmblem,
};

interface Statistics {
  yourRank: number;
  yourPercentile: number;
  totalMembers: number;
  totalEmblems: number;
}

interface ClaimEmblemsProps {
  faction: Faction;
  farmId: number;
  playerName?: string;
  onClaim: () => void;
  onClose: () => void;
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const Fireworks: React.FC = () => {
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    particleCount: 50,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 700);

    return () => clearInterval(interval);
  });

  return null;
};

export const ClaimEmblems: React.FC<ClaimEmblemsProps> = ({
  faction,
  farmId,
  playerName,
  onClaim,
  onClose,
}) => {
  const { t } = useTranslation();

  const [screen, setScreen] = useState<"claiming" | "claimed" | "sharing">(
    "claiming",
  );

  const [statistics, setStatistics] = useState<Statistics | null | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        const data = await fetchLeaderboardData(farmId);

        // Error
        if (!data?.factions) {
          setStatistics(null);
          return;
        }

        const rankDetails = data.factions.farmRankingDetails?.find(
          (rank) => rank.id === playerName,
        );
        const yourRank = rankDetails?.rank;

        if (yourRank) {
          const totalMembers = data.factions.totalMembers[faction.name];
          const totalEmblems = data.factions.totalTickets[faction.name];

          const yourPercentile = (yourRank / totalMembers) * 100;

          setStatistics({
            yourRank,
            yourPercentile,
            totalMembers,
            totalEmblems,
          });
        } else {
          // Something went wrong searching for the leaderboard
          // Default to the basic screens without statistics
          setStatistics(null);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error loading leaderboards", e);

        if (!statistics) setStatistics(null);
      }
    };

    fetchLeaderboards();
  }, []);

  // Failsafe if player has no faction points. Should not happen.
  if (!faction.points) {
    return (
      <div className="p-2">
        <InlineDialogue message={t("faction.claimEmblems.noContribution")} />
      </div>
    );
  }

  const claim = () => {
    onClaim();
    setScreen("claimed");
  };

  if (screen === "claimed" || screen === "sharing") {
    return (
      <>
        <Fireworks />
        <div
          className="p-2"
          style={{
            minHeight: statistics ? "65px" : "32px",
          }}
        >
          <InlineDialogue
            key="claimed"
            message={`${t("faction.claimEmblems.congratulations", {
              count: faction.points,
            })} ${statistics ? t("faction.claimEmblems.comparison") : ""}`}
          />
        </div>

        {statistics && (
          <>
            <div className="py-2">
              <Label type="default">
                {t("faction.claimEmblems.statistics")}
              </Label>
            </div>

            <OuterPanel>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label type="transparent">
                    {t("faction.claimEmblems.totalMembers")}
                  </Label>
                  <Label type="transparent">{statistics.totalMembers}</Label>
                </div>
                <div className="flex items-center justify-between">
                  <Label type="transparent">
                    {t("faction.claimEmblems.yourRank")}
                  </Label>
                  <Label type="transparent">{statistics.yourRank}</Label>
                </div>
                <div className="flex items-center justify-between">
                  <Label type="transparent">
                    {t("faction.claimEmblems.yourPercentile")}
                  </Label>
                  <Label type="transparent">
                    {t("faction.claimEmblems.percentile", {
                      percentile: setPrecision(
                        new Decimal(statistics.yourPercentile),
                        2,
                      ).toString(),
                    })}
                  </Label>
                </div>

                <div className="flex items-center justify-between">
                  <Label type="transparent">
                    {t("faction.claimEmblems.totalEmblems")}
                  </Label>
                  <div className="flex items-center">
                    <img
                      src={FACTION_EMBLEM_ICONS[faction.name]}
                      className="w-4 h-auto"
                    />
                    <Label type="transparent">
                      {formatNumber(statistics.totalEmblems)}
                    </Label>
                  </div>
                </div>
              </div>
            </OuterPanel>
          </>
        )}

        <div className="flex items-center justify-between py-2 pr-1">
          <Label
            className="ml-2"
            type="success"
            icon={FACTION_EMBLEM_ICONS[faction.name]}
          >
            {t("faction.claimEmblems.yourEmblems")}
          </Label>

          <div className="flex items-center ">
            <img
              src={FACTION_EMBLEM_ICONS[faction.name]}
              className="w-4 h-auto"
            />
            <Label type="transparent">{faction.points}</Label>
          </div>
        </div>

        {screen === "claimed" && (
          <div className="flex space-x-1 pt-1">
            <Button onClick={onClose}>{t("close")}</Button>
            <Button onClick={() => setScreen("sharing")}>{t("share")}</Button>
          </div>
        )}

        {screen === "sharing" && (
          <ShareClaimedEmblems
            faction={faction}
            onBack={() => setScreen("claimed")}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Fireworks />
      <div
        style={{
          minHeight: "65px",
        }}
        className="p-2"
      >
        <InlineDialogue
          key="airdrop"
          message={t("faction.claimEmblems.thankYou", {
            player: playerName ? `${playerName} ` : "",
            faction: faction.name,
            Faction: capitalize(faction.name),
          })}
        />
      </div>

      {statistics && (
        <>
          <OuterPanel className="space-y-1 ">
            <div className="flex items-center justify-between">
              <Label className="ml-2" type="info" icon={trophy}>
                {t("faction.claimEmblems.yourRank")}
              </Label>
              <Label type="transparent">{statistics.yourRank}</Label>
            </div>
            <div className="flex items-center justify-between">
              <Label className="ml-2" type="warning" icon={factions}>
                {t("faction.points.title")}
              </Label>

              <div className="flex items-center">
                <img
                  src={FACTION_POINT_ICONS[faction.name]}
                  className="w-4 h-auto"
                />
                <Label type="transparent">{faction.points}</Label>
              </div>
            </div>
          </OuterPanel>

          <span className="leading-[1] text-[16px] p-2">
            {t("faction.claimEmblems.claimMessage", {
              count: faction.points,
              Faction: capitalize(faction.name),
              rank: statistics.yourRank,
              percentile: setPrecision(
                new Decimal(statistics.yourPercentile),
                2,
              ).toString(),
            })}
          </span>
        </>
      )}

      <div className="flex items-center justify-between pr-1">
        <Label
          className="ml-2"
          type="success"
          icon={FACTION_EMBLEM_ICONS[faction.name]}
        >
          {t("faction.claimEmblems.emblemsEarned", { count: faction.points })}
        </Label>
        <div className="flex items-center">
          <img
            src={FACTION_EMBLEM_ICONS[faction.name]}
            className="w-4 h-auto"
          />
          <Label type="transparent">{faction.points}</Label>
        </div>
      </div>

      <Button className="mt-2" onClick={claim}>
        {t("faction.claimEmblems.claim", { count: faction.points })}
      </Button>
    </>
  );
};
