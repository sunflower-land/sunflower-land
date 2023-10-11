import React, { useContext, useEffect, useState } from "react";

import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { hasRequirements } from "features/game/events/landExpansion/startComposter";
import { ITEM_DETAILS } from "features/game/types/images";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import tutorial from "src/assets/tutorials/composting.png";
import lightning from "src/assets/icons/lightning.png";
import powerup from "src/assets/icons/level_up.png";

import basicIdle from "assets/composters/composter_basic.png";
import basicComposting from "assets/composters/composter_basic_closed.png";
import basicReady from "assets/composters/composter_basic_ready.png";
import advancedIdle from "assets/composters/composter_advanced.png";
import advancedComposting from "assets/composters/composter_advanced_closed.png";
import advancedReady from "assets/composters/composter_advanced_ready.png";
import expertIdle from "assets/composters/composter_expert.png";
import expertComposting from "assets/composters/composter_expert_closed.png";
import expertReady from "assets/composters/composter_expert_ready.png";

import {
  ComposterName,
  composterDetails,
} from "features/game/types/composters";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { secondsToString } from "lib/utils/time";
import { GameState, Inventory } from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { SquareIcon } from "components/ui/SquareIcon";

const COMPOSTER_IMAGES: Record<
  ComposterName,
  {
    idle: string;
    composting: string;
    ready: string;
  }
> = {
  "Basic Composter": {
    composting: basicComposting,
    idle: basicIdle,
    ready: basicReady,
  },
  "Advanced Composter": {
    composting: advancedComposting,
    idle: advancedIdle,
    ready: advancedReady,
  },
  "Expert Composter": {
    composting: expertComposting,
    idle: expertIdle,
    ready: expertReady,
  },
};
const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `composter-read.${host}-${window.location.pathname}`;

function acknowledgeRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

function hasRead() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  startComposter: () => void;
  composterName: ComposterName;
  onCollect: () => void;
  readyAt?: number;
}

export const ComposterModal: React.FC<Props> = ({
  showModal,
  composterName,
  setShowModal,
  startComposter,
  readyAt,
  onCollect,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showHelp, setShowHelp] = useState(!hasRead());

  const state = gameState.context.state;

  const composterInfo = composterDetails[composterName];

  const composting = !!readyAt && readyAt > Date.now();
  const isReady = readyAt && readyAt < Date.now();

  const disabled = !hasRequirements(state, composterName) || composting;

  useEffect(() => {
    setShowHelp(showModal && !hasRead());
  }, [showModal]);

  const Content = () => {
    if (showHelp) {
      return (
        <CloseButtonPanel
          title={"Composting Guide"}
          onClose={() => {
            setShowModal(false);
          }}
        >
          <div className="p-2">
            <img src={tutorial} className="w-full mx-auto rounded-lg mb-2" />
            <div className="flex mb-2">
              <div className="w-12 flex justify-center">
                <img
                  src={SUNNYSIDE.icons.timer}
                  className="h-6 mr-2 object-contain"
                />
              </div>
              <p className="text-sm  flex-1">
                Place crops in the composter & wait!
              </p>
            </div>
            <div className="flex mb-2">
              <div className="w-12 flex justify-center">
                <img
                  src={ITEM_DETAILS["Rapid Root"].image}
                  className="h-6 mr-2 object-contain"
                />
              </div>
              <p className="text-sm  flex-1">
                A compost produces 10 Fertilisers which can be used to boost
                your crops & fruit
              </p>
            </div>
            <div className="flex mb-2">
              <div className="w-12 flex justify-center">
                <img
                  src={SUNNYSIDE.tools.fishing_rod}
                  className="h-6 mr-2 object-contain"
                />
              </div>
              <p className="text-sm flex-1">
                Each compost also has a chance of producing 3-5 worms that can
                be used as bait for fishing.
              </p>
            </div>
          </div>
          <Button
            className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
            onClick={() => {
              setShowHelp(false);
              acknowledgeRead();
            }}
          >
            Ok
          </Button>
        </CloseButtonPanel>
      );
    }

    if (isReady) {
      return (
        <CloseButtonPanel title={<br />} onClose={() => setShowModal(false)}>
          <img
            src={SUNNYSIDE.icons.expression_confused}
            className="absolute left-3 top-2.5 w-5 cursor-pointer"
            onClick={() => setShowHelp(true)}
          />
          <div className="flex flex-col items-center">
            <img
              src={COMPOSTER_IMAGES[composterName].ready}
              className="w-32 mb-2"
            />
            <p className="text-sm">Congratulations, you found:</p>
            <div className="flex flex-wrap  items-center my-2">
              <div className="flex items-center mr-4">
                <span className="text-sm mr-1">10 x</span>
                <img
                  src={
                    ITEM_DETAILS[composterDetails[composterName].produce].image
                  }
                  className="h-6"
                />
              </div>
              <div className="flex  items-center">
                <span className="text-sm mr-1">1 x</span>
                <img
                  src={ITEM_DETAILS[composterDetails[composterName].bait].image}
                  className="h-6"
                />
              </div>
            </div>
            <div className="flex justify-center text-center my-1">
              <img
                src={
                  composterDetails[composterName].produce === "Rapid Root"
                    ? lightning
                    : powerup
                }
                className="h-4 mr-1"
              />
              <span className="text-xs">
                Apply the fertiliser to the soil to boost your crops.
              </span>
            </div>
            <Button
              className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
              onClick={onCollect}
            >
              Collect
            </Button>
          </div>
        </CloseButtonPanel>
      );
    }

    if (composting) {
      return (
        <CloseButtonPanel title={<br />} onClose={() => setShowModal(false)}>
          <img
            src={SUNNYSIDE.icons.expression_confused}
            className="absolute left-3 top-2.5 w-5 cursor-pointer"
            onClick={() => setShowHelp(true)}
          />
          <div className="flex flex-col items-center">
            <img
              src={COMPOSTER_IMAGES[composterName].composting}
              className="w-32"
            />
            <p className="text-sm loading">Composting</p>
            <div className="flex items-center mb-2">
              <img src={SUNNYSIDE.icons.timer} className="h-4 mr-3" />

              <span className="text-xs mr-1">
                {secondsToString((readyAt - Date.now()) / 1000, {
                  length: "full",
                })}
              </span>
            </div>
            <Label type="default" className="mb-2">
              <div className="flex items-center">
                <span className="text-xs mr-1">10 </span>
                <img
                  src={ITEM_DETAILS[composterInfo.produce].image}
                  className="h-4 mr-3"
                />

                <span className="text-xs mr-1">1</span>
                <img
                  src={ITEM_DETAILS[composterInfo.bait].image}
                  className="h-4 mr-3"
                />
              </div>
            </Label>
          </div>
        </CloseButtonPanel>
      );
    }
    return (
      <CloseButtonPanel title={<br />} onClose={() => setShowModal(false)}>
        <img
          src={SUNNYSIDE.icons.expression_confused}
          className="absolute left-3 top-2.5 w-5 cursor-pointer"
          onClick={() => setShowHelp(true)}
        />

        <div className="flex flex-col h-full">
          <div className="flex flex-col h-full px-1 py-0">
            <div className="flex sm:flex-row flex-col">
              <div className="flex space-x-2 justify-start items-center mr-4">
                <div className="">
                  <SquareIcon
                    icon={
                      ITEM_DETAILS[composterDetails[composterName].produce]
                        .image
                    }
                    width={14}
                  />
                </div>
                <div className="block">
                  <p className="text-sm">
                    10 x {composterDetails[composterName].produce}
                  </p>
                  <Label type="success" className="text-xs whitespace-pre-line">
                    +0.2 Crop fertiliser
                  </Label>
                </div>
              </div>
              <div className="flex space-x-2 justify-start items-center mt-2 sm:mt-0">
                <div className="">
                  <SquareIcon
                    icon={
                      ITEM_DETAILS[composterDetails[composterName].bait].image
                    }
                    width={14}
                  />
                </div>
                <div className="block">
                  <p className="text-sm">
                    1 x {composterDetails[composterName].bait}
                  </p>
                  <Label type="default" className="text-xs whitespace-pre-line">
                    Fishing bait
                  </Label>
                </div>
              </div>
            </div>
            <div className="border-t border-white w-full my-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap ">
              {/* Item ingredients requirements */}
              {!!composterInfo.requirements &&
                getKeys(composterInfo.requirements).map(
                  (ingredientName, index) => (
                    <RequirementLabel
                      key={index}
                      type="item"
                      item={ingredientName}
                      balance={
                        gameState.context.state.inventory[ingredientName] ??
                        new Decimal(0)
                      }
                      requirement={
                        (composterInfo.requirements ?? {})[ingredientName] ??
                        new Decimal(0)
                      }
                    />
                  )
                )}

              <RequirementLabel
                type="time"
                waitSeconds={composterInfo.timeToFinishMilliseconds / 1000}
              />
            </div>
          </div>
        </div>

        <Button
          disabled={disabled}
          className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
          onClick={() => startComposter()}
        >
          Compost
        </Button>
      </CloseButtonPanel>
    );
  };

  return (
    <Modal show={showModal} centered onHide={() => setShowModal(false)}>
      <Content />
    </Modal>
  );
};

