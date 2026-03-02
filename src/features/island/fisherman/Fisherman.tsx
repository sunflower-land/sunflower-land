import { useSelector } from "@xstate/react";
import bubbles from "assets/decorations/water_bubbles.png";
import winter_bubbles from "assets/decorations/winter_water_bubbles.png";
import frozen_wharf from "assets/decorations/frozen_wharf.png";
import fishSilhoutte from "assets/decorations/fish_silhouette.png";
import { Context } from "features/game/GameProvider";
import {
  Coordinates,
  MapPlacement,
} from "features/game/expansion/components/MapPlacement";
import { PIXEL_SCALE, GRID_WIDTH_PX } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";
import { FishermanModal } from "./FishermanModal";
import { FishermanNPC } from "./FishermanNPC";
import { InventoryItemName, IslandType } from "features/game/types/game";
import { FishName, FishingBait } from "features/game/types/fishing";
import classNames from "classnames";
import springWharf from "assets/wharf/spring_wharf.png";
import desertWharf from "assets/wharf/desert_wharf.png";
import volcanoWharf from "assets/wharf/volcano_wharf.png";

const expansions = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 3;

const _isVisiting = (state: MachineState) => state.matches("visiting");

const _season = (state: MachineState) => state.context.state.season.season;
const _island = (state: MachineState) => state.context.state.island.type;

const WHARF: Record<Exclude<IslandType, "basic">, string> = {
  volcano: volcanoWharf,
  desert: desertWharf,
  spring: springWharf,
};

export const Fisherman: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService } = useContext(Context);

  const expansionCount = useSelector(gameService, expansions);
  const isVisiting = useSelector(gameService, _isVisiting);
  const season = useSelector(gameService, _season);
  const island = useSelector(gameService, _island);

  const wharfCoords = (): Coordinates => {
    if (expansionCount < 7) {
      return { x: -1, y: -3 };
    }
    if (expansionCount >= 7 && expansionCount < 21) {
      return { x: -8, y: -9 };
    } else {
      return { x: -14, y: -15 };
    }
  };

  const extendedWharfPosition = (): React.CSSProperties | undefined => {
    if (island === "spring") {
      let width = 46;
      let top = 1.52;
      let right = 40;

      if (expansionCount > 10 && expansionCount <= 20) {
        width = 44.476;
        top = 5.71;
        right = 41.52;
      } else if (expansionCount > 20) {
        width = 44.476;
        top = 1.128;
        right = 41.286;
      }

      return {
        width: `${width * PIXEL_SCALE}px`,
        top: `${top * PIXEL_SCALE}px`,
        right: `${right * PIXEL_SCALE}px`,
      };
    }

    if (island === "volcano") {
      const width = 76;
      const top = 24;
      let right = 8.619;

      if (expansionCount > 7) {
        right = 9.76;
      }

      return {
        width: `${width * PIXEL_SCALE}px`,
        top: `${top * PIXEL_SCALE}px`,
        right: `${right * PIXEL_SCALE}px`,
      };
    }

    if (island === "desert") {
      const width = 59.48;
      let top = 1.9;
      let right = 26.255;

      if (expansionCount > 10 && expansionCount <= 20) {
        top = 7.23;
        right = 26.522;
      } else if (expansionCount > 20) {
        top = 1.897;
      }

      return {
        width: `${width * PIXEL_SCALE}px`,
        top: `${top * PIXEL_SCALE}px`,
        right: `${right * PIXEL_SCALE}px`,
      };
    }

    return undefined;
  };

  const bubblePosition = (): React.CSSProperties => {
    let right = 32;
    let bottom = -48;

    if (island === "spring") {
      right = 10;
      bottom = -77;
    }

    if (island === "desert") {
      right = -4;
      bottom = -78;
    }

    if (island === "volcano") {
      right = -23;
      bottom = -93;
    }

    return {
      right: `${right * PIXEL_SCALE}px`,
      bottom: `${bottom * PIXEL_SCALE}px`,
    };
  };

  const cast = (
    bait: FishingBait,
    chum?: InventoryItemName,
    multiplier?: number,
    guaranteedCatch?: FishName,
    reelPacksToBuy?: number,
  ) => {
    gameService.send({
      type: "rod.casted",
      bait,
      chum,
      multiplier,
      guaranteedCatch,
      reelPacksToBuy,
    });
    gameService.send({ type: "SAVE" });
    setShowModal(false);
  };

  return (
    <>
      <div className={classNames({ "pointer-events-none": isVisiting })}>
        <MapPlacement
          {...wharfCoords()}
          width={Math.ceil((76 * PIXEL_SCALE) / GRID_WIDTH_PX)}
          height={1}
        >
          {island !== "basic" && (
            <img
              src={WHARF[island]}
              className="absolute z-0 pointer-events-none"
              style={{
                ...extendedWharfPosition(),
              }}
              alt={`${island} wharf`}
            />
          )}
          <FishermanNPC onClick={() => setShowModal(true)} />
          {season === "winter" ? (
            <div className="relative" style={{ ...bubblePosition() }}>
              <img
                src={frozen_wharf}
                className="absolute z-0 pointer-events-none"
                style={{
                  width: `${57 * PIXEL_SCALE}px`,
                  right: `${-13 * PIXEL_SCALE}px`,
                  bottom: `${-12 * PIXEL_SCALE}px`,
                }}
              />
              <img
                src={winter_bubbles}
                className="absolute z-0 skew-animation pointer-events-none"
                style={{
                  width: `${37 * PIXEL_SCALE}px`,
                  right: `${-6 * PIXEL_SCALE}px`,
                  bottom: `${-7 * PIXEL_SCALE}px`,
                }}
              />
            </div>
          ) : (
            <div className="relative" style={{ ...bubblePosition() }}>
              <img
                src={bubbles}
                className="absolute z-0 skew-animation pointer-events-none"
                style={{
                  width: `${37 * PIXEL_SCALE}px`,
                  right: `${-6 * PIXEL_SCALE}px`,
                  bottom: `${-7 * PIXEL_SCALE}px`,
                }}
              />
              <img
                src={fishSilhoutte}
                className="absolute z-0 fish-swimming pointer-events-none"
                style={{
                  width: `${11 * PIXEL_SCALE}px`,
                  right: `${0 * PIXEL_SCALE}px`,
                  bottom: `${-20 * PIXEL_SCALE}px`,
                }}
              />
            </div>
          )}
        </MapPlacement>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <FishermanModal onCast={cast} onClose={() => setShowModal(false)} />
      </Modal>
    </>
  );
};
