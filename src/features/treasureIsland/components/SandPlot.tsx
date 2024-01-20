/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "features/game/GameProvider";
import { useActor, useInterpret, useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";

import shadow from "assets/npcs/shadow.png";
import drillingGoblin from "assets/npcs/drilling.gif";
import pirate from "assets/npcs/pirate_goblin.gif";

import { ITEM_DETAILS } from "features/game/types/images";
import {
  InventoryItemName,
  Reward,
  TreasureHole,
  GameState,
} from "features/game/types/game";
import { setImageWidth } from "lib/images";
import classNames from "classnames";

import { Modal } from "react-bootstrap";
import { Revealed } from "features/game/components/Revealed";
import {
  MachineState,
  SandPlotContext,
  sandPlotMachine,
  canDig,
} from "../lib/sandPlotMachine";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getKeys } from "features/game/types/craftables";
import { Panel } from "components/ui/Panel";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { ZoomContext } from "components/ZoomProvider";
import { translate } from "lib/i18n/translate";

const Reward: React.FC<{ reward?: TreasureHole }> = ({ reward }) => {
  if (!reward || !reward.discovered) return null;

  return (
    <div
      id="reward-comp"
      className="absolute h-full w-full flex justify-center items-end cursor-pointer"
      style={{ bottom: 16 }}
    >
      <img
        src={ITEM_DETAILS[reward.discovered].image}
        className={classNames("img-highlight-heavy", {
          "treasure-reward": reward.discovered,
        })}
        onLoad={(e) => setImageWidth(e.currentTarget)}
      />
    </div>
  );
};

