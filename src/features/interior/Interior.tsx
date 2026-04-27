import React, {
  useContext,
  useLayoutEffect,
  useMemo,
  type JSX,
} from "react";
import { useSelector } from "@xstate/react";
import { useNavigate, useSearchParams } from "react-router";
import ScrollContainer from "react-indiana-drag-scroll";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { getKeys, getObjectEntries } from "lib/object";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Collectible } from "features/island/collectibles/Collectible";
import { getGameGrid } from "features/game/expansion/placeable/lib/makeGrid";
import { Placeable } from "features/game/expansion/placeable/Placeable";
import { Hud } from "features/island/hud/Hud";
import { LandscapingHud } from "features/island/hud/LandscapingHud";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { hasFeatureAccess } from "lib/flags";
import { Button } from "components/ui/Button";
import { NON_COLLIDING_OBJECTS } from "features/game/expansion/placeable/lib/collisionDetection";
import { INTERIOR_CANVAS } from "features/game/expansion/placeable/lib/interiorLayouts";
import {
  INTERIOR_BACKGROUNDS,
  INTERIOR_BACKGROUND_NATIVE,
} from "./lib/interiorBackgrounds";
import { InteriorGridOverlay } from "./components/InteriorGridOverlay";
import { UpgradeButton } from "./components/UpgradeButton";
import { Bud } from "features/island/buds/Bud";
import { PetNFT } from "features/island/pets/PetNFT";
import { FarmHand } from "features/island/farmhand/FarmHand";
import { PlacedBumpkin } from "features/island/bumpkin/components/PlacedBumpkin";

const _landscaping = (state: MachineState) => state.matches("landscaping");
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _buds = (state: MachineState) => state.context.state.buds ?? {};
const _petNFTs = (state: MachineState) => state.context.state.pets?.nfts ?? {};
const _island = (state: MachineState) => state.context.state.island;
const _hasInteriorAccess = (state: MachineState) =>
  hasFeatureAccess(state.context.state, "HOME_EXPANSIONS");

const _interiorCollectibles = (state: MachineState) => {
  // Only the ground level is rendered for now. When additional levels are
  // added (upstairs / basement) the active level will be selected here.
  const ground = state.context.state.interior.ground;
  return {
    collectibles: ground.collectibles,
    positions: getObjectEntries(ground.collectibles)
      .flatMap(([name, value]) => value?.map((item) => ({ name, item })))
      .filter(
        (c): c is NonNullable<typeof c> =>
          !!(c && c.item.coordinates !== undefined),
      )
      .map(({ name, item }) => ({
        id: item.id,
        x: item.coordinates!.x,
        y: item.coordinates!.y,
        flipped: item.flipped,
        name,
      })),
  };
};

const _interiorFarmHands = (state: MachineState) => {
  const bumpkins = state.context.state.farmHands.bumpkins;
  return Object.fromEntries(
    Object.entries(bumpkins).filter(
      ([, fh]) => fh.coordinates && fh.location === "interior",
    ),
  );
};

/**
 * The new, isolated interior placement surface — entirely separate from the
 * legacy `home` field. See `interiorLayouts.ts` for the tile-level shape and
 * `placeInteriorItem.ts` / `moveInteriorItem.ts` / `removeInteriorItem.ts` for
 * the reducers.
 *
 * Mounted at /interior.
 */
