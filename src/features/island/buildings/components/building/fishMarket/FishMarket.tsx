import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingProps } from "../Building";
import { MARKET_VARIANTS } from "features/island/lib/alternateArt";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { ProcessedFood } from "features/game/types/processedFood";
import { FishMarketModal } from "./FishMarketModal";
import { useProcessingState } from "features/island/buildings/lib/useProcessingState";
import { ReadyProcessed } from "../ReadyProcessed";

const _fishMarket = (id: string) => (state: MachineState) =>
  state.context.state.buildings["Fish Market"]?.find((b) => b.id === id);

export const FishMarket: React.FC<BuildingProps> = ({
  buildingId,
  isBuilt,
  island,
  season,
}) => {
  const biome = getCurrentBiome(island);
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
          src={MARKET_VARIANTS[biome][season]}
          className="absolute bottom-0 pointer-events-none"
          style={{ width: `${PIXEL_SCALE * 48}px` }}
        />
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