const NoSandShovel: React.FC<{ show: boolean }> = ({ show }) => (
  <>
    <img
      src={SUNNYSIDE.icons.cancel}
      className={classNames(
        "transition-opacity absolute z-20 pointer-events-none",
        {
          "opacity-100": show,
          "opacity-0": !show,
        }
      )}
      style={{
        width: `${PIXEL_SCALE * 8}px`,
        top: `${PIXEL_SCALE * 5}px`,
        left: `${PIXEL_SCALE * 4}px`,
      }}
    />
    <img
      src={ITEM_DETAILS["Sand Shovel"].image}
      className={classNames(
        "transition-opacity absolute z-10 pointer-events-none",
        {
          "opacity-100": show,
          "opacity-0": !show,
        }
      )}
      style={{
        width: `${PIXEL_SCALE * 8}px`,
        top: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 9}px`,
      }}
    />
  </>
);

const GoblinEmotion: React.FC<{ treasure: InventoryItemName | null }> = ({
  treasure,
}) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 100);
  }, []);

  return (
    <img
      src={treasure ? SUNNYSIDE.icons.happy : SUNNYSIDE.icons.sad}
      className={classNames("absolute transition-opacity duration-500 z-50", {
        "opacity-0": !fadeIn,
        "opacity-100": fadeIn,
      })}
      onLoad={(e) => setImageWidth(e.currentTarget)}
      style={{ top: "-48px", left: "-35px" }}
    />
  );
};

const isDug = (state: MachineState) => state.matches("dug");
const isTreasureNotFound = (state: MachineState) =>
  state.matches("treasureNotFound");
const isTreasureFound = (state: MachineState) => state.matches("treasureFound");
const isIdle = (state: MachineState) => state.matches("idle");
const isNoShovel = (state: MachineState) => state.matches("noShovel");
const isFinishing = (state: MachineState) => state.matches("finishing");
const isDrilling = (state: MachineState) => state.matches("drilling");

const getMaxHolesPerDay = (game: GameState) => {
  const MAX_HOLES_PER_DAY = 30;
  if (isCollectibleBuilt({ name: "Heart of Davy Jones", game })) {
    return MAX_HOLES_PER_DAY + 20;
  }
  return MAX_HOLES_PER_DAY;
};

export const SandPlot: React.FC<{
  id: number;
  shownMissingShovelModal: boolean;
  onMissingShovelAcknowledge: () => void;
}> = ({ id, shownMissingShovelModal, onMissingShovelAcknowledge }) => {
  const { scale } = useContext(ZoomContext);

  const goblinDiggingRef = useRef<SpriteSheetInstance>();

  const { gameService, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { treasureIsland, collectibles } = gameState.context.state;
  // Last reward found on this hole
  const lastReward = treasureIsland?.holes?.[id];
  // Initialise the plot machine with the current rewards dugAt time
  const machineContext: Partial<SandPlotContext> = {
    dugAt: lastReward?.dugAt,
    id,
  };
  const sandPlotService = useInterpret(sandPlotMachine, {
    context: machineContext,
  });

  const idle = useSelector(sandPlotService, isIdle);
  const treasureFound = useSelector(sandPlotService, isTreasureFound);
  const treasureNotFound = useSelector(sandPlotService, isTreasureNotFound);
  const dug = useSelector(sandPlotService, isDug);
  const noShovel = useSelector(sandPlotService, isNoShovel);
  const finishing = useSelector(sandPlotService, isFinishing);
  const drilling = useSelector(sandPlotService, isDrilling);

  const [showHoverState, setShowHoverState] = useState(false);
  const [showGoblinEmotion, setShowGoblinEmotion] = useState(false);
  const [showMissingShovelModal, setShowMissingShovelModal] = useState(
    shownMissingShovelModal
  );
  const [showMaxHolesModal, setShowMaxHolesModal] = useState(false);
  const [newReward, setNewReward] = useState<TreasureHole | undefined>();

  const hasSandShovel =
    selectedItem === "Sand Shovel" &&
    gameState.context.state.inventory["Sand Shovel"]?.gte(1);

  const hasSandDrill =
    selectedItem === "Sand Drill" &&
    gameState.context.state.inventory["Sand Drill"]?.gte(1);

  useEffect(() => {
    // If no treasure is found, move gameMachine back into playing state and
    if (treasureNotFound) {
      gameService.send("CONTINUE");
      sandPlotService.send("ACKNOWLEDGE");
      return;
    }
  }, [treasureNotFound]);

  useEffect(() => {
    if (!lastReward) return;

    if (lastReward?.dugAt > Date.now() - 60 * 1000) {
      setNewReward(lastReward);
    }
  }, [lastReward]);

  const handleNoShovel = async () => {
    if (!shownMissingShovelModal) {
      // To avoid modal overload, the first time a player clicks on a sand plot
      // with no sand shovel selected we will show a modal informing them they need a shovel.
      setShowMissingShovelModal(true);
      return;
    }

    // Subsequent clicks with no shovel will just show a popover.
    sandPlotService.send("NO_SHOVEL");
  };

  const handleDig = () => {
    const holes = gameState.context.state.treasureIsland?.holes ?? {};

    // do not allow digging the same hole twice
    if (!canDig(holes[id]?.dugAt)) return;

    const holesDug = getKeys(holes).filter(
      (holeId) => !canDig(holes[holeId]?.dugAt)
    ).length;

    if (holesDug >= getMaxHolesPerDay(gameState.context.state)) {
      setShowMaxHolesModal(true);
      return;
    }

    if (hasSandShovel) {
      gameService.send("REVEAL", {
        event: {
          type: "treasure.dug",
          id,
          createdAt: new Date(),
        },
      });

      sandPlotService.send("DIG");
      return;
    }

    if (hasSandDrill) {
      gameService.send("REVEAL", {
        event: {
          type: "treasure.drilled",
          id,
          createdAt: new Date(),
        },
      });
      sandPlotService.send("DRILL");
      return;
    }

    handleNoShovel();
  };

  const handleAcknowledgeTreasureFound = () => {
    if (!newReward?.discovered) return;

    sandPlotService.send("ACKNOWLEDGE");
    // Modal prevents hover state from resetting
    setShowHoverState(false);
  };

  const handleAcknowledgeNoSandShovel = () => {
    setShowMissingShovelModal(false);
    onMissingShovelAcknowledge();
    setShowHoverState(false);
  };

  // Each time the sprite sheet gets to the 10th frame (shovel up)
  // If reward has returned then stop sprite here.
  const handleTreasureCheck = () => {
    // Avoid checking for previous day rewards

    if (newReward) {
      goblinDiggingRef.current?.pause();
      setShowGoblinEmotion(true);

      setTimeout(() => {
        sandPlotService.send("FINISH_DIGGING", {
          treasureFound: !!newReward.discovered,
          dugAt: newReward?.dugAt,
        });
      }, 1000);
    }
  };

  useEffect(() => {
    if (newReward && drilling) {
      sandPlotService.send("FINISH_DIGGING", {
        treasureFound: !!newReward.discovered,
        dugAt: newReward?.dugAt,
      });
    }
  }, [drilling, newReward]);

  if (dug || treasureFound) {
    return (
      <>
        <div className="w-full h-full">
          <img
            src={SUNNYSIDE.soil.sand_dug}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              top: `${PIXEL_SCALE * 2}px`,
            }}
          />
        </div>
        <Modal centered show={treasureFound}>
          <CloseButtonPanel>
            <Revealed onAcknowledged={handleAcknowledgeTreasureFound} />
          </CloseButtonPanel>
        </Modal>
      </>
    );
  }

  if (showMissingShovelModal) {
    return (
      <Modal centered show onHide={handleAcknowledgeNoSandShovel}>
        <CloseButtonPanel
          title={translate("treasureModal.noShovelTitle")}
          onClose={handleAcknowledgeNoSandShovel}
        >
          <div className="p-2 pt-0 mb-2 flex flex-col items-center space-y-2">
            <img
              src={ITEM_DETAILS["Sand Shovel"].image}
              alt="Sand Shovel"
              onLoad={(e) => setImageWidth(e.currentTarget)}
            />
            <p>{translate("treasureModal.needShovel")}</p>
            <p>{translate("treasureModal.purchaseShovel")}</p>
          </div>
          <Button onClick={handleAcknowledgeNoSandShovel}>
            {translate("treasureModal.gotIt")}
          </Button>
        </CloseButtonPanel>
      </Modal>
    );
  }

  if (showMaxHolesModal) {
    return (
      <Modal centered show onHide={() => setShowMaxHolesModal(false)}>
        <CloseButtonPanel
          title={translate("treasureModal.maxHolesTitle")}
          onClose={() => setShowMaxHolesModal(false)}
        >
          <div className="p-2 pt-0 mb-2 flex flex-col items-center space-y-2">
            <img
              src={pirate}
              alt="Pirate"
              onLoad={(e) => setImageWidth(e.currentTarget)}
            />
            <p className="text-sm text-center">
              {translate("treasureModal.saveTreasure")}
            </p>
            <p className="text-sm text-center">
              {translate("treasureModal.comeBackTomorrow")}
            </p>
          </div>
          <Button onClick={() => setShowMaxHolesModal(false)}>
            {translate("treasureModal.gotIt")}
          </Button>
        </CloseButtonPanel>
      </Modal>
    );
  }

  if (drilling) {
    return (
      <Modal centered show>
        <Panel>
          <div className="flex flex-col items-center mt-2">
            <p className="text-center loading">
              {translate("treasureModal.drilling")}
            </p>
            <img
              className="mx-auto my-2"
              style={{
                width: `${PIXEL_SCALE * 36}px`,
              }}
              src={drillingGoblin}
            />
          </div>
        </Panel>
      </Modal>
    );
  }

  const gameMachinePlaying = gameState.matches("playing");

  const showShovelGoblin = !idle && !dug && !noShovel;
  const showSelectBox =
    showHoverState &&
    !showShovelGoblin &&
    gameMachinePlaying &&
    (hasSandShovel || hasSandDrill);

  return (
    <div
      id={`${id}`}
      className="w-full h-full relative"
      onMouseEnter={() => setShowHoverState(true)}
      onMouseLeave={() => setShowHoverState(false)}
    >
      <NoSandShovel show={noShovel} />
      <div
        className={classNames("w-full h-full cursor-pointer absolute", {
          "pointer-events-none": !gameMachinePlaying,
        })}
        onClick={handleDig}
      >
        <img
          src={SUNNYSIDE.ui.select_box}
          className={classNames("absolute z-40 cursor-pointer", {
            "opacity-100": showSelectBox,
            "opacity-0": !showSelectBox,
          })}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
        />
      </div>

      {showShovelGoblin && (
        <>
          <div
            className={classNames("w-full h-full absolute transition-opacity", {
              "opacity-100": !finishing,
              "opacity-0": finishing,
            })}
          >
            {newReward && showGoblinEmotion && (
              <GoblinEmotion treasure={newReward.discovered} />
            )}
            <Spritesheet
              className="absolute group-hover:img-highlight pointer-events-none z-50"
              style={{
                width: `${PIXEL_SCALE * 33}px`,
                imageRendering: "pixelated",
                top: "-50px",
                left: "-56px",
              }}
              getInstance={(spritesheet) => {
                goblinDiggingRef.current = spritesheet;
              }}
              image={SUNNYSIDE.npcs.goblin_treasure_sheet}
              widthFrame={33}
              heightFrame={28}
              zoomScale={scale}
              fps={14}
              steps={13}
              endAt={13}
              direction={`forward`}
              autoplay
              loop
              onEnterFrame={[
                {
                  frame: 10,
                  callback: handleTreasureCheck,
                },
              ]}
            />
            <img
              src={shadow}
              className="absolute"
              style={{
                width: `${PIXEL_SCALE * 15}px`,
                left: `-37px`,
                bottom: `16px`,
              }}
            />
          </div>
          <div className="absolute w-full h-full">
            <img
              src={SUNNYSIDE.soil.sand_dug}
              className="absolute"
              style={{
                width: `${PIXEL_SCALE * 16}px`,
                top: `${PIXEL_SCALE * 2}px`,
              }}
            />
            <Reward reward={newReward} />
          </div>
        </>
      )}
    </div>
  );
};
