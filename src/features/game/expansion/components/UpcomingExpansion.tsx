import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import { EXPANSION_ORIGINS, LAND_SIZE } from "../lib/constants";
import { UpcomingExpansionModal } from "./UpcomingExpansionModal";
import { MapPlacement } from "./MapPlacement";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Pontoon } from "./Pontoon";

import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import landComplete from "assets/land/land_complete.png";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useActor } from "@xstate/react";
import { Revealing } from "features/game/components/Revealing";
import { Panel } from "components/ui/Panel";
import { Revealed } from "features/game/components/Revealed";

/**
 * The next piece of land to expand into
 */
export const UpcomingExpansion: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const state = gameState.context.state;
  const [isRevealing, setIsRevealing] = useState(false);

  const [showBumpkinModal, setShowBumpkinModal] = useState(false);

  const latestLand = state.expansions[state.expansions.length - 1];

  useEffect(() => {
    console.log({ isRevealing, state: gameState.value });
    if (isRevealing && gameState.matches("playing")) {
      setIsRevealing(false);
    }
  }, [gameState.value]);

  const onExpand = () => {
    console.log("EXPANDED!");
    gameService.send("land.expanded");
    setShowBumpkinModal(false);
  };

  const onReveal = () => {
    setIsRevealing(true);
    gameService.send("REVEAL", {
      event: {
        type: "land.revealed",
        createdAt: new Date(),
      },
    });
  };

  const Content = () => {
    // Land is still being built
    if (state.inventory["Basic Land"]?.lt(state.expansions.length)) {
      const origin = EXPANSION_ORIGINS[state.expansions.length - 1];

      // Being Built
      if (latestLand.readyAt > Date.now()) {
        return (
          <MapPlacement
            x={origin.x - LAND_SIZE / 2}
            y={origin.y + LAND_SIZE / 2}
            height={LAND_SIZE}
            width={LAND_SIZE}
          >
            <Pontoon expansion={latestLand} />
          </MapPlacement>
        );
      }

      // Ready
      return (
        <MapPlacement
          x={origin.x - LAND_SIZE / 2}
          y={origin.y + LAND_SIZE / 2}
          height={LAND_SIZE}
          width={LAND_SIZE}
        >
          <img
            src={landComplete}
            className="absolute cursor-pointer hover:img-highlight"
            onClick={onReveal}
            style={{
              width: `${PIXEL_SCALE * 66}px`,
              left: `${PIXEL_SCALE * 18}px`,
              bottom: `${PIXEL_SCALE * 12}px`,
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 20}px`,
              left: `${PIXEL_SCALE * 42}px`,
              bottom: `${PIXEL_SCALE * 36}px`,
            }}
          >
            <img src={SUNNYSIDE.icons.disc} className="w-full" />
            <img
              src={SUNNYSIDE.icons.confirm}
              className="absolute"
              style={{
                width: `${PIXEL_SCALE * 12}px`,
                left: `${PIXEL_SCALE * 4}px`,
                bottom: `${PIXEL_SCALE * 5}px`,
              }}
            />
          </div>
        </MapPlacement>
      );
    }

    const nextPosition = EXPANSION_ORIGINS[state.expansions.length];

    return (
      <>
        <MapPlacement
          x={nextPosition.x - LAND_SIZE / 2}
          y={nextPosition.y + LAND_SIZE / 2}
          height={LAND_SIZE}
          width={LAND_SIZE}
        >
          <div className="w-full h-full flex items-center justify-center opacity-90 hover:opacity-100">
            <img
              src={SUNNYSIDE.icons.expand}
              width={18 * PIXEL_SCALE}
              className="relative cursor-pointer hover:img-highlight"
              onClick={() => setShowBumpkinModal(true)}
            />
          </div>
        </MapPlacement>
      </>
    );
  };

  return (
    <>
      <Content />

      {gameState.matches("revealing") && isRevealing && (
        <Modal show centered>
          <CloseButtonPanel>
            <Revealing icon={SUNNYSIDE.npcs.goblin_hammering} />
          </CloseButtonPanel>
        </Modal>
      )}

      {gameState.matches("revealed") && isRevealing && (
        <Modal show centered>
          <Panel>
            <Revealed />
          </Panel>
        </Modal>
      )}

      <Modal
        show={showBumpkinModal}
        onHide={() => setShowBumpkinModal(false)}
        centered
      >
        <CloseButtonPanel
          bumpkinParts={state.bumpkin?.equipped}
          title="Expand your land"
          onClose={() => setShowBumpkinModal(false)}
        >
          <UpcomingExpansionModal
            gameState={state}
            onClose={() => setShowBumpkinModal(false)}
            onExpand={onExpand}
          />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
