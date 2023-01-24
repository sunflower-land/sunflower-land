import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "features/game/GameProvider";
import { useActor, useMachine } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { ToastContext } from "features/game/toast/ToastQueueProvider";

import goblinDigging from "assets/npcs/goblin_treasure_sheet.png";
import shadow from "assets/npcs/shadow.png";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";
import { setImageWidth } from "lib/images";
import classNames from "classnames";

import { Modal } from "react-bootstrap";
import { Revealed } from "features/game/components/Revealed";
import { SandPlotContext, sandPlotMachine } from "../lib/sandPlotMachine";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

type TreasureReward = {
  discovered: InventoryItemName | null;
  dugAt: number;
};

const Reward: React.FC<{ reward?: TreasureReward; onCollect: () => void }> = ({
  reward,
  onCollect,
}) => {
  if (!reward || !reward.discovered) return null;

  return (
    <div
      className="absolute h-full w-full flex justify-center items-end cursor-pointer"
      style={{ bottom: 16 }}
      onClick={onCollect}
    >
      <img
        src={ITEM_DETAILS[reward.discovered].image}
        className={classNames("img-highlight", {
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
      className={classNames("absolute transition-opacity duration-500", {
        "opacity-0": !fadeIn,
        "opacity-100": fadeIn,
      })}
      onLoad={(e) => setImageWidth(e.currentTarget)}
      style={{ top: "-48px", left: "-35px" }}
    />
  );
};

export const SandPlot: React.FC<{
  id: number;
  shownMissingShovelModal: boolean;
  onMissingShovelAcknowledge: () => void;
}> = ({ id, shownMissingShovelModal, onMissingShovelAcknowledge }) => {
  const goblinDiggingRef = useRef<SpriteSheetInstance>();
  const { setToast } = useContext(ToastContext);

  const { gameService, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { treasureIsland } = gameState.context.state;
  const reward = treasureIsland?.[id];

  const machineContext: Partial<SandPlotContext> = { ...reward, id };
  const [sandPlotState, sandPlotSend] = useMachine(sandPlotMachine, {
    context: machineContext,
  });

  const [showGoblinEmotion, setShowGoblinEmotion] = useState(false);
  const [showMissingShovelModal, setShowMissingShovelModal] = useState(
    shownMissingShovelModal
  );

  useEffect(() => {
    // If no treasure is found, move gameMachine back into playing state and
    if (sandPlotState.value === "treasureNotFound") {
      gameService.send("CONTINUE");
      sandPlotSend("ACKNOWLEDGE");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sandPlotState.value]);

  const handleNoShovel = async () => {
    if (!shownMissingShovelModal) {
      // To avoid modal overload, the first time a player clicks on a sand plot
      // with no sand shovel selected we will show a modal informing them they need a shovel.
      setShowMissingShovelModal(true);
      return;
    }

    // Subsequent clicks with no shovel will just show a popover.
    sandPlotSend("NO_SHOVEL");
  };

  const handleDig = () => {
    const hasSandShovel =
      selectedItem === "Sand Shovel" ||
      gameState.context.state.inventory["Sand Shovel"]?.gte(1);

    if (!hasSandShovel) {
      handleNoShovel();
      return;
    }

    gameService.send("REVEAL", {
      event: {
        type: "treasure.dug",
        id,
        createdAt: new Date(),
      },
    });

    sandPlotSend("DIG");
  };

  const acknowledgeTreasureFound = () => {
    if (!sandPlotState.context.discovered) return;

    setToast({
      icon: ITEM_DETAILS[sandPlotState.context.discovered].image,
      content: `+1`,
    });

    sandPlotSend("ACKNOWLEDGE");
  };

  const acknowledgeNoSandShovel = () => {
    setShowMissingShovelModal(false);
    onMissingShovelAcknowledge();
  };

  if (sandPlotState.matches("dug")) {
    return (
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
    );
  }

  if (sandPlotState.matches("treasureFound")) {
    return (
      <Modal centered show onHide={acknowledgeTreasureFound}>
        <CloseButtonPanel onClose={acknowledgeTreasureFound}>
          <Revealed onAcknowledged={acknowledgeTreasureFound} />
        </CloseButtonPanel>
      </Modal>
    );
  }

  if (showMissingShovelModal) {
    return (
      <Modal centered show onHide={acknowledgeNoSandShovel}>
        <CloseButtonPanel
          title="No Sand Shovel!"
          onClose={acknowledgeNoSandShovel}
        >
          <div className="p-2 pt-0 mb-2 flex flex-col items-center space-y-2">
            <img
              src={ITEM_DETAILS["Sand Shovel"].image}
              alt="Sand Shovel"
              onLoad={(e) => setImageWidth(e.currentTarget)}
            />
            <p>
              You need to have a Sand Shovel equipped to be able to dig for
              treasure!
            </p>
            <p>
              If you need to purchase one, you can head to the Treasure Shop at
              the southern end of the island.
            </p>
          </div>
          <Button onClick={acknowledgeNoSandShovel}>Got it</Button>
        </CloseButtonPanel>
      </Modal>
    );
  }

  const isDigging =
    !sandPlotState.matches("idle") &&
    !sandPlotState.matches("dug") &&
    !sandPlotState.matches("noShovel");

  const showNoSandShovelPopover = sandPlotState.matches("noShovel");

  return (
    <div className="w-full h-full relative">
      <NoSandShovel show={showNoSandShovelPopover} />
      <div
        className={classNames("w-full h-full cursor-pointer absolute", {
          "pointer-events-none": !gameState.matches("playing"),
        })}
        onClick={handleDig}
      />

      {isDigging && (
        <>
          <div
            className={classNames("w-full h-full absolute transition-opacity", {
              "opacity-100": !sandPlotState.matches("opacityTransition"),
              "opacity-0": sandPlotState.matches("opacityTransition"),
            })}
          >
            {reward && showGoblinEmotion && (
              <GoblinEmotion treasure={reward.discovered} />
            )}
            <Spritesheet
              className="absolute group-hover:img-highlight pointer-events-none z-10"
              style={{
                width: `${PIXEL_SCALE * 33}px`,
                imageRendering: "pixelated",
                bottom: "19px",
                left: "-56px",
              }}
              getInstance={(spritesheet) => {
                goblinDiggingRef.current = spritesheet;
              }}
              image={goblinDigging}
              widthFrame={33}
              heightFrame={28}
              fps={14}
              steps={13}
              endAt={13}
              direction={`forward`}
              autoplay
              loop
              onEnterFrame={[
                {
                  frame: 10,
                  callback: () => {
                    if (reward !== undefined) {
                      goblinDiggingRef.current?.pause();
                      setShowGoblinEmotion(true);

                      if (!reward.discovered) {
                        setTimeout(() => {
                          sandPlotSend({
                            type: "FINISH_DIGGING",
                            discovered: reward.discovered,
                            dugAt: reward?.dugAt,
                          });
                        }, 2000);
                      }
                    }
                  },
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
            <Reward
              reward={reward}
              onCollect={() => {
                if (!reward) return;

                sandPlotSend({
                  type: "FINISH_DIGGING",
                  discovered: reward.discovered,
                  dugAt: reward?.dugAt,
                });
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};
