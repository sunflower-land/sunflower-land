import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import React, { useEffect, useState } from "react";
import minting from "assets/npcs/minting.gif";
import { secondsToString } from "lib/utils/time";

interface Props {
  readyAt: number;
  onComplete: () => void;
}

export const NFTWaiting: React.FC<Props> = ({ readyAt, onComplete }) => {
  const [secondsLeft, setSecondsLeft] = useState((readyAt - Date.now()) / 1000);

  const active = readyAt >= Date.now();

  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        setSecondsLeft((readyAt - Date.now()) / 1000);

        if (Date.now() > readyAt) {
          onComplete();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [active]);

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between items-center mb-3">
          <Label icon={SUNNYSIDE.resource.pirate_bounty} type="default">
            Minting Account NFT
          </Label>
          <p className="text-sm">
            {secondsToString(secondsLeft, { length: "medium" })}
          </p>
        </div>

        <p className="text-sm">
          Minting your NFT and storing progress on the Blockchain
        </p>

        <img src={minting} className="w-40 mt-2" />
      </div>
    </>
  );
};

export const NFTMinting: React.FC = () => {
  return (
    <>
      <div className="p-2">
        <div className="flex justify-between items-center mb-3">
          <Label icon={SUNNYSIDE.resource.pirate_bounty} type="default">
            Minting Account NFT
          </Label>
        </div>

        <p className="text-sm loading">Minting</p>

        <img src={minting} className="w-40 mt-2" />
      </div>
    </>
  );
};

export const NFTMigrating: React.FC = () => {
  return (
    <>
      <div className="p-2">
        <div className="flex justify-between items-center mb-3">
          <Label icon={SUNNYSIDE.resource.pirate_bounty} type="default">
            Minting Account NFT
          </Label>
        </div>

        <p className="text-sm loading">Almost there</p>

        <img src={minting} className="w-40 mt-2" />
      </div>
    </>
  );
};
