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
import { NON_COLLIDING_OBJECTS } from "features/game/expansion/placeable/lib/collisionDetection";
import { INTERIOR_CANVAS } from "features/game/expansion/placeable/lib/interiorLayouts";
import {
  HOME_EXPANSION_BACKGROUNDS,
  HOME_EXPANSION_BACKGROUND_NATIVE,
} from "./lib/interiorBackgrounds";
import { LevelOneGridOverlay } from "./components/LevelOneGridOverlay";
import { UpgradeButton } from "./components/UpgradeButton";
import { Bud } from "features/island/buds/Bud";
import { PetNFT } from "features/island/pets/PetNFT";
import { FarmHand } from "features/island/farmhand/FarmHand";
import { PlacedBumpkin } from "features/island/bumpkin/components/PlacedBumpkin";
import { Button } from "components/ui/Button";
import { Collectibles } from "features/game/types/game";

const _landscaping = (state: MachineState) => state.matches("landscaping");
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _buds = (state: MachineState) => state.context.state.buds ?? {};
const _petNFTs = (state: MachineState) => state.context.state.pets?.nfts ?? {};
const _levelOne = (state: MachineState) =>
  state.context.state.interior.level_one;
const _expansion = (state: MachineState) =>
  state.context.state.interior.expansion;
const _hasInteriorAccess = (state: MachineState) =>
  hasFeatureAccess(state.context.state, "HOME_EXPANSIONS");

const EMPTY_COLLECTIBLES: Collectibles = {};

const _levelOneCollectibles = (
  state: MachineState,
): {
  collectibles: Collectibles;
  positions: Array<{
    id: string;
    x: number;
    y: number;
    flipped?: boolean;
    name: string;
  }>;
} => {
  const lo = state.context.state.interior.level_one;
  if (!lo) return { collectibles: EMPTY_COLLECTIBLES, positions: [] };
  return {
    collectibles: lo.collectibles,
    positions: getObjectEntries(lo.collectibles)
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
        name: String(name),
      })),
  };
};

const _levelOneFarmHands = (state: MachineState) => {
  const bumpkins = state.context.state.farmHands.bumpkins;
  return Object.fromEntries(
    Object.entries(bumpkins).filter(
      ([, fh]) => fh.coordinates && fh.location === "level_one",
    ),
  );
};

/**
 * Post-volcano "level_one" floor. Mounted at /level_one.
 *
 * Distinct from /interior — placements live in `state.interior.level_one`,
 * the visible layout switches per `state.interior.expansion`, and the player
 * must have paid for at least the first upgrade (`interior.upgrade`) for
 * this route to have anything to render.
 */
export const LevelOne: React.FC = () => {
  const { gameService } = useContext(Context);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [scrollIntoView] = useScrollIntoView();

  const landscaping = useSelector(gameService, _landscaping);
  const bumpkin = useSelector(gameService, _bumpkin);
  const buds = useSelector(gameService, _buds);
  const petNFTs = useSelector(gameService, _petNFTs);
  const levelOne = useSelector(gameService, _levelOne);
  const expansion = useSelector(gameService, _expansion);
  const hasAccess = useSelector(gameService, _hasInteriorAccess);
  const levelOneFarmHands = useSelector(gameService, _levelOneFarmHands);
  const { collectibles, positions: levelOnePositions } = useSelector(
    gameService,
    _levelOneCollectibles,
  );

  // Dev grid overlay OFF everywhere by default; `?debug=1` enables for tuning.
  const debug = params.get("debug") === "1";

  // GenesisBlock stays at canvas-centre — auto-scroll brings it into the
  // viewport centre on mount. Per-tier centring would require translating
  // MapPlacement's render origin too, which we're not doing.
  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gameGrid = useMemo(
    () => getGameGrid({ cropPositions: [], collectiblePositions: [] }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [levelOnePositions],
  );

  const canvasWidthPx = INTERIOR_CANVAS.width * GRID_WIDTH_PX;
  const canvasHeightPx = INTERIOR_CANVAS.height * GRID_WIDTH_PX;

  // Beta-only feature.
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

  // If the player hasn't bought their first upgrade yet, render an empty-state
  // pointing them back to /interior to upgrade.
  if (!levelOne || !expansion) {
    return (
      <div className="absolute inset-0 bg-[#181425] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white text-center px-8">
          <p>You haven&apos;t unlocked level one yet.</p>
          <p className="text-sm opacity-70">
            Visit your interior on volcano island to buy the first upgrade.
          </p>
          <Button onClick={() => navigate("/interior")}>Go to interior</Button>
        </div>
      </div>
    );
  }

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
                key={`level_one-collectible-${nameIndex}-${itemIndex}`}
                x={x}
                y={y}
                height={height}
                width={width}
                z={NON_COLLIDING_OBJECTS.includes(name) ? 0 : 1}
              >
                <Collectible
                  location="level_one"
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
      .filter(([, bud]) => !!bud.coordinates && bud.location === "level_one")
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
      .filter(([, p]) => !!p.coordinates && p.location === "level_one")
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
    ...Object.entries(levelOneFarmHands).map(([id, farmHand]) => {
      const { x, y } = farmHand.coordinates!;
      return (
        <MapPlacement key={`farmHand-${id}`} x={x} y={y} height={1} width={1}>
          <FarmHand id={id} location="level_one" />
        </MapPlacement>
      );
    }),
  );

  if (bumpkin?.coordinates && bumpkin.location === "level_one") {
    const { x, y } = bumpkin.coordinates;
    mapPlacements.push(
      <MapPlacement key="bumpkin" x={x} y={y} height={1} width={1}>
        <PlacedBumpkin location="level_one" />
      </MapPlacement>,
    );
  }

  return (
    <>
      {/* Same scroll setup as /home — see Interior.tsx for the rationale. */}
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
              {/* Bottom-left anchored background per active expansion tier. */}
              <img
                src={HOME_EXPANSION_BACKGROUNDS[expansion]}
                className="absolute"
                style={{
                  left: 0,
                  bottom: 0,
                  width: `${HOME_EXPANSION_BACKGROUND_NATIVE.width * PIXEL_SCALE}px`,
                  height: `${HOME_EXPANSION_BACKGROUND_NATIVE.height * PIXEL_SCALE}px`,
                  imageRendering: "pixelated",
                }}
              />

              <div
                id={Section.GenesisBlock}
                className="absolute"
                style={{ left: "50%", top: "50%", width: 0, height: 0 }}
              />

              {debug && <LevelOneGridOverlay tier={expansion} />}

              {landscaping && <Placeable location="level_one" />}

              {mapPlacements.sort((a, b) => b.props.y - a.props.y)}

              {/*
                In-world Upgrade button at bl tile (13, 21). Per-tier overrides
                go here later.
                MapPlacement uses canvas-centre origin: bl(X, Y) → cc(X-12, Y-12).
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

      {!landscaping && <Hud isFarming location="level_one" />}
      {landscaping && <LandscapingHud location="level_one" />}
    </>
  );
};
