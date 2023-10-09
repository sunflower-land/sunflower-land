import React, { useContext } from "react";

import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
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
import { useRandomItem } from "lib/utils/hooks/useRandomItem";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

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
  const state = gameState.context.state;
  const { inventory } = state;

  const composterInfo = composterDetails[composterName];

  const disabled = !hasRequirements(state, composterName) || composting;

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
        {composting && (
          <p className="text-xxs sm:text-xs text-center my-1">Composting...</p>
        )}
      </>
    );
  };

  const baitMessages = (itemName: string) => [
    `While composting, you'll unearth ${itemName}s, nature's little fishing buddies ready for reel action!`,
    `As you compost, you'll stumble upon ${itemName}s, your future fishing sidekicks!`,
    `Composting not only enriches the soil but also unveils ${itemName}s, ready to dive into a fishing adventure with you!`,
  ];

  const randomBaitMessage = useRandomItem(
    baitMessages(composterDetails[composterName].bait)
  );

  const content = () => {
    return (
      <>
        {composting && (
          <div className="flex flex-col mb-2">
            <p className="text-sm">In Progress</p>
            <div className="flex">
              <Box
                image={
                  ITEM_DETAILS[composterDetails[composterName].produce].image
                }
              />
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
        {composting && <p className="mb-2 w-full">Composts</p>}
        <div className="flex flex-wrap h-fit">
          <Box
            isSelected={true}
            key={composterDetails[composterName].produce}
            image={ITEM_DETAILS[composterDetails[composterName].produce].image}
            count={inventory[composterDetails[composterName].produce]}
          />
        </div>

        <p className="text-xxs mt-4">{randomBaitMessage}</p>
      </>
    );
  };

  return (
    <Modal show={showModal} centered onHide={() => setShowModal(false)}>
      <CloseButtonPanel
        bumpkinParts={state.bumpkin?.equipped}
        tabs={[{ icon: chest, name: composterName }]}
        onClose={() => setShowModal(false)}
      >
        <SplitScreenView
          content={content()}
          panel={
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
              actionView={Action()}
            />
          }
        />
      </CloseButtonPanel>
    </Modal>
  );
};
