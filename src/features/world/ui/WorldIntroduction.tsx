import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useState } from "react";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { Panel } from "components/ui/Panel";

import deliveries from "assets/tutorials/plaza_screenshot1.png";
import crafting from "assets/tutorials/craft_rare.png";
import auctions from "assets/tutorials/auctions.png";
import trading from "assets/tutorials/trading.png";

interface Props {
  onClose: () => void;
}

const ProgressDots: React.FC<{ progress: number; total: number }> = ({
  progress,
  total,
}) => (
  <div className="flex">
    {new Array(progress).fill(null).map(() => (
      <img src={SUNNYSIDE.icons.confirm} className="h-4 mr-1" />
    ))}
    {new Array(total - progress).fill(null).map(() => (
      <img src={SUNNYSIDE.ui.dot} className="h-4 mr-1" />
    ))}
  </div>
);
export const WorldIntroduction: React.FC<Props> = ({ onClose }) => {
  const [page, setPage] = useState(0);

  const Content = () => {
    if (page === 0) {
      return (
        <SpeakingText
          message={[
            {
              text: "Howdy Traveller! Welcome to the Pumpkin Plaza.",
            },
            {
              text: "The plaza is home to a diverse group of hungry Bumpkins and Goblins that need your help!",
            },
            {
              text: "A few quick hints before you begin your adventure:",
            },
          ]}
          onClose={() => setPage((p) => p + 1)}
        />
      );
    }

    // Complete a delivery
    if (page === 1) {
      return (
        <>
          <div className="p-2">
            <ProgressDots progress={1} total={5} />
            <p className="text-sm my-2">
              Visit NPCs and complete deliveries to earn SFL and rare rewards.
            </p>
            <img src={deliveries} className="w-full rounded-md" />
          </div>
          <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
        </>
      );
    }

    // Craft Magical Items
    if (page === 2) {
      return (
        <>
          <div className="p-2">
            <ProgressDots progress={2} total={5} />
            <p className="text-sm my-2">
              Craft rare collectibles, wearables and decorations at the
              different shops.
            </p>
            <p className="text-sm mb-2">
              Hurry, items are only available for a limited time!
            </p>
            <img src={crafting} className="w-full rounded-md" />
          </div>
          <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
        </>
      );
    }

    // Trade With Players
    if (page === 3) {
      return (
        <>
          <div className="p-2">
            <ProgressDots progress={3} total={5} />
            <p className="text-sm my-2">
              Trade resources with other players. To interact with a player,
              walk nearby and click on them.
            </p>
            <img src={trading} className="w-full rounded-md" />
          </div>
          <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
        </>
      );
    }

    // Auction House
    if (page === 4) {
      return (
        <>
          <div className="p-2">
            <ProgressDots progress={3} total={5} />
            <p className="text-sm my-2">
              Prepare your resources & visit the Auction House to compete with
              other players for rare collectibles!
            </p>
            <img src={auctions} className="w-full rounded-md" />
          </div>
          <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
        </>
      );
    }

    return (
      <>
        <ProgressDots progress={5} total={5} />
        <div className="p-2">
          <div className="flex mb-2">
            <div className="w-8">
              <img src={SUNNYSIDE.icons.player} className="h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm">
                To move your Bumpkin, use the keyboard arrow keys
              </p>
              <p className="text-xs italic">
                (On touch screen, use the joystick.)
              </p>
            </div>
          </div>
          <div className="flex mb-2">
            <div className="w-8">
              <img src={SUNNYSIDE.ui.cursor} className="h-6" />
            </div>
            <p className="text-sm flex-1">
              To interact with a Bumpkin or an object, walk near it and click it
            </p>
          </div>
          <div className="flex mb-1">
            <div className="w-8">
              <img src={SUNNYSIDE.icons.heart} className="h-6" />
            </div>
            <p className="text-sm flex-1">
              No harrasment, swearing or bullying. Thank you for respecting
              others.
            </p>
          </div>
        </div>
        <Button onClick={onClose}>Let's go!</Button>
      </>
    );
  };
  return (
    <Panel bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}>
      <Content />
    </Panel>
  );
};