export const Interior: React.FC = () => {
  const { gameService } = useContext(Context);
  const [params] = useSearchParams();
  const [scrollIntoView] = useScrollIntoView();
  const navigate = useNavigate();

  const landscaping = useSelector(gameService, _landscaping);
  const bumpkin = useSelector(gameService, _bumpkin);
  const buds = useSelector(gameService, _buds);
  const petNFTs = useSelector(gameService, _petNFTs);
  const island = useSelector(gameService, _island);
  const hasAccess = useSelector(gameService, _hasInteriorAccess);

  // Center the canvas in the viewport on mount. GenesisBlock sits at the
  // canvas centre — same anchor MapPlacement uses to render placed items
  // and Placeable uses for its drag-coord origin.
  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Beta-only feature. Render an empty-state with a back-to-mainland button
  // for any player without HOME_EXPANSIONS access.
  if (!hasAccess) {
    return (
      <div className="absolute inset-0 bg-[#181425] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white text-center px-8">
          <p>Home interiors aren&apos;t available yet.</p>
          <p className="text-sm opacity-70">
            This feature is in beta. Check back soon.
          </p>
          <Button onClick={() => navigate("/")}>Back to farm</Button>
        </div>
      </div>
    );
  }
  const interiorFarmHands = useSelector(gameService, _interiorFarmHands);
  const { collectibles, positions: interiorPositions } = useSelector(
    gameService,
    _interiorCollectibles,
  );

  // Dev coord overlay is OFF everywhere by default — including testnet/dev.
  // Append `?debug=1` to the URL on any environment to enable it for tuning.
  const debug = params.get("debug") === "1";

  // Interior doesn't need a game grid since we use INTERIOR_LAYOUTS for validity,
  // but the <Collectible> component accepts a grid prop — pass an empty one.
  const gameGrid = useMemo(
    () => getGameGrid({ cropPositions: [], collectiblePositions: [] }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [interiorPositions],
  );

  const canvasWidthPx = INTERIOR_CANVAS.width * GRID_WIDTH_PX;
  const canvasHeightPx = INTERIOR_CANVAS.height * GRID_WIDTH_PX;

  const mapPlacements: Array<JSX.Element> = [];

  mapPlacements.push(
    ...getKeys(collectibles)
      .filter((name) => collectibles[name])
      .flatMap((name, nameIndex) => {
        const items = collectibles[name]!;
        return items
          .filter((c) => c.coordinates)
          .map((c, itemIndex) => {
            const { x, y } = c.coordinates!;
            const { width, height } = COLLECTIBLES_DIMENSIONS[name];

            return (
              <MapPlacement
                key={`interior-collectible-${nameIndex}-${itemIndex}`}
                x={x}
                y={y}
                height={height}
                width={width}
                z={NON_COLLIDING_OBJECTS.includes(name) ? 0 : 1}
              >
                <Collectible
                  location="interior"
                  name={name}
                  id={c.id}
                  readyAt={c.readyAt ?? 0}
                  createdAt={c.createdAt ?? 0}
                  x={x}
                  y={y}
                  grid={gameGrid}
                  flipped={c.flipped}
                  index={itemIndex}
                />
              </MapPlacement>
            );
          });
      }),
  );

  mapPlacements.push(
    ...Object.entries(buds)
      .filter(([, bud]) => !!bud.coordinates && bud.location === "interior")
      .flatMap(([id, bud]) => {
        const { x, y } = bud.coordinates!;
        return (
          <MapPlacement key={`bud-${id}`} x={x} y={y} height={1} width={1}>
            <Bud id={id} x={x} y={y} />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...Object.entries(petNFTs)
      .filter(
        ([, p]) => !!p.coordinates && p.location === "interior",
      )
      .flatMap(([id, p]) => {
        const { x, y } = p.coordinates!;
        return (
          <MapPlacement key={`petNFT-${id}`} x={x} y={y} height={2} width={2}>
            <PetNFT id={id} x={x} y={y} />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...Object.entries(interiorFarmHands).map(([id, farmHand]) => {
      const { x, y } = farmHand.coordinates!;
      return (
        <MapPlacement key={`farmHand-${id}`} x={x} y={y} height={1} width={1}>
          <FarmHand id={id} location="interior" />
        </MapPlacement>
      );
    }),
  );

  if (bumpkin?.coordinates && bumpkin.location === "interior") {
    const { x, y } = bumpkin.coordinates;
    mapPlacements.push(
      <MapPlacement key="bumpkin" x={x} y={y} height={1} width={1}>
        <PlacedBumpkin location="interior" />
      </MapPlacement>,
    );
  }

  return (
    <>
      {/*
        Same scroll setup /home and the rest of /game/* use:
          ScrollContainer (react-indiana-drag-scroll, click-and-drag panning),
          inside it a huge 84×56-tile gameboard, then the canvas centred via
          left-1/2 top-1/2 -translate. The huge gameboard means the canvas is
          tiny relative to the scrollable area, so scroll never drifts the
          tile grid off Placeable's drag-snap grid.
      */}
      <ScrollContainer
        className="!overflow-scroll relative w-full h-full page-scroll-container overscroll-none"
        ignoreElements={"*[data-prevent-drag-scroll]"}
      >
        <div
          className="absolute bg-[#181425]"
          style={{
            width: `${84 * GRID_WIDTH_PX}px`,
            height: `${56 * GRID_WIDTH_PX}px`,
            imageRendering: "pixelated",
          }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className="relative"
              style={{
                width: `${canvasWidthPx}px`,
                height: `${canvasHeightPx}px`,
              }}
            >
              {/* Bottom-left anchored background. 380x320 native px. */}
              <img
                src={INTERIOR_BACKGROUNDS[island.type]}
                className="absolute"
                style={{
                  left: 0,
                  bottom: 0,
                  width: `${INTERIOR_BACKGROUND_NATIVE.width * PIXEL_SCALE}px`,
                  height: `${INTERIOR_BACKGROUND_NATIVE.height * PIXEL_SCALE}px`,
                  imageRendering: "pixelated",
                }}
              />

              {/*
                Zero-size sentinel at the canvas centre. Placeable anchors
                its drag-coord origin here; MapPlacement renders placed items
                relative to this same point (CSS 50%/50%); scrollIntoView
                brings it into viewport centre on mount.
              */}
              <div
                id={Section.GenesisBlock}
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  width: 0,
                  height: 0,
                }}
              />

              {debug && <InteriorGridOverlay island={island.type} />}

              {landscaping && <Placeable location="interior" />}

              {mapPlacements.sort((a, b) => b.props.y - a.props.y)}

              {/*
                Upgrade button placed on the gameboard at bottom-left tile
                (13, 21). The button self-hides off volcano / when expansion
                is maxed / for non-beta players. Hard-coded for now; can be
                configured later.
                MapPlacement uses canvas-centre origin, so bl(X, Y) → cc(X-12, Y-12).
              */}
              {!landscaping && (
                <MapPlacement key="upgrade-button" x={13 - 12} y={21 - 12}>
                  <UpgradeButton />
                </MapPlacement>
              )}
            </div>
          </div>
        </div>
      </ScrollContainer>

      {!landscaping && <Hud isFarming location="interior" />}
      {landscaping && <LandscapingHud location="interior" />}
    </>
  );
};
