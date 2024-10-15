import React, { useContext, useLayoutEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { useNavigate } from "react-router-dom";
import { Hud } from "features/island/hud/Hud";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/decorations";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { ANIMALS, AnimalType } from "features/game/types/animals";
import { Cow } from "./components/Cow";
import { Sheep } from "./components/Sheep";

import shopDisc from "assets/icons/shop_disc.png";
import { AnimalBuildingModal } from "features/game/expansion/components/animals/AnimalBuildingModal";
import { FeederMachine } from "features/feederMachine/FeederMachine";

const background = SUNNYSIDE.land.tent_inside;

const _barn = (state: MachineState) => state.context.state.barn;

type BarnAnimal = Exclude<AnimalType, "Chicken">;

const BARN_ANIMAL_COMPONENTS: Record<BarnAnimal, React.FC<{ id: string }>> = {
  Cow: Cow,
  Sheep: Sheep,
};

export const BarnInside: React.FC = () => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const barn = useSelector(gameService, _barn);

  const [scrollIntoView] = useScrollIntoView();
  const navigate = useNavigate();

  const { t } = useAppTranslation();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  const mapPlacements: Array<JSX.Element> = [];

  const components = getKeys(barn.animals).map((id) => {
    const animal = barn.animals[id];
    const Component = BARN_ANIMAL_COMPONENTS[animal.type as BarnAnimal];

    return (
      <MapPlacement
        key={`${animal.type.toLowerCase()}-${id}`}
        x={animal.coordinates.x}
        y={animal.coordinates.y}
        height={ANIMALS.Chicken.height}
        width={ANIMALS.Chicken.width}
        z={1}
      >
        <Component id={id} />
      </MapPlacement>
    );
  });

  mapPlacements.push(...components);

  return (
    <>
      <AnimalBuildingModal
        buildingName="Barn"
        show={showModal}
        onClose={() => setShowModal(false)}
      />
      <>
        <div
          className="absolute bg-[#181425]"
          style={{
            width: `${84 * GRID_WIDTH_PX}px`,
            height: `${56 * GRID_WIDTH_PX}px`,
            imageRendering: "pixelated",
          }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-full h-full">
              <img
                src={shopDisc}
                alt="Buy Animals"
                className="absolute top-7 right-8 cursor-pointer z-10"
                style={{
                  width: `${PIXEL_SCALE * 18}px`,
                }}
                onClick={() => setShowModal(true)}
              />
              <img
                src={background}
                id={Section.GenesisBlock}
                className="relative z-0"
                style={{
                  width: `${176 * PIXEL_SCALE}px`,
                  height: `${192 * PIXEL_SCALE}px`,
                }}
              />

              <div
                className="absolute"
                style={{
                  left: `${10 * PIXEL_SCALE}px`,
                  top: `${0 * PIXEL_SCALE}px`,
                  width: `${30 * PIXEL_SCALE}px`,
                }}
              >
                <FeederMachine />
              </div>

              {mapPlacements.sort((a, b) => a.props.y - b.props.y)}
              <div
                className="absolute"
                style={{
                  width: `${176 * PIXEL_SCALE}px`,
                  height: `${192 * PIXEL_SCALE}px`,
                }}
              >
                {/* {makeGridOverlay()} */}
              </div>

              <Button
                className="absolute -bottom-16"
                onClick={() => navigate("/")}
              >
                {t("exit")}
              </Button>
            </div>
          </div>
        </div>
      </>

      <Hud isFarming={false} location="home" />
    </>
  );
};
