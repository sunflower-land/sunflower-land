import React, { useEffect, useState } from "react";

import { Faction, FactionName } from "features/game/types/game";
import { InlineDialogue } from "../../TypingMessage";
import { capitalize } from "lib/utils/capitalize";
import { InnerPanel, OuterPanel } from "components/ui/Panel";

import { FACTION_POINT_ICONS } from "../FactionDonationPanel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { PIXEL_SCALE } from "features/game/lib/constants";

import factions from "assets/icons/factions.webp";
import trophy from "assets/icons/trophy.png";
import { createPortal } from "react-dom";
import confetti from "canvas-confetti";

const RANK = 10;

// Show rank!
// Show emblems!
// Show Twitter link!

// TODO feat/emblem-airdrops
const FACTION_SPECIFIC_ONE_LINERS: Record<FactionName, string> = {
  sunflorians: "With your help the Sunflorian Dynasties will prosper!",
  goblins: "With your help, we shall reclaim the lands of our ancestors!",
  nightshades: "With your help, the darkness shall cover the lands once again",
  bumpkins: "With your help, our industries are cetain prosper!",
};

// TOP_N_TEXT = {
//   1: "Congratulations! You are the top player in Sunflower Land! Claim your airdrop now!",
//   2: "Congratulations! You are the second top player in Sunflower Land! Claim your airdrop now!",
//   3: "Congratulations! You are the third top player in Sunflower Land! Claim your airdrop now!",
//   10: "Congratulations! You are the top 10 player in Sunflower Land! Claim your airdrop now!",
//   100: "Congratulations! You are the top 100 player in Sunflower Land! Claim your airdrop now!",
//   1000: "Congratulations! You are the top 1000 player in Sunflower Land! Claim your airdrop now!",
//   10000:
//     "Congratulations! You are the top 10000 player in Sunflower Land! Claim your airdrop now!",
// };
// ("I just claimed an airdrop in Sunflower Land!");
// ("Based on my rank, I got just claimed n emblems and n percent ownershop");
// ("Long live the Sunflorians!")
// ("play now reffferal")

// TODO feat/emblem-airdrops
const ALREADY_CLAIMED_DIALOG =
  "Hey! We already rewarded you with your emblems!";
const TAKE_THESE_EMBLEMS =
  "Take these emblems, they represent your ownership of the faction!";

interface ClaimEmblemAirdropProps {
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

export const ClaimEmblemAirdrop: React.FC<ClaimEmblemAirdropProps> = ({
  faction,
  playerName,
  onClose,
}) => {
  const [showClaimedScreen, setShowClaimedScreen] = useState<boolean>(false);

  const alreadyClaimed = !!faction.emblemsClaimedAt;

  // Failsafe we player already claimed
  if (alreadyClaimed) {
    return <InlineDialogue message={ALREADY_CLAIMED_DIALOG} />;
  }

  // TODO feat/emblem-airdrops
  const thankYouDialogue = `Thank you ${
    playerName ? `${playerName} ` : ""
  }for your contributions to the ${capitalize(faction.name)}. ${
    FACTION_SPECIFIC_ONE_LINERS[faction.name]
  }\n${TAKE_THESE_EMBLEMS}`;

  const claim = () => {
    // TODO claim emblems event here
    setShowClaimedScreen(true);
  };

  if (showClaimedScreen) {
    return (
      <>
        <Fireworks />
        <span className="leading-[1] text-[16px] p-2">
          Congratulsations you have been airdropped 148 emblems
        </span>
        <Label type="default">Statsistics</Label>
        <OuterPanel className="space-y-1 my-1">
          <div className="flex items-center justify-between">
            <Label className="ml-2" type="info" icon={trophy}>
              Total Faction Members
            </Label>
            <Label type="transparent">1234</Label>
          </div>
          <div className="flex items-center justify-between">
            <Label className="ml-2" type="info" icon={trophy}>
              Total Emblems
            </Label>
            <Label type="transparent">1.5m</Label>
          </div>
          <div className="flex items-center justify-between">
            <Label className="ml-2" type="info" icon={trophy}>
              Your Rank
            </Label>
            <Label type="transparent">1234</Label>
          </div>
          <div className="flex items-center justify-between">
            <Label className="ml-2" type="warning" icon={factions}>
              Your Emblems
            </Label>

            <div className="flex items-center">
              <img
                src={FACTION_POINT_ICONS[faction.name]}
                className="w-4 h-auto"
              />
              <Label type="transparent">{faction.points}</Label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="ml-2" type="info" icon={trophy}>
              Your Percentile
            </Label>
            <Label type="transparent">1234</Label>
          </div>
        </OuterPanel>
        <div className="flex space-x-1">
          <Button onClick={onClose}>Close</Button>
          <Button>Share</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Fireworks />
      <div
        style={{
          minHeight: "97px",
        }}
        className="p-2"
      >
        <InlineDialogue message={thankYouDialogue} />
      </div>

      <OuterPanel className="space-y-1 ">
        <div className="flex items-center justify-between">
          <Label className="ml-2" type="info" icon={trophy}>
            Your Rank
          </Label>
          <Label type="transparent">1234</Label>
        </div>
        <div className="flex items-center justify-between">
          <Label className="ml-2" type="warning" icon={factions}>
            Faction Points
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
        You contributed 148 faction points. You are rank was 1. You are better
        than 25% of Goblins.
      </span>

      <div className="flex items-center justify-between">
        <Label className="ml-2" type="info">
          Emblems Earned (Present Icon)
        </Label>
        <Label type="transparent">1234</Label>
      </div>

      <Button className="mt-2" onClick={claim}>
        Claim 148 Emblems
      </Button>
    </>
  );
};
