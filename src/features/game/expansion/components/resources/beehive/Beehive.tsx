import React, { useContext, useEffect, useRef, useState } from "react";
import beehive from "assets/sfts/beehive.webp";
import honeyDrop from "assets/sfts/honey_drop.webp";
import bee from "assets/icons/bee.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useInterpret, useSelector } from "@xstate/react";
import { Bar } from "components/ui/ProgressBar";
import { Beehive as IBeehive } from "features/game/types/game";
import { HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";
import {
  BeehiveContext,
  BeehiveMachineState,
  MachineInterpreter,
  beehiveMachine,
  getCurrentHoneyProduced,
  getFirstAttachedFlower,
} from "./beehiveMachine";
import { Bee } from "./Bee";
import { Modal } from "react-bootstrap";
import { NPC_WEARABLES } from "lib/npcs";
import { progressBarBorderStyle } from "features/game/lib/style";
import { ITEM_DETAILS } from "features/game/types/images";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { InfoPopover } from "features/island/common/InfoPopover";
import { translate } from "lib/i18n/translate";

interface Props {
  id: string;
}
// gameService values
const getBeehiveById = (id: string) => (state: MachineState) => {
  return state.context.state.beehives[id];
};
const compareHive = (prevHive: IBeehive, nextHive: IBeehive) => {
  return JSON.stringify(prevHive) === JSON.stringify(nextHive);
};
const _landscaping = (state: MachineState) => state.matches("landscaping");

// beehiveService values
const _honeyReady = (state: BeehiveMachineState) => state.matches("honeyReady");
const _isProducing = (state: BeehiveMachineState) => state.context.isProducing;
const _honeyProduced = (state: BeehiveMachineState) =>
  state.context.honeyProduced;
const _currentFlowerId = (state: BeehiveMachineState) =>
  state.context.attachedFlower?.id;
const _showBeeAnimation = (state: BeehiveMachineState) =>
  state.matches("showBeeAnimation");

export const Beehive: React.FC<Props> = ({ id }) => {
  const { showTimers, gameService } = useContext(Context);
  const isInitialMount = useRef(true);
  const [showProducingBee, setShowProducingBee] = useState(false);
  const [showHoneyLevelModal, setShowHoneyLevelModal] = useState(false);
  const [showHoneyLevelPopover, setShowHoneyLevelPopover] = useState(false);

  const landscaping = useSelector(gameService, _landscaping);
  const hive = useSelector(gameService, getBeehiveById(id), compareHive);

  const beehiveContext: BeehiveContext = {
    hive,
    attachedFlower: getFirstAttachedFlower(hive),
    honeyProduced: getCurrentHoneyProduced(hive),
  };

  const beehiveService = useInterpret(beehiveMachine, {
    context: beehiveContext,
    devTools: true,
  }) as unknown as MachineInterpreter;

  const honeyReady = useSelector(beehiveService, _honeyReady);
  const isProducing = useSelector(beehiveService, _isProducing);
  const honeyProduced = useSelector(beehiveService, _honeyProduced);
  const currentFlowerId = useSelector(beehiveService, _currentFlowerId);
  const showBeeAnimation = useSelector(beehiveService, _showBeeAnimation);

  const hasNewFlower = (hive: IBeehive) => {
    if (hive.flowers.length === 0) return false;

    const updatedFlowerId = getFirstAttachedFlower(hive)?.id;

    return currentFlowerId !== updatedFlowerId;
  };

  const handleBeeAnimationEnd = () => {
    beehiveService.send("BEE_ANIMATION_DONE");
    setShowProducingBee(true);
  };

  const handleHarvestHoney = () => {
    if (showHoneyLevelModal && honeyReady) {
      setShowHoneyLevelModal(false);
    }
    gameService.send("beehive.harvested", { id });
  };

  const handleHiveClick = () => {
    if (showBeeAnimation) return;
    if (honeyReady) {
      handleHarvestHoney();
      return;
    }

    setShowHoneyLevelModal(true);
  };

  const handleHover = () => {
    if (!honeyReady && !showBeeAnimation) {
      setShowHoneyLevelPopover(true);
    }
  };

  const handleMouseLeave = () => {
    if (!showHoneyLevelPopover) return;

    setShowHoneyLevelPopover(false);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (hasNewFlower(hive)) {
      beehiveService.send("NEW_ACTIVE_FLOWER", { updatedHive: hive });
    } else {
      beehiveService.send("UPDATE_HIVE", { updatedHive: hive });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hive, beehiveService]);

  useEffect(() => {
    if (isProducing === undefined) return;

    if (showProducingBee && !isProducing) {
      setShowProducingBee(false);
    }
  }, [isProducing, showProducingBee]);

  useEffect(() => {
    if (honeyProduced === 1 && showHoneyLevelPopover) {
      setShowHoneyLevelPopover(false);
    }
  }, [honeyProduced, showHoneyLevelPopover]);

  const honeyAmount = (honeyProduced / HONEY_PRODUCTION_TIME).toFixed(2);
  const percentage = (honeyProduced / HONEY_PRODUCTION_TIME) * 100;

  return (
    <>
      <div
        className={!showBeeAnimation ? "cursor-pointer" : ""}
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
        onClick={handleHiveClick}
      >
        <img
          src={beehive}
          alt="Beehive"
          className={classNames("absolute bottom-0", {
            "hover:img-highlight": !showBeeAnimation,
          })}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
        />
        <img
          src={honeyDrop}
          alt="Honey Drop"
          className={classNames(
            "absolute top-0 right-1 transition-transform duration-700",
            {
              "scale-0": !honeyReady,
              "scale-100 honey-drop-ready": honeyReady,
            }
          )}
          style={{
            width: `${PIXEL_SCALE * 7}px`,
          }}
        />
        {!showBeeAnimation && !landscaping && !!currentFlowerId && (
          <img
            src={bee}
            alt="Bee"
            className={classNames("absolute left-1/2 -translate-x-1/2", {
              "animate-enter-hive": !showProducingBee,
              "animate-exit-hive": showProducingBee,
            })}
            style={{
              width: `${PIXEL_SCALE * 7}px`,
            }}
          />
        )}
        {/* Progress bar for honey production */}
        {showTimers && !landscaping && !showBeeAnimation && (
          <div
            className="absolute pointer-events-none"
            style={{
              top: `${PIXEL_SCALE * 13.2}px`,
              width: `${PIXEL_SCALE * 15}px`,
            }}
          >
            <Bar percentage={percentage} type="quantity" />
          </div>
        )}
        {!landscaping && showBeeAnimation && (
          <Bee
            hivePosition={{ x: hive.x, y: hive.y }}
            flowerId={currentFlowerId as string}
            onAnimationEnd={handleBeeAnimationEnd}
          />
        )}
        <div
          id="popover"
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -19}px`,
          }}
        >
          <InfoPopover showPopover={showHoneyLevelPopover}>
            <div className="flex flex-1 items-center text-xxs justify-center px-2 py-1 whitespace-nowrap">
              <img src={ITEM_DETAILS.Honey.image} className="w-4 mr-1" />
              <span>
                {translate("beehive.honey")} {honeyAmount}
              </span>
            </div>
          </InfoPopover>
        </div>
      </div>
      <Modal
        size="sm"
        centered
        show={showHoneyLevelModal}
        onHide={() => setShowHoneyLevelModal(false)}
      >
        <Panel bumpkinParts={NPC_WEARABLES.stevie}>
          <>
            <div className="flex relative items-center justify-center py-1">
              <div
                className="flex w-full"
                style={{ ...progressBarBorderStyle }}
              >
                {/* Progress bar (Quantity of honey) */}
                <div
                  className="h-6 w-1/2 text-center transition-transform honey-production-gradient flex items-center justify-center"
                  style={{
                    transform: `scaleX(${Math.min(percentage / 100, 1)})`,
                    transformOrigin: "top left",
                    width: "100%",
                  }}
                />
                {/* Honey jar and amount text */}
                <div
                  className={classNames(
                    "absolute top-1/2 -left-2 transition-transform w-full z-50 flex items-center"
                  )}
                  style={{
                    transform: `translate(calc(min(${
                      percentage > 2 ? percentage : 2
                    }%, 93%)), -50%)`,
                  }}
                >
                  <img
                    src={ITEM_DETAILS.Honey.image}
                    className="z-10"
                    style={{
                      width: PIXEL_SCALE * 10,
                      height: PIXEL_SCALE * 12,
                    }}
                    alt="Honey Jar"
                  />
                  <p
                    className={classNames(
                      "text-xxs mb-1 ml-1 transition-transform duration-300",
                      {
                        "-translate-x-16": percentage > 75,
                      }
                    )}
                  >
                    {(honeyProduced / HONEY_PRODUCTION_TIME).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <Button onClick={handleHarvestHoney}>
              {translate("beehive.harvestHoney")}
            </Button>
          </>
        </Panel>
      </Modal>
    </>
  );
};
