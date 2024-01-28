import React, { useContext, useState } from "react";

import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import farmHandImage from "assets/tutorials/farmHands.png";
import { Label } from "components/ui/Label";
import lockIcon from "assets/skills/lock.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState } from "features/game/types/game";
import {
  FARM_HAND_COST,
  ISLAND_BUMPKIN_CAPACITY,
} from "features/game/events/landExpansion/buyFarmHand";
import { Panel } from "components/ui/Panel";
import confetti from "canvas-confetti";
import { NPC } from "features/island/bumpkin/components/NPC";
import { gameAnalytics } from "lib/gameAnalytics";

interface Props {
  onClose: () => void;
  gameState: GameState;
}

export const BuyFarmHand: React.FC<Props> = ({ onClose, gameState }) => {
  const { gameService } = useContext(Context);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const hasCoupon = !!gameState.inventory["Farmhand Coupon"]?.gte(1);

  const onAdd = () => {
    gameService.send("farmHand.bought");
    gameService.send("SAVE");
    setShowSuccess(true);
    confetti();

    if (!hasCoupon) {
      gameAnalytics.trackSink({
        currency: "Block Buck",
        amount: FARM_HAND_COST,
        item: "Farmhand",
        type: "Collectible",
      });
    }
  };

  const hasBlockBucks =
    !!gameState.inventory["Block Buck"]?.gte(FARM_HAND_COST);

  const capacity = ISLAND_BUMPKIN_CAPACITY[gameState.island.type];
  const farmHands = Object.keys(gameState.farmHands.bumpkins).length;
  const hasSpace = farmHands + 1 < capacity;

  if (showSuccess) {
    const latestFarmHand = Object.keys(gameState.farmHands.bumpkins).pop();
    const parts =
      gameState.farmHands.bumpkins[latestFarmHand as string].equipped;

    return (
      <Panel bumpkinParts={parts}>
        <div className="p-2 flex flex-col items-center">
          <p className="text-sm mb-2 text-center">Howdy Bumpkin.</p>
          <p className="text-xs mb-2 text-center">
            {`I am your new farmhand. I can't wait to get to work!`}
          </p>
          <div className="h-16 w-16 mb-4">
            <NPC parts={parts} />
          </div>
        </div>
        <Button onClick={onClose}>Close</Button>
      </Panel>
    );
  }

  if (showConfirmation) {
    return (
      <Panel>
        <div className="p-2">
          <p className="text-sm">
            Are you sure you want to buy an additional Bumpkin?
          </p>
          {!hasCoupon && (
            <div className="flex items-center my-2">
              <img
                src={ITEM_DETAILS["Block Buck"].image}
                className="h-4 mr-2"
              />
              <p className="text-xs">{`${FARM_HAND_COST} Block Bucks`}</p>
            </div>
          )}

          {hasCoupon && (
            <div className="flex items-center my-2">
              <img
                src={ITEM_DETAILS["Farmhand Coupon"].image}
                className="h-4 mr-2"
              />
              <p className="text-xs">1 Farmhand Coupon</p>
            </div>
          )}
        </div>

        <div className="flex">
          <Button onClick={() => setShowConfirmation(false)}>No</Button>
          <Button className="ml-1" onClick={onAdd}>
            Yes
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="p-2">
        <div className="flex items-center  mb-2 ">
          <p className="text-sm mr-2">Adopt a Bumpkin</p>
          <img src={SUNNYSIDE.icons.heart} className="h-6" />
        </div>
        <p className="text-xs mb-2">
          Additional Bumpkins can be used to equip wearables and boost your
          farm.
        </p>
        <img src={farmHandImage} className="w-full rounded-md" />
        {!hasCoupon && (
          <div className="flex items-center my-2">
            <img src={ITEM_DETAILS["Block Buck"].image} className="h-4 mr-2" />
            <p className="text-xs">{`${FARM_HAND_COST} Block Bucks`}</p>
          </div>
        )}

        {hasCoupon && (
          <div className="flex items-center my-2">
            <img
              src={ITEM_DETAILS["Farmhand Coupon"].image}
              className="h-4 mr-2"
            />
            <p className="text-xs">1 Farmhand Coupon</p>
          </div>
        )}
        {!hasSpace && (
          <Label icon={lockIcon} type="danger" className="mt-2">
            Not enough space - upgrade your island
          </Label>
        )}
      </div>
      <Button
        disabled={!hasSpace || (!hasBlockBucks && !hasCoupon)}
        onClick={() => setShowConfirmation(true)}
      >
        Buy Bumpkin
      </Button>
    </CloseButtonPanel>
  );
};
