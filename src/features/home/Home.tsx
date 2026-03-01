import React, {
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type JSX,
} from "react";

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
import { useNavigate } from "react-router";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { BumpkinPainting } from "./components/BumpkinPainting";
import { Bumpkin, IslandType } from "features/game/types/game";
import {
  HOME_BOUNDS,
  NON_COLLIDING_OBJECTS,
} from "features/game/expansion/placeable/lib/collisionDetection";
import { Bud } from "features/island/buds/Bud";
import { InteriorBumpkins } from "./components/InteriorBumpkins";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { EXTERIOR_ISLAND_BG } from "features/barn/BarnInside";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { useVisiting } from "lib/utils/visitUtils";
import { VisitingHud } from "features/island/hud/VisitingHud";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { PlayerModal } from "features/social/PlayerModal";
import { hasFeatureAccess } from "lib/flags";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { PetNFT } from "features/island/pets/PetNFT";
import { FarmHand } from "features/island/farmhand/FarmHand";

const BACKGROUND_IMAGE: Record<IslandType, string> = {
  basic: SUNNYSIDE.land.tent_inside,
  spring: SUNNYSIDE.land.house_inside,
  desert: SUNNYSIDE.land.manor_inside,
  volcano: SUNNYSIDE.land.mansion_inside,
};

function hasReadIntro() {
  return !!localStorage.getItem("home.intro");
}

function acknowledgeIntro() {
  return localStorage.setItem("home.intro", new Date().toISOString());
}

