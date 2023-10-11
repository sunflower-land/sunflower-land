import React, { useContext, useEffect, useState } from "react";

import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { hasRequirements } from "features/game/events/landExpansion/startComposter";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { ITEM_DETAILS } from "features/game/types/images";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import tutorial from "src/assets/tutorials/composting.png";
import {
  ComposterName,
  composterDetails,
} from "features/game/types/composters";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `composter-read.${host}-${window.location.pathname}`;

function acknowledgeRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

function hasRead() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

interface Props {
  composting: boolean;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  startComposter: () => void;
  composterName: ComposterName;
  secondsTillReady: number;
}

export const ComposterModal: React.FC<Props> = ({
  composting,
  showModal,
  composterName,
  secondsTillReady,
  setShowModal,
  startComposter,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showHelp, setShowHelp] = useState(!hasRead());

  const state = gameState.context.state;

  const composterInfo = composterDetails[composterName];

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
    return (
      <CloseButtonPanel title={<br />} onClose={() => setShowModal(false)}>
        <img
          src={SUNNYSIDE.icons.expression_confused}
          className="absolute left-3 top-2 w-5 cursor-pointer"
          onClick={() => setShowHelp(true)}
        />
        <CraftingRequirements
          gameState={state}
          details={{
            item: composterInfo.produce,
            quantity: new Decimal(10),
          }}
          requirements={{
            resources: composterInfo.requirements,
            timeSeconds: composterInfo.timeToFinishMilliseconds / 1000,
          }}
        />
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