interface CraftingProps {
  gameState: GameState;
  stock?: Decimal;
  isLimitedItem?: boolean;
  details: any;
  boost?: string;
  requirements?: Inventory;
  limit?: number;
  actionView?: JSX.Element;
  hideDescription?: boolean;
  seconds: number;
}
export const CraftingRequirements: React.FC<CraftingProps> = ({
  gameState,
  stock,
  isLimitedItem = false,
  limit,
  details,
  boost,
  requirements,
  actionView,
  hideDescription,
  seconds,
}: CraftingProps) => {
  const getItemDetail = ({
    hideDescription,
  }: {
    hideDescription?: boolean;
  }) => {
    const { image: icon, description, name } = details;
    const title = details.quantity
      ? `${details.quantity} x ${details.item}`
      : name;

    return (
      <>
        <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0">
          {icon && !!details.item && (
            <div className="sm:mt-2">
              <SquareIcon icon={icon} width={14} />
            </div>
          )}
          <span className="sm:text-center">{title}</span>
        </div>
        {!hideDescription && (
          <span className="text-xs sm:mt-1 whitespace-pre-line sm:text-center">
            {description}
          </span>
        )}
      </>
    );
  };

  const getRequirements = () => {
    if (!requirements) return <></>;

    return (
      <div className="border-t border-white w-full my-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap sm:flex-col sm:items-center sm:flex-nowrap">
        {/* Item ingredients requirements */}
        {!!requirements &&
          getKeys(requirements).map((ingredientName, index) => (
            <RequirementLabel
              key={index}
              type="item"
              item={ingredientName}
              balance={gameState.inventory[ingredientName] ?? new Decimal(0)}
              requirement={
                (requirements ?? {})[ingredientName] ?? new Decimal(0)
              }
            />
          ))}

        <RequirementLabel type="time" waitSeconds={seconds} />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col h-full px-1 py-0">
        {getItemDetail({ hideDescription })}
        {limit && (
          <p className="my-1 text-xs text-left sm:text-center">{`Max ${limit} per player`}</p>
        )}
        {getRequirements()}
      </div>
      {actionView}
    </div>
  );
};
