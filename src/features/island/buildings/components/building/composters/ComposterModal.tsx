import React from "react";

import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { GameState } from "features/game/types/game";
import { hasRequirements } from "features/game/events/landExpansion/startComposter";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { ITEM_DETAILS } from "features/game/types/images";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import chest from "src/assets/icons/chest.png";
import {
  ComposterName,
  composterDetails,
} from "features/game/types/composters";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { secondsToString } from "lib/utils/time";
import { ResizableBar } from "components/ui/ProgressBar";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  startComposter: () => void;
  composting: boolean;
  gameState: GameState;
  composterName: ComposterName;
  secondsTillReady: number;
}

export const ComposterModal: React.FC<Props> = ({
  composting,
  showModal,
  gameState,
  composterName,
  secondsTillReady,
  setShowModal,
  startComposter,
}) => {
  const composterInfo = composterDetails[composterName];

  const disabled = !hasRequirements(gameState, composterName) || composting;

  const Action = () => {
    return (
      <>
        <Button
          disabled={disabled}
          className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
          onClick={() => startComposter()}
        >
          Compost
        </Button>
      </>
    );
  };

  const inProgress = () => {
    return (
      <div className="flex flex-col mb-2">
        <div
          className="relative flex w-full justify-center"
          style={{
            marginTop: `${PIXEL_SCALE * 3}px`,
            marginBottom: `${PIXEL_SCALE * 2}px`,
          }}
          id="progress-bar"
        >
          <span className="text-xs mb-1 mr-2">
            {secondsToString(secondsTillReady, {
              length: "medium",
            })}
          </span>
          <ResizableBar
            percentage={
              (1 -
                secondsTillReady /
                  (composterInfo.timeToFinishMilliseconds / 1000)) *
              100
            }
            type="progress"
          />
        </div>
        {composterName === "Basic Composter" && (
          <p className="text-xxs">
            While composting you get a boost of +0.2 on crops surrounding the
            composter
          </p>
        )}
        {composterName === "Advanced Composter" && (
          <p className="text-xxs">
            While composting you get a boost of +0.25 on Fruit Patches
            surrounding the composter
          </p>
        )}
        {composterName === "Expert Composter" && (
          <p className="text-xxs">
            While composting you get a boost of +50% crop speed on crops
            surrounding the composter
          </p>
        )}
      </div>
    );
  };

  const idle = () => {
    return (
      <div className="flex flex-col mb-2">
        {composterName === "Basic Composter" && (
          <p className="text-xxs">
            The Basic Composter provides one Earthworm every 6hrs
          </p>
        )}
        {composterName === "Advanced Composter" && (
          <p className="text-xxs">
            The Advanced Composter provides one Grub every 8hrs
          </p>
        )}
        {composterName === "Expert Composter" && (
          <p className="text-xxs">
            The Expert Composter provides one Red Wiggler every 12hrs
          </p>
        )}
      </div>
    );
  };

  const getImageWidth = () => {
    if (composterName === "Basic Composter") {
      return `${PIXEL_SCALE * 24}px`;
    }
    if (composterName === "Advanced Composter") {
      return `${PIXEL_SCALE * 27}px`;
    }
    if (composterName === "Expert Composter") {
      return `${PIXEL_SCALE * 34}px`;
    }
  };

  const content = () => {
    return (
      <div className="flex flex-col items-center h-full justify-center">
        <img
          src={ITEM_DETAILS[composterName].image}
          style={{
            marginRight: `${PIXEL_SCALE * 2}px`,
            marginBottom: `${PIXEL_SCALE * 2}px`,
            width: getImageWidth(),
          }}
        />
        <div>
          {composting && inProgress()}
          {!composting && idle()}
        </div>
      </div>
    );
  };
  return (
    <Modal show={showModal} centered onHide={() => setShowModal(false)}>
      <CloseButtonPanel
        bumpkinParts={gameState.bumpkin?.equipped}
        tabs={[{ icon: chest, name: composterName }]}
        onClose={() => setShowModal(false)}
      >
        <SplitScreenView
          content={content()}
          panel={
            <CraftingRequirements
              gameState={gameState}
              details={{
                item: composterInfo.produce,
              }}
              requirements={{
                resources: composterInfo.requirements,
                timeSeconds: composterInfo.timeToFinishMilliseconds / 1000,
              }}
              actionView={Action()}
            />
          }
        />
      </CloseButtonPanel>
    </Modal>
  );
};
