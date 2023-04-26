import React, { useEffect, useState } from "react";

import { wallet } from "lib/blockchain/wallet";
import { KNOWN_IDS } from "features/game/types";
import { LanternName } from "features/game/types/game";
import { loadSupplyBatch } from "lib/blockchain/Inventory";
import { Panel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import twoBumpkins from "assets/npcs/two_bumpkins.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { progressBarBorderStyle } from "features/game/lib/style";
import { ITEM_DETAILS } from "features/game/types/images";
import { CountdownLabel } from "components/ui/CountdownLabel";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";

interface Props {
  lanternName: LanternName;
  endAt: number;
  previousMintCount: number;
  weeklyMintGoal: number;
  onLoaded: () => void;
}

export const WeeklyLanternCount: React.FC<Props> = ({
  lanternName,
  endAt,
  previousMintCount,
  weeklyMintGoal,
  onLoaded,
}) => {
  const [lanternsMinted, setLanternsMinted] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(
    (endAt - Date.now()) / 1000
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = (endAt - Date.now()) / 1000;
      setSecondsLeft(seconds);

      if (seconds <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getCount = async () => {
      const supplyBatch: string[] = await loadSupplyBatch(wallet.web3Provider, [
        KNOWN_IDS[lanternName],
      ]);
      const totalSupply = Number(supplyBatch[0]) ?? 0;

      setLanternsMinted(totalSupply - previousMintCount);
      handleLoaded();
    };

    getCount();
  }, []);

  const handleLoaded = () => {
    setLoaded(true);
    onLoaded();
  };

  const goalReached = lanternsMinted >= weeklyMintGoal;
  // get percentage of lanterns minted based on weekly goal.
  const percentage = (lanternsMinted / weeklyMintGoal) * 100;

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="fixed w-[96%] lg:w-96 z-[99999] bottom-4 cursor-pointer"
        style={{
          transform: `translateY(${loaded ? "9px" : "120px"}) translateX(-50%)`,
          transition: "all .5s ease-in-out",
          left: "50%",
        }}
      >
        <Panel>
          <div className="flex justify-center mb-1">
            <CountdownLabel timeLeft={secondsLeft} endText="remaining" />
          </div>
          <div className="flex items-center px-1">
            <img
              src={twoBumpkins}
              alt="Community"
              style={{ width: PIXEL_SCALE * 20 }}
            />
            <div
              className="flex flex-col w-full mx-1"
              style={{ ...progressBarBorderStyle }}
            >
              <div
                className="relative h-6 w-1/2 dawn-breaker-gradient flex items-center justify-center"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                }}
              >
                <div
                  className="absolute top-1/2 -translate-y-1/2 -right-2"
                  style={{
                    width: PIXEL_SCALE * 10,
                    height: PIXEL_SCALE * 16,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={ITEM_DETAILS[lanternName].image}
                    alt={lanternName}
                    style={{
                      width: PIXEL_SCALE * 10,
                    }}
                  />
                </div>
                <p className="text-xxs mb-1">
                  {goalReached
                    ? `Mint goal reached`
                    : `${lanternsMinted}/${weeklyMintGoal}`}
                </p>
              </div>
            </div>
            <img
              src={
                goalReached
                  ? SUNNYSIDE.decorations.treasure_chest_opened
                  : SUNNYSIDE.decorations.treasure_chest
              }
              alt="Reward"
              className="flex justify-end"
              style={{ height: `${PIXEL_SCALE * (goalReached ? 16 : 12)}px` }}
            />
          </div>
        </Panel>
      </div>
      <Modal show={showModal} centered>
        <CloseButtonPanel
          title="Weekly Lantern Challenge"
          onClose={() => setShowModal(false)}
          bumpkinParts={{
            body: "Beige Farmer Potion",
            hair: "Rancher Hair",
            pants: "Farmer Overalls",
            shirt: "Red Farmer Shirt",
            tool: "Farmer Pitchfork",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
        >
          <div className="flex justify-center mb-1">
            <CountdownLabel timeLeft={secondsLeft} endText="remaining" />
          </div>
          <div className="text-sm p-2 mb-2">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              sagittis purus odio, vel eleifend risus molestie ac.
            </p>
            <p>
              Nulla luctus, est vitae convallis dignissim, augue justo laoreet
              eros, sit amet commodo leo sapien ac diam.
            </p>
          </div>
          <Button onClick={() => setShowModal(false)}>Got it</Button>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
