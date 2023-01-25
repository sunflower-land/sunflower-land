import React, { useCallback, useContext, useState } from "react";

import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import { SUNNYSIDE } from "assets/sunnyside";
import xMark from "assets/decorations/flag.png";
import shadow from "assets/npcs/shadow.png";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Button } from "components/ui/Button";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Label } from "components/ui/Label";
import { getSecondsToTomorrow, secondsToString } from "lib/utils/time";
import { CLICKABLE_COORDINATES } from "../TreasureIsland";

export const TreasureDetector: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showModal, setShowModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("Treasure Detector")
  );

  const [isSearching, setIsSearching] = useState(false);

  console.log({ state: gameState.value });
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

  const ModalContent = () => {
    if (treasureIsland?.rareTreasure?.reward) {
      return (
        <div className="text-center p-1">
          <img src={xMark} className="w-1/4 m-auto my-2" />
          <p className="mb-2">Dig at the red flag!</p>
          <Button onClick={closeHandle}>Continue</Button>
        </div>
      );
    }

    if (isSearching) {
      return (
        <div className="w-full text-center">
          <p className="loading">Searching</p>
        </div>
      );
    }

    if (showTutorial) {
      return (
        <div className="text-left p-1">
          <p className="mb-2">
            I was born with a special gift, the ability to magically detect
            where treasure was hidden.
          </p>
          <p className="mb-2">
            {`I've worked with archaeologists, historians, and treasure hunters,
            using my abilities to uncover hidden riches that had been lost for
            centuries.`}
          </p>
          <Button onClick={acknowledge}>Continue</Button>
        </div>
      );
    }

    const hasDug = false;
    // const hasDug =
    //   new Date(treasureIsland?.rareTreasure?.discoveredAt ?? 0).getUTCDay() ===
    //   new Date().getUTCDay();

    if (hasDug) {
      return (
        <div className="text-center p-1">
          <p className="mb-2 text-sm">
            You can only search for Treasure once a day
          </p>
          <Label type="info" className="flex w-1/2 mx-auto justify-center">
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
        </div>
      );
    }

    const goldCount = gameState.context.state.inventory.Gold || new Decimal(0);
    const requirementMet = goldCount.gte(1);

    return (
      <div className="text-left p-1">
        <p className="mb-2">
          I can sense the presence of treasure, jewels, and other valuable
          objects, even if they were buried deep underground.
        </p>
        <p className="mb-2">
          Give me <span className="underline">1 gold</span> and I will show you
          where 1 valuable treasure is hidden
        </p>
        <RequirementLabel
          requirement={new Decimal(1)}
          type="item"
          className="flex justify-center text-lg my-2"
          balance={goldCount}
          item="Gold"
        />
        <Button disabled={!requirementMet} onClick={search}>
          Search
        </Button>
      </div>
    );
  };

  const rareTreasure = treasureIsland?.rareTreasure;

  console.log({ rareTreasure });
  return (
    <>
      <Modal centered show={showModal} onHide={closeHandle}>
        <CloseButtonPanel
          onClose={closeHandle}
          title="Looking for treasure?"
          bumpkinParts={{
            body: "Light Brown Farmer Potion",
            hair: "Luscious Hair",
            shirt: "SFL T-Shirt",
            tool: "Sword",
          }}
        >
          <ModalContent />
        </CloseButtonPanel>
      </Modal>
      <MapPlacement x={-8} y={10} height={1} width={1}>
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
          onClick={() => setShowModal(true)}
        />
      </MapPlacement>

      {rareTreasure?.reward && (
        <div
          className="pointer-events-none absolute"
          style={{
            top: `calc(50% - ${
              GRID_WIDTH_PX * CLICKABLE_COORDINATES[rareTreasure?.holeId].y
            }px)`,
            left: `calc(50% + ${
              GRID_WIDTH_PX * CLICKABLE_COORDINATES[rareTreasure?.holeId].x
            }px)`,
            height: `${GRID_WIDTH_PX}px`,
            width: `${GRID_WIDTH_PX}px`,
          }}
        >
          <img
            src={xMark}
            style={{
              width: `${PIXEL_SCALE * 16}px`,
            }}
            className="absolute bottom-0"
          />
        </div>
      )}
    </>
  );
};
