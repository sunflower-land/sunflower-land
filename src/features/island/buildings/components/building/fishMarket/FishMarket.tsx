import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingProps } from "../Building";
import { FISH_MARKET_VARIANTS } from "features/island/lib/alternateArt";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { ProcessedFood } from "features/game/types/processedFood";
import { FishMarketModal } from "./FishMarketModal";
import { useProcessingState } from "features/island/buildings/lib/useProcessingState";
import { ReadyProcessed } from "../ReadyProcessed";
import { NPCPlaceable } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";

const _fishMarket = (id: string) => (state: MachineState) =>
  state.context.state.buildings["Fish Market"]?.find((b) => b.id === id);

export const FishMarket: React.FC<BuildingProps> = ({
  buildingId,
  isBuilt,
  season,
}) => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  const fishMarket = useSelector(gameService, _fishMarket(buildingId));
  const { processing, queued, ready } = useProcessingState(fishMarket ?? {});

  const handleProcess = (item: ProcessedFood) => {
    gameService?.send({
      type: "processedFood.processed",
      item,
      buildingId,
      buildingName: "Fish Market",
    });
  };

  const handleCollect = () => {
    gameService?.send({
      type: "processedFood.collected",
      buildingId,
      buildingName: "Fish Market",
    });
  };

  const handleClick = () => {
    if (!isBuilt) return;

    if (!processing && ready.length > 0) {
      handleCollect();
    } else {
      setShowModal(true);
    }
  };

  const handleInstantProcess = () => {
    gameService?.send({
      type: "processing.spedUp",
      buildingId,
      buildingName: "Fish Market",
    });
  };

  return (
    <>
      <BuildingImageWrapper name="Fish Market" onClick={handleClick}>
        <img
          src={FISH_MARKET_VARIANTS[season]}
          className="absolute bottom-0 pointer-events-none"
          style={{ width: `${PIXEL_SCALE * 48}px` }}
        />
        <div
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 11}px`,
            left: `${PIXEL_SCALE * -4}px`,
          }}
        >
          <NPCPlaceable parts={NPC_WEARABLES.neville} />
        </div>
        <ReadyProcessed ready={ready} leftOffset={90} />
      </BuildingImageWrapper>

      <FishMarketModal
        isOpen={showModal}
        buildingId={buildingId}
        onClose={() => setShowModal(false)}
        onProcess={handleProcess}
        onCollect={handleCollect}
        onInstantProcess={handleInstantProcess}
        processing={processing}
        queue={queued ?? []}
        ready={ready}
      />
    </>
  );
};
