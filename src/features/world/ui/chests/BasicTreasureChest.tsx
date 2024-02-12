import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Revealed } from "features/game/components/Revealed";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useState } from "react";

import wheelHolder from "assets/ui/lunar_wheel_holder.png";
import wheel from "assets/ui/lunar_wheel.png";

interface Props {
  onClose: () => void;
  location: "plaza" | "lunar_island";
}

export const BasicTreasureChest: React.FC<Props> = ({ onClose, location }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [isRevealing, setIsRevealing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const hasKey = !!gameState.context.state.inventory["Treasure Key"];

  const open = () => {
    setIsOpening(true);
  };

  const spin = () => {
    setIsOpening(false);
    setIsRevealing(true);

    gameService.send("REVEAL", {
      event: {
        key: "Treasure Key",
        location: "lunar_island",
        type: "treasureChest.opened",
        createdAt: new Date(),
      },
    });
  };

  if (gameState.matches("revealing") && isRevealing) {
    return (
      <Panel>
        <div className="w-48 mx-auto my-2 relative">
          <img
            src={wheelHolder}
            alt="Wheel Holder"
            className="w-full z-10  absolute top-0 left-0"
          />
          <img
            src={wheel}
            alt="Wheel"
            className="w-full animate-spin"
            style={{
              transformOrigin: "calc(50%) calc(50% + 9px)",
              animation: "spin 6s linear infinite",
            }}
          />
        </div>
        <Button disabled={true}>Good Luck!</Button>
      </Panel>
    );
  }

  if (isOpening) {
    return (
      <Panel>
        <div className="w-48 mx-auto my-2 relative">
          <img
            src={wheelHolder}
            alt="Wheel Holder"
            className="w-full z-10  absolute top-0 left-0"
          />
          <img
            src={wheel}
            alt="Wheel"
            className="w-full"
            style={{
              transformOrigin: "calc(50%) calc(50% + 9px)",
            }}
          />
        </div>
        <Button onClick={() => spin()}>Spin</Button>
      </Panel>
    );
  }

  if (gameState.matches("revealed") && isRevealing) {
    return (
      <Panel>
        <Revealed onAcknowledged={() => setIsRevealing(false)} />
      </Panel>
    );
  }

  if (!hasKey) {
    return (
      <CloseButtonPanel onClose={onClose}>
        <div className="p-2">
          <Label
            type="danger"
            className="mb-2"
            icon={ITEM_DETAILS["Treasure Key"].image}
          >
            Missing Key
          </Label>
          <p className="text-xs mb-2">
            You need a Treasure Key to open this chest.
          </p>
          <p className="text-xs">
            You can get Treasure Keys by completing tasks for Bumpkins.
          </p>
        </div>
      </CloseButtonPanel>
    );
  }

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="p-2">
        <Label
          type="default"
          className="mb-2"
          icon={ITEM_DETAILS["Treasure Key"].image}
          secondaryIcon={SUNNYSIDE.icons.confirm}
        >
          Treasure Key
        </Label>
        <p className="text-xs mb-2">
          Congratulations, you have a Treasure Key!
        </p>
        <p className="text-xs mb-2">
          Would you like to open the chest and claim a reward?
        </p>
      </div>
      <Button onClick={open}>Open</Button>
    </CloseButtonPanel>
  );
};
