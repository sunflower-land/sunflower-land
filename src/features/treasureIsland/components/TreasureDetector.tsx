import React, { useCallback, useContext, useState } from "react";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";

import { SUNNYSIDE } from "assets/sunnyside";
import xMark from "assets/decorations/flag.png";
import shadow from "assets/npcs/shadow.png";
import { Modal } from "react-bootstrap";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Button } from "components/ui/Button";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Label } from "components/ui/Label";
import { getSecondsToTomorrow, secondsToString } from "lib/utils/time";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Equipped } from "features/game/types/bumpkin";
import { Panel } from "components/ui/Panel";

export const TreasureDetector: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showModal, setShowModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("Treasure Detector")
  );

  const [isSearching, setIsSearching] = useState(false);

  const treasureIsland = gameState.context.state.treasureIsland;

  const acknowledge = () => {
    acknowledgeTutorial("Treasure Detector");
    setShowTutorial(false);
  };

  const search = () => {
    setIsSearching(true);

    gameService.send("REVEAL", {
      event: {
        type: "treasure.searched",
        createdAt: new Date(),
      },
    });
  };

  const closeHandle = useCallback(() => {
    if (gameState.matches("revealing")) {
      return;
    }

    if (gameState.matches("revealed")) {
      gameService.send("CONTINUE");
      setIsSearching(false);
    }

    setShowModal(false);
  }, [gameState.value]);

  const handleNPCClick = () => {
    if (gameState.matches("revealing") || gameState.matches("revealed")) return;

    setShowModal(true);
  };

  const bumpkinParts: Partial<Equipped> = {
    body: "Light Brown Farmer Potion",
    hair: "Luscious Hair",
    shirt: "SFL T-Shirt",
    tool: "Sword",
  };

  const ModalContent = () => {
    if (treasureIsland?.rareTreasure?.reward) {
      return (
        <CloseButtonPanel
          onClose={closeHandle}
          title="I found something!"
          bumpkinParts={bumpkinParts}
        >
          <div className="flex flex-col items-center p-2 pt-0 w-full">
            <img
              src={xMark}
              className="mb-2"
              style={{
                width: `${PIXEL_SCALE * 16}px`,
              }}
            />
            <p className="mb-2 text-left">
              I have found a rare treasure! Find the red flag on the map and
              dig.
            </p>
          </div>
          <Button onClick={closeHandle}>Got it</Button>
        </CloseButtonPanel>
      );
    }

    if (isSearching) {
      return (
        <Panel>
          <div className="w-full">
            <p className="loading">Searching</p>
          </div>
        </Panel>
      );
    }

    if (showTutorial) {
      return (
        <CloseButtonPanel
          onClose={closeHandle}
          title="Looking for treasure?"
          bumpkinParts={bumpkinParts}
        >
          <div className="text-left p-2">
            <p className="mb-2">
              I was born with a special gift, the ability to magically detect
              where treasure was hidden.
            </p>
            <p className="mb-2">
              {`I've worked with archaeologists, historians, and treasure hunters,
            using my abilities to uncover hidden riches that had been lost for
            centuries.`}
            </p>
          </div>
          <Button onClick={acknowledge}>Continue</Button>
        </CloseButtonPanel>
      );
    }

    const hasDug =
      new Date(treasureIsland?.rareTreasure?.discoveredAt ?? 0).getUTCDay() ===
      new Date().getUTCDay();

    if (hasDug) {
      return (
        <CloseButtonPanel
          onClose={closeHandle}
          title="Looking for treasure?"
          bumpkinParts={bumpkinParts}
        >
          <div className="flex flex-col items-center p-2 pt-0">
            <Label
              type="info"
              className="inline-flex mx-auto justify-center items-center mb-2"
            >
              <img
                src={SUNNYSIDE.icons.timer}
                className="w-3 left-0 -top-4 mr-1"
              />
              <span className="mt-[2px]">{`${secondsToString(
                getSecondsToTomorrow() as number,
                {
                  length: "medium",
                }
              )} left`}</span>
            </Label>
            <p className="mb-2 text-sm text-left">
              Finding these treasures takes a lot of mental energy. I need some
              time to rest. Come back tomorrow and I can help you again.
            </p>
          </div>
          <Button onClick={closeHandle}>Continue</Button>
        </CloseButtonPanel>
      );
    }

    const goldCount = gameState.context.state.inventory.Gold || new Decimal(0);
    const requirementMet = goldCount.gte(1);

    return (
      <CloseButtonPanel
        onClose={closeHandle}
        title="Looking for treasure?"
        bumpkinParts={bumpkinParts}
      >
        <div className="text-left p-2">
          <p className="mb-2">
            I can sense the presence of treasure, jewels, and other valuable
            objects, even if they were buried deep underground.
          </p>
          <p className="mb-3">
            Give me <span className="underline">1 gold</span> and I will show
            you where 1 valuable treasure is hidden.
          </p>
          <RequirementLabel
            requirement={new Decimal(1)}
            type="item"
            className="flex justify-center text-lg mb-1"
            balance={goldCount}
            item="Gold"
          />
        </div>
        <Button disabled={!requirementMet} onClick={search}>
          Search
        </Button>
      </CloseButtonPanel>
    );
  };

  return (
    <>
      <Modal
        centered
        show={showModal}
        onHide={!isSearching ? closeHandle : undefined}
      >
        <ModalContent />
      </Modal>
      <MapPlacement x={-5} y={1} height={1} width={1}>
        {showTutorial && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="w-2 absolute animate-float"
            style={{
              top: `${PIXEL_SCALE * -14}px`,
              left: `${PIXEL_SCALE * 6}px`,
            }}
          />
        )}
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `0px`,
            left: `0px`,
          }}
        />
        <img
          src={SUNNYSIDE.npcs.betty}
          className="absolute  cursor-pointer hover:img-highlight"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * -2}px`,
          }}
          onClick={handleNPCClick}
        />
      </MapPlacement>
    </>
  );
};