const _landscaping = (state: MachineState) => state.matches("landscaping");
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _buds = (state: MachineState) => state.context.state.buds ?? {};
const _petNFTs = (state: MachineState) => state.context.state.pets?.nfts ?? {};
const _island = (state: MachineState) => state.context.state.island;
const _homeCollectiblePositions = (state: MachineState) => {
  return {
    collectibles: state.context.state.home.collectibles,
    positions: getObjectEntries(state.context.state.home.collectibles)
      .flatMap(([name, value]) => value?.map((item) => ({ name, item })))
      .filter(
        (collectible): collectible is NonNullable<typeof collectible> =>
          !!(collectible && collectible.item.coordinates !== undefined),
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
const _homeFarmHands = (state: MachineState) => {
  const bumpkins = state.context.state.farmHands.bumpkins;
  return Object.fromEntries(
    Object.entries(bumpkins).filter(
      ([, fh]) => fh.coordinates && fh.location === "home",
    ),
  );
};
const _token = (state: AuthMachineState) => state.context.user.rawToken ?? "";

export const Home: React.FC = () => {
  const { isVisiting } = useVisiting();
  const [showIntro, setShowIntro] = useState(!hasReadIntro() && !isVisiting);

  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);

  const { t } = useAppTranslation();

  const context = gameService.getSnapshot().context;
  const loggedInFarmId = context.visitorId ?? context.farmId;

  const hasAirdropAccess = hasFeatureAccess(
    context.visitorState ?? context.state,
    "AIRDROP_PLAYER",
  );

  // memorize game grid and only update it when the stringified value changes

  const landscaping = useSelector(gameService, _landscaping);
  const bumpkin = useSelector(gameService, _bumpkin);
  const buds = useSelector(gameService, _buds);
  const petNFTs = useSelector(gameService, _petNFTs);
  const island = useSelector(gameService, _island);
  const homeFarmHands = useSelector(gameService, _homeFarmHands);
  const { collectibles, positions: homeCollectiblePositions } = useSelector(
    gameService,
    _homeCollectiblePositions,
  );
  const token = useSelector(authService, _token);

  const [scrollIntoView] = useScrollIntoView();
  const [showPainting, setShowPainting] = useState(false);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  const gameGridValue = getGameGrid({
    cropPositions: [],
    collectiblePositions: [],
  });
  const gameGrid = useMemo(() => {
    return gameGridValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeCollectiblePositions]);

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
        return items
          .filter((collectible) => collectible.coordinates)
          .map((collectible, itemIndex) => {
            const { readyAt, createdAt, coordinates, id } = collectible;
            const { x, y } = coordinates!;
            const { width, height } = COLLECTIBLES_DIMENSIONS[name];

            return (
              <MapPlacement
                key={`collectible-${nameIndex}-${itemIndex}`}
                x={x}
                y={y}
                height={height}
                width={width}
                z={NON_COLLIDING_OBJECTS.includes(name) ? 0 : 1}
                enableOnVisitClick
              >
                <Collectible
                  location="home"
                  name={name}
                  id={id}
                  readyAt={readyAt ?? 0}
                  createdAt={createdAt ?? 0}
                  x={coordinates!.x}
                  y={coordinates!.y}
                  grid={gameGrid}
                  flipped={collectible.flipped}
                  index={itemIndex}
                />
              </MapPlacement>
            );
          });
      }),
  );

  mapPlacements.push(
    ...Object.entries(buds)
      .filter(([, bud]) => !!bud.coordinates && bud.location === "home")
      .flatMap(([id, bud]) => {
        const { x, y } = bud.coordinates!;

        return (
          <MapPlacement
            key={`bud-${id}`}
            x={x}
            y={y}
            height={1}
            width={1}
            enableOnVisitClick
          >
            <Bud id={id} x={x} y={y} />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...Object.entries(petNFTs)
      .filter(
        ([, petNFT]) => !!petNFT.coordinates && petNFT.location === "home",
      )
      .flatMap(([id, petNFT]) => {
        const { x, y } = petNFT.coordinates!;

        return (
          <MapPlacement
            key={`petNFT-${id}`}
            x={x}
            y={y}
            height={2}
            width={2}
            enableOnVisitClick
          >
            <PetNFT id={id} x={x} y={y} />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...Object.entries(homeFarmHands).map(([id, farmHand]) => {
      const { x, y } = farmHand.coordinates!;
      return (
        <MapPlacement key={`farmHand-${id}`} x={x} y={y} height={1} width={1}>
          <FarmHand id={id} location="home" />
        </MapPlacement>
      );
    }),
  );

  const bounds = HOME_BOUNDS[island.type];
  const currentBiome = getCurrentBiome(island);

  return (
    <>
      <>
        <Modal show={showIntro}>
          <SpeakingModal
            bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
            message={[
              {
                text: t("home-intro.one"),
              },
              {
                text: t("home-intro.two"),
              },
              {
                text: t("home-intro.three"),
              },
            ]}
            onClose={() => {
              setShowIntro(false);
              acknowledgeIntro();
            }}
          />
        </Modal>
        <div
          className="absolute bg-[#181425]"
          style={{
            // dynamic gameboard
            width: `${gameboardDimensions.x * GRID_WIDTH_PX}px`,
            height: `${gameboardDimensions.y * GRID_WIDTH_PX}px`,
            imageRendering: "pixelated",
            backgroundImage: `url(${EXTERIOR_ISLAND_BG[currentBiome]})`,
            backgroundRepeat: "repeat",
            backgroundPosition: "center",
            backgroundSize: `${96 * PIXEL_SCALE}px ${96 * PIXEL_SCALE}px`,
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
                  },
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
                src={BACKGROUND_IMAGE[island.type]}
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

              {!isVisiting && (
                <div className="absolute -top-16 left-0 w-full">
                  <InteriorBumpkins />
                </div>
              )}
              {!landscaping && (
                <Button
                  className="absolute -bottom-16"
                  onClick={() =>
                    navigate(
                      isVisiting
                        ? `/visit/${gameService.getSnapshot().context.farmId}`
                        : "/",
                    )
                  }
                >
                  {t("exit")}
                </Button>
              )}

              {/* Sort island elements by y axis */}
              {mapPlacements.sort((a, b) => b.props.y - a.props.y)}
            </div>
          </div>
        </div>

        {!landscaping && !isVisiting && <Hud isFarming location="home" />}
        {landscaping && <LandscapingHud location="home" />}
        {isVisiting && <VisitingHud />}

        <Modal show={showPainting} onHide={() => setShowPainting(false)}>
          <BumpkinPainting
            bumpkin={bumpkin as Bumpkin}
            onClose={() => setShowPainting(false)}
          />
        </Modal>
        <PlayerModal
          loggedInFarmId={loggedInFarmId}
          token={token}
          hasAirdropAccess={hasAirdropAccess}
        />
      </>
    </>
  );
};
