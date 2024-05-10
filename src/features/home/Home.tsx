import React, { useContext, useLayoutEffect, useMemo, useState } from "react";

import tent from "assets/land/tent_inside.png";
import house from "assets/land/house_inside.png";
import manor from "assets/land/manor_inside.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Hud } from "features/island/hud/Hud";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import {
  COLLECTIBLES_DIMENSIONS,
  getKeys,
} from "features/game/types/craftables";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Collectible } from "features/island/collectibles/Collectible";
import { getGameGrid } from "features/game/expansion/placeable/lib/makeGrid";
import classNames from "classnames";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Placeable } from "features/game/expansion/placeable/Placeable";
import { LandscapingHud } from "features/island/hud/LandscapingHud";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { BumpkinPainting } from "./components/BumpkinPainting";
import { Bumpkin, IslandType } from "features/game/types/game";
import { HOME_BOUNDS } from "features/game/expansion/placeable/lib/collisionDetection";
import { Bud } from "features/island/buds/Bud";
import { InteriorBumpkins } from "./components/InteriorBumpkins";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const selectGameState = (state: MachineState) => state.context.state;
const isLandscaping = (state: MachineState) => state.matches("landscaping");

const BACKGROUND_IMAGE: Record<IslandType, string> = {
  basic: tent,
  spring: house,
  desert: manor,
};

export const Home: React.FC = () => {
  const { gameService, showTimers } = useContext(Context);

  const { t } = useAppTranslation();

  // memorize game grid and only update it when the stringified value changes

  const state = useSelector(gameService, selectGameState);
  const landscaping = useSelector(gameService, isLandscaping);

  const { bumpkin, home } = state;

  const buds = state.buds ?? {};

  const [scrollIntoView] = useScrollIntoView();
  const [showPainting, setShowPainting] = useState(false);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  const collectibles = home.collectibles;

  const gameGridValue = getGameGrid({
    crops: {},
    collectibles: home.collectibles,
  });
  const gameGrid = useMemo(() => {
    return gameGridValue;
  }, [JSON.stringify(gameGridValue)]);

  const mapPlacements: Array<JSX.Element> = [];

  // TODO OFFset?
  const gameboardDimensions = {
    x: 84,
    y: 56,
  };

  mapPlacements.push(
    ...getKeys(collectibles)
      .filter((name) => collectibles[name])
      .flatMap((name, nameIndex) => {
        const items = collectibles[name]!;
        return items.map((collectible, itemIndex) => {
          const { readyAt, createdAt, coordinates, id } = collectible;
          const { x, y } = coordinates;
          const { width, height } = COLLECTIBLES_DIMENSIONS[name];

          return (
            <MapPlacement
              key={`collectible-${nameIndex}-${itemIndex}`}
              x={x}
              y={y}
              height={height}
              width={width}
              z={name.includes("Rug") ? 0 : 1}
            >
              <Collectible
                location="home"
                name={name}
                id={id}
                readyAt={readyAt}
                createdAt={createdAt}
                showTimers={showTimers}
                x={coordinates.x}
                y={coordinates.y}
                grid={gameGrid}
                game={state}
              />
            </MapPlacement>
          );
        });
      })
  );

  mapPlacements.push(
    ...getKeys(buds)
      .filter(
        (budId) => !!buds[budId].coordinates && buds[budId].location === "home"
      )
      .flatMap((id) => {
        const { x, y } = buds[id]!.coordinates!;

        return (
          <MapPlacement key={`bud-${id}`} x={x} y={y} height={1} width={1}>
            <Bud id={String(id)} x={x} y={y} />
          </MapPlacement>
        );
      })
  );

  const bounds = HOME_BOUNDS[state.island.type];

  return (
    <>
      <>
        <div
          className="absolute bg-[#181425]"
          style={{
            // dynamic gameboard
            width: `${gameboardDimensions.x * GRID_WIDTH_PX}px`,
            height: `${gameboardDimensions.y * GRID_WIDTH_PX}px`,
            imageRendering: "pixelated",
          }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className={classNames("relative w-full h-full")}>
              <div
                className={classNames(
                  `w-full h-full top-0 absolute transition-opacity pointer-events-none z-10`,
                  {
                    "opacity-0": !landscaping,
                    "opacity-100": landscaping,
                  }
                )}
                style={{
                  // Offset the walls
                  marginLeft: `${6 * PIXEL_SCALE}px`,
                  marginTop: `${16 * PIXEL_SCALE}px`,

                  height: `${bounds.width * GRID_WIDTH_PX}px`,
                  width: `${bounds.height * GRID_WIDTH_PX}px`,

                  backgroundSize: `${GRID_WIDTH_PX}px ${GRID_WIDTH_PX}px`,
                  backgroundImage: `
            linear-gradient(to right, rgb(255 255 255 / 17%) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 17%) 1px, transparent 1px)`,
                }}
              />

              {landscaping && <Placeable location="home" />}

              <img
                src={BACKGROUND_IMAGE[state.island.type]}
                id={Section.GenesisBlock}
                className="relative z-0"
                style={{
                  // Grid width + offset walls
                  width: `${bounds.width * GRID_WIDTH_PX + 12 * PIXEL_SCALE}px`,
                  // Grid height + offset walls
                  height: `${
                    bounds.height * GRID_WIDTH_PX + 32 * PIXEL_SCALE
                  }px`,
                }}
              />

              <img
                src={SUNNYSIDE.decorations.painting}
                className="absolute cursor-pointer hover:img-highlight"
                style={{
                  width: `${11 * PIXEL_SCALE}px`,
                  top: `${4 * PIXEL_SCALE}px`,
                  left: `${30 * PIXEL_SCALE}px`,
                }}
                onClick={() => setShowPainting(true)}
              />

              {!landscaping && (
                <>
                  <div className="absolute -top-16 left-0 w-full">
                    <InteriorBumpkins game={state} />
                  </div>
                  <Button
                    className="absolute -bottom-16"
                    onClick={() => navigate("/")}
                  >
                    {t("exit")}
                  </Button>
                </>
              )}

              {/* Sort island elements by y axis */}
              {mapPlacements.sort((a, b) => b.props.y - a.props.y)}
            </div>
          </div>
        </div>

        {!landscaping && <Hud isFarming location="home" />}
        {landscaping && <LandscapingHud location="home" />}

        <Modal show={showPainting} onHide={() => setShowPainting(false)}>
          <BumpkinPainting
            bumpkin={bumpkin as Bumpkin}
            onClose={() => setShowPainting(false)}
          />
        </Modal>
      </>
    </>
  );
};
