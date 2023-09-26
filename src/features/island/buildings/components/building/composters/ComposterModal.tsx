import React from "react";

import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { GameState, Inventory } from "features/game/types/game";
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
import Decimal from "decimal.js-light";
import { Box } from "components/ui/Box";

interface Props {
  composting: boolean;
  idle: boolean;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  startComposter: () => void;
  gameState: GameState;
  composterName: ComposterName;
  secondsTillReady: number;
  inventory: Inventory;
}

export const ComposterModal: React.FC<Props> = ({
  composting,
  idle,
  showModal,
  gameState,
  composterName,
  secondsTillReady,
  inventory,
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
    );
  };

  const content = () => {
    // return (
    //   <div className="flex flex-col items-center h-full justify-center">
    //     <img
    //       src={getImage()}
    //       style={{
    //         marginRight: `${PIXEL_SCALE * 2}px`,
    //         marginBottom: `${PIXEL_SCALE * 2}px`,
    //         width: getImageWidth(),
    //       }}
    //     />
    //     <div className="flex flex-col mb-2">
    //       {composting && inProgress()}

    //       {composterName === "Basic Composter" && (
    //         <p className="text-xxs">
    //           The Basic Composter provides 10x Sprout Mixs every 6hrs and you
    //           might find Earthworms while collecting your compost.
    //         </p>
    //       )}
    //       {composterName === "Advanced Composter" && (
    //         <p className="text-xxs">
    //           The Advanced Composter provides 10x Fruitful Blend every 8hrs and
    //           you might find Grubs while collecting your compost.
    //         </p>
    //       )}
    //       {composterName === "Expert Composter" && (
    //         <p className="text-xxs">
    //           The Expert Composter provides 10x Rapid Root every 12hrs and you
    //           might find Red Wigglers while collecting your compost.
    //         </p>
    //       )}
    //     </div>
    //   </div>
    // );

    return (
      <>
        {composting && (
          <div className="flex flex-col mb-2">
            <p className="text-sm">In Progress</p>
            <div className="flex">
              <Box image={ITEM_DETAILS[composterName].image} />
              <div
                className="relative flex flex-col w-full"
                style={{
                  marginTop: `${PIXEL_SCALE * 3}px`,
                  marginBottom: `${PIXEL_SCALE * 2}px`,
                }}
                id="progress-bar"
              >
                <span className="text-xs mb-1">
                  {secondsToString(secondsTillReady, { length: "medium" })}
                </span>
                <ResizableBar
                  percentage={
                    (1 -
                      secondsTillReady /
                        composterDetails[composterName]
                          .timeToFinishMilliseconds) *
                    100
                  }
                  type="progress"
                />
              </div>
            </div>
          </div>
        )}
        {composting && <p className="mb-2 w-full">Recipes</p>}
        <div className="flex flex-wrap h-fit">
          <Box
            isSelected={true}
            key={composterName}
            image={ITEM_DETAILS[composterName].image}
            count={inventory[composterName]}
          />
        </div>
      </>
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
                quantity: new Decimal(10),
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
