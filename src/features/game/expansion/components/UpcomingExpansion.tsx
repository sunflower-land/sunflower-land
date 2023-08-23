import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";

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
import { Button } from "components/ui/Button";

/**
 * The next piece of land to expand into
 */
export const UpcomingExpansion: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showBumpkinModal, setShowBumpkinModal] = useState(false);

  const state = gameState.context.state;
  const isFullUser = gameState.matches("playingFullGame");

  const playing =
    gameState.matches("playingGuestGame") ||
    gameState.matches("playingFullGame");

  useEffect(() => {
    if (isRevealing && playing) {
      setIsRevealing(false);
    }
  }, [gameState.value]);

  const onExpand = () => {
    gameService.send("land.expanded");
    gameService.send("SAVE");
    setShowBumpkinModal(false);
  };

  const onUpgrade = () => {
    gameService.send("UPGRADE");
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
    useUiRefresher({
      active:
        state.expansionConstruction &&
        state.expansionConstruction?.readyAt > Date.now(),
    });

    // Land is still being built
    if (state.expansionConstruction) {
      const origin =
        EXPANSION_ORIGINS[state.inventory["Basic Land"]?.toNumber() ?? 3];

      // Being Built
      if (state.expansionConstruction.readyAt > Date.now()) {
        return (
          <MapPlacement
            x={origin.x - LAND_SIZE / 2}
            y={origin.y + LAND_SIZE / 2}
            height={LAND_SIZE}
            width={LAND_SIZE}
          >
            <Pontoon expansion={state.expansionConstruction} />
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

    const nextPosition =
      EXPANSION_ORIGINS[state.inventory["Basic Land"]?.toNumber() ?? 0];

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
        {isFullUser && (
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
        )}
        {!isFullUser && (
          <CloseButtonPanel
            bumpkinParts={state.bumpkin?.equipped}
            title={"Ready to expand?"}
            onClose={() => setShowBumpkinModal(false)}
          >
            <>
              <div className="p-2 pt-0 text-sm mb-2 space-y-2">
                <img
                  src={SUNNYSIDE.icons.expand}
                  width={16 * PIXEL_SCALE}
                  className="mx-auto mb-3"
                />

                <p>
                  {`Amazing progress! It looks like you're having a great time working on
            this piece of land. But did you know that you can actually own this
            farm and everything on it?`}
                </p>

                <p>
                  In order to continue your progress you will need to create a
                  full account by setting up a wallet and buying your farm.
                </p>
              </div>
              <Button onClick={onUpgrade}>{`Let's get started!`}</Button>
            </>
          </CloseButtonPanel>
        )}
      </Modal>
    </>
  );
};
