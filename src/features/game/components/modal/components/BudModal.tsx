import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React from "react";

import { Button } from "components/ui/Button";

import announcementImage from "assets/announcements/bud_announcement.png";
import { getKeys } from "features/game/types/craftables";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";

type TimeObject = {
  time: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  fontSize?: number;
  color?: string;
};

export const TimerDisplay = ({
  time,
  fontSize = 20,
  color = "white",
}: TimeObject) => {
  const timeKeys = getKeys(time);

  const times = timeKeys.map((key) => {
    const value = time[key].toString().padStart(2, "0");

    return value;
  });
  return (
    <span style={{ fontFamily: "monospace", fontSize: `${fontSize}px`, color }}>
      {times.join(":")}
    </span>
  );
};

interface Props {
  onClose: () => void;
}
export const BudModal: React.FC<Props> = ({ onClose }) => {
  return (
    <CloseButtonPanel
      onClose={onClose}
      title="Bud NFT Drop"
      bumpkinParts={{
        body: "Beige Farmer Potion",
        pants: "Farmer Overalls",
        tool: "Parsnip",
        hair: "Rancher Hair",
        shirt: "Red Farmer Shirt",
      }}
    >
      <div className="p-2">
        <div className="relative w-full mb-2 -mt-2">
          <img src={announcementImage} className="w-full rounded-lg" />
          <Label className="absolute top-2 right-2 text-sm" type="info">
            <div className="flex items-center">
              <img src={SUNNYSIDE.icons.timer} className="h-4 mr-1" />
              <span className="text-sm">27th September</span>
            </div>
          </Label>
        </div>
        <div className="flex items-start">
          <div className="w-10">
            <img src={SUNNYSIDE.icons.heart} className="h-6" />
          </div>
          <p className="text-sm flex-1">
            Only 5,000 unique buds available. Each with their own rare abilities
            and powers.
          </p>
        </div>

        <div className="flex items-start">
          <div className="w-10">
            <img src={SUNNYSIDE.icons.confirm} className="h-6" />
          </div>
          <p className="text-sm flex-1">
            Whitelist + Guaranteed positions for our top players
          </p>
        </div>
      </div>
      <Button
        onClick={() => {
          window.open(
            "https://docs.sunflower-land.com/player-guides/bud-nfts",
            "_blank"
          );
        }}
      >
        Read more
      </Button>
    </CloseButtonPanel>
  );
};
