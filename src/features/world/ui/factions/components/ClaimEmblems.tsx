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
import { formatNumber } from "lib/utils/formatNumber";
import { ShareClaimedEmblems } from "./ShareClaimedEmblems";

const FACTION_EMBLEM_ICONS: Record<FactionName, string> = {
  goblins: goblinEmblem,
  bumpkins: bumpkinEmblem,
  sunflorians: sunflorianEmblem,
  nightshades: nightshadeEmblem,
};

// TODO feat/emblem-airdrops
const RANK = 10;
const TOTAL_FACTION_MEMBERS = 10_000;
const TOTAL_FACTION_EMBLEMS = 1_500_000;
const PERCENTILE = 6;

interface ClaimEmblemsProps {
  faction: Faction;
  playerName?: string;
  onClose: () => void;
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const Fireworks: React.FC = () => {
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
  playerName,
  onClose,
}) => {
  const [screen, setScreen] = useState<"claiming" | "claimed" | "sharing">(
    "claiming"
  );

  const { t } = useTranslation();

  const alreadyClaimed = !!faction.emblemsClaimedAt;

  // Failsafe we player already claimed emblems. Should not happen.
  if (alreadyClaimed) {
    return (
      <div className="p-2">
        <InlineDialogue message={t("faction.claimEmblems.alreadyClaimed")} />
      </div>
    );
  }

  // Failsafe if player has no faction points. Should not happen.
  if (!faction.points) {
    return (
      <div className="p-2">
        <InlineDialogue message={t("faction.claimEmblems.noContribution")} />
      </div>
    );
  }

  const claim = () => {
    // TODO claim emblems event here
    setScreen("claimed");
  };

  if (screen === "claimed" || screen === "sharing") {
    return (
      <>
        <Fireworks />
        <div
          className="p-2"
          style={{
            minHeight: "65px",
          }}
        >
          <InlineDialogue
            key="claimed"
            message={t("faction.claimEmblems.congratulations", {
              count: faction.points,
            })}
          />
        </div>

        <div className="py-2">
          <Label type="default">{t("faction.claimEmblems.statistics")}</Label>
        </div>
        <OuterPanel>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label type="transparent">
                {t("faction.claimEmblems.totalMembers")}
              </Label>
              <Label type="transparent">
                {formatNumber(TOTAL_FACTION_MEMBERS)}
              </Label>
            </div>
            <div className="flex items-center justify-between">
              <Label type="transparent">
                {t("faction.claimEmblems.yourRank")}
              </Label>
              <Label type="transparent">{RANK}</Label>
            </div>
            <div className="flex items-center justify-between">
              <Label type="transparent">
                {t("faction.claimEmblems.yourPercentile")}
              </Label>
              <Label type="transparent">
                {t("faction.claimEmblems.percentile", {
                  percentile: PERCENTILE,
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
                  {formatNumber(TOTAL_FACTION_EMBLEMS)}
                </Label>
              </div>
            </div>
          </div>
        </OuterPanel>

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

      <OuterPanel className="space-y-1 ">
        <div className="flex items-center justify-between">
          <Label className="ml-2" type="info" icon={trophy}>
            {t("faction.claimEmblems.yourRank")}
          </Label>
          <Label type="transparent">{RANK}</Label>
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
          rank: RANK,
          percentile: PERCENTILE,
        })}
      </span>

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
