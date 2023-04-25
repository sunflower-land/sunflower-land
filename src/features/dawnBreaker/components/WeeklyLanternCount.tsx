import React, { useEffect, useState } from "react";

import { wallet } from "lib/blockchain/wallet";
import { KNOWN_IDS } from "features/game/types";
import { LanternName } from "features/game/types/game";
import { loadSupplyBatch } from "lib/blockchain/Inventory";
import { Panel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import twoBumpkins from "assets/npcs/two_bumpkins.png";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  lanternName: LanternName;
  previousMintCount: number;
  weeklyMintGoal: number;
}

export const WeeklyLanternCount: React.FC<Props> = ({
  lanternName,
  previousMintCount,
}) => {
  const [lanternsMinted, setLanternsMinted] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    const getCount = async () => {
      const supplyBatch: string[] = await loadSupplyBatch(wallet.web3Provider, [
        KNOWN_IDS[lanternName],
      ]);
      const totalSupply = Number(supplyBatch[0]) ?? 0;

      setLanternsMinted(totalSupply - previousMintCount);
      setLoading(false);
    };

    getCount();
  }, []);

  return (
    <div
      className={`fixed w-80 lg:w-96 z-[99999] bottom-4`}
      style={{
        transform: `translateY(${isOpen ? "9px" : "200px"}) translateX(-50%)`,
        left: "50%",
      }}
    >
      <Panel>
        <div className="flex items-center px-1">
          <img
            src={twoBumpkins}
            alt="Community"
            style={{ width: PIXEL_SCALE * 15 }}
          />
          <div className="flex flex-col w-full ml-2 dawn-breaker-gradient">
            <div>hello</div>
          </div>
          <img
            src={SUNNYSIDE.decorations.treasure_chest}
            alt="Reward"
            className="flex justify-end"
            style={{ height: PIXEL_SCALE * 12 }}
          />
        </div>
      </Panel>
    </div>
  );
};
