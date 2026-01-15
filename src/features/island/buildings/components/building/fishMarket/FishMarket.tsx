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
import { ITEM_DETAILS } from "features/game/types/images";
import classNames from "classnames";
import { setImageWidth } from "lib/images";
import { SUNNYSIDE } from "assets/sunnyside";

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
      type: "processedResource.processed",
      item,
      buildingId,
      buildingName: "Fish Market",
    });
  };

  const handleCollect = () => {
    gameService?.send({
      type: "processedResource.collected",
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
        {processing && (
          <div className="absolute flex items-center justify-bottom w-[36px] h-5 left-0 bottom-2">
            <img
              src={ITEM_DETAILS[processing.name].image}
              className={classNames("absolute z-30 pointer-events-none")}
              onLoad={(e) => {
                const img = e.currentTarget;
                if (
                  !img ||
                  !img.complete ||
                  !img.naturalWidth ||
                  !img.naturalHeight
                ) {
                  return;
                }

                setImageWidth(img);
              }}
              style={{
                scale: 0.8,
                opacity: 0,
                bottom: 0,
              }}
            />
          </div>
        )}

        {processing ? (
          <img
            src={SUNNYSIDE.npcs.fishMarket_npc_doing}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 16 * 1.25}px`,
              top: `${PIXEL_SCALE * 17}px`,
              left: `${PIXEL_SCALE * -4}px`,
            }}
          />
        ) : (
          <div
            className="absolute"
            style={{
              top: `${PIXEL_SCALE * 11}px`,
              left: `${PIXEL_SCALE * -4}px`,
            }}
          >
            <NPCPlaceable parts={NPC_WEARABLES.neville} />
          </div>
        )}

        <ReadyProcessed ready={ready} leftOffset={40} />
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
