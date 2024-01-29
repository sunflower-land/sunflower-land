import React, { useContext, useState } from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import flowerBed from "assets/flowers/flower_bed_modal.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import {
  FLOWERS,
  FLOWER_CROSS_BREED_AMOUNTS,
  FLOWER_CROSS_BREED_DETAILS,
  FLOWER_SEEDS,
  FlowerCrossBreedName,
  FlowerSeedName,
} from "features/game/types/flowers";
import { getKeys } from "features/game/types/craftables";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { hasFeatureAccess } from "lib/flags";
import { SquareIcon } from "components/ui/SquareIcon";
import { secondsToString } from "lib/utils/time";

interface Props {
  id: string;
  onClose: () => void;
}

export const FlowerBedContent: React.FC<Props> = ({ id, onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { inventory, flowers } = state;

  const [selecting, setSelecting] = useState<"seed" | "crossbreed" | null>(
    "seed"
  );
  const [seed, setSeed] = useState<FlowerSeedName>();
  const [crossbreed, setCrossBreed] = useState<FlowerCrossBreedName>();

  const selectSeed = (name: FlowerSeedName) => {
    setSeed(name);
    if (!crossbreed) setSelecting("crossbreed");
  };

  const selectCrossBreed = (name: FlowerCrossBreedName) => {
    setCrossBreed(name);
    if (!seed) setSelecting("seed");
  };

  const plant = () => {
    gameService.send({
      type: "flower.planted",
      id,
      seed: seed as FlowerSeedName,
      crossbreed: crossbreed as FlowerCrossBreedName,
    });
    onClose();
  };

  if (!hasFeatureAccess(state, "FLOWERS")) {
    return (
      <div className="p-2">
        <Label type="danger">Flowers are coming soon!</Label>
      </div>
    );
  }
  const seedFlowers = getKeys(FLOWERS).filter(
    (flowerName) => FLOWERS[flowerName].seed === seed
  );
  const resultFlower =
    crossbreed &&
    seedFlowers.find((seedFlower) =>
      (flowers.discovered[seedFlower] ?? []).includes(crossbreed)
    );

  const hasRequirements = !!(
    crossbreed &&
    inventory[crossbreed]?.gt(FLOWER_CROSS_BREED_AMOUNTS[crossbreed])
  );

  return (
    <>
      <div className="p-2">
        {seed && crossbreed && (
          <div className="flex items-center justify-center">
            <img
              src={
                resultFlower
                  ? ITEM_DETAILS[resultFlower].image
                  : SUNNYSIDE.icons.search
              }
              className="h-4 mr-1"
            />
            <span className="text-xs">
              {resultFlower ?? "Unknown combination"}
            </span>
          </div>
        )}
        {!(seed && crossbreed) && (
          <div className="flex items-center justify-center">
            <img
              src={SUNNYSIDE.icons.expression_confused}
              className="h-4 mr-1"
            />
            <span className="text-xs">Select your combination</span>
          </div>
        )}

        <div
          className="relative mx-auto w-full mt-2"
          style={{
            width: `${PIXEL_SCALE * 80}px`,
          }}
        >
          <img src={flowerBed} className="w-full" />

          <div
            className={classNames(
              "absolute z-40 cursor-pointer bg-green-800 border-t-4 border-green-900 rounded-md",
              {}
            )}
            onClick={() => setSelecting("seed")}
            style={{
              height: `${PIXEL_SCALE * 16}px`,
              width: `${PIXEL_SCALE * 16}px`,
              top: `${PIXEL_SCALE * 6}px`,
              left: `${PIXEL_SCALE * 12}px`,
            }}
          >
            {seed && (
              <SquareIcon
                icon={ITEM_DETAILS[seed].image}
                width={14}
                className={"h-full absolute inset-0 -top-1 mx-auto"}
              />
            )}
            {selecting === "seed" && (
              <img
                src={SUNNYSIDE.ui.select_box}
                className="w-full absolute inset-0 -top-1"
              />
            )}
          </div>

          <div
            className={classNames(
              "absolute  z-40 cursor-pointer bg-green-800 border-t-4 border-green-900 rounded-md",
              {}
            )}
            onClick={() => setSelecting("crossbreed")}
            style={{
              height: `${PIXEL_SCALE * 16}px`,
              width: `${PIXEL_SCALE * 16}px`,
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 12}px`,
            }}
          >
            {crossbreed && (
              <SquareIcon
                icon={ITEM_DETAILS[crossbreed].image}
                width={14}
                className={"h-full absolute inset-0 -top-1 mx-auto"}
              />
            )}
            {selecting === "crossbreed" && (
              <img
                src={SUNNYSIDE.ui.select_box}
                className="w-full  absolute inset-0 -top-1"
              />
            )}
          </div>
        </div>

        <div className="grid">
          <div
            className={classNames("row-start-1 col-start-1", {
              invisible: !(selecting === "seed"),
            })}
          >
            <Label type="default" className="mb-1">
              Select a seed
            </Label>
            <div className="flex flex-wrap">
              {getKeys(FLOWER_SEEDS()).map((name) => (
                <Box
                  image={ITEM_DETAILS[name].image}
                  count={inventory[name]}
                  onClick={() => selectSeed(name)}
                  key={name}
                  isSelected={seed === name}
                />
              ))}
            </div>
          </div>
          {selecting === "seed" && seed && (
            <div className="p-2">
              <div className="flex justify-between items-center">
                <Label
                  type="default"
                  className="mb-1"
                  icon={ITEM_DETAILS[seed].image}
                >
                  {seed}
                </Label>
                <Label
                  type={"info"}
                  className="mt-1"
                  icon={SUNNYSIDE.icons.stopwatch}
                >
                  {secondsToString(FLOWER_SEEDS()[seed].plantSeconds, {
                    length: "medium",
                  })}
                </Label>
              </div>
              <p className="text-xs">{FLOWER_SEEDS()[seed].description}</p>
            </div>
          )}

          <div
            className={classNames("row-start-1 col-start-1", {
              invisible: !(selecting === "crossbreed"),
            })}
          >
            <Label type="default" className="mb-1">
              Select a crossbreed
            </Label>
            <div className="flex flex-wrap">
              {getKeys(FLOWER_CROSS_BREED_AMOUNTS)
                // .filter((name) => !!inventory[name]?.gte(1))
                .map((name) => (
                  <Box
                    image={ITEM_DETAILS[name].image}
                    count={inventory[name]}
                    onClick={() => selectCrossBreed(name)}
                    key={name}
                    isSelected={crossbreed === name}
                  />
                ))}
            </div>
          </div>
          {selecting === "crossbreed" && crossbreed && (
            <div className="p-2">
              <div className="flex justify-between items-center">
                <Label
                  type="default"
                  className="mb-1"
                  icon={ITEM_DETAILS[crossbreed].image}
                >
                  {crossbreed}
                </Label>
                <Label
                  type={!hasRequirements ? "danger" : "default"}
                  className="mt-1"
                >{`${FLOWER_CROSS_BREED_AMOUNTS[crossbreed]} ${crossbreed} required`}</Label>
              </div>
              <p className="text-xs">
                {FLOWER_CROSS_BREED_DETAILS[crossbreed]}
              </p>
            </div>
          )}
        </div>
      </div>

      <Button
        disabled={!seed || !crossbreed || !hasRequirements}
        onClick={() => plant()}
      >
        Plant {resultFlower ?? "Flower"}
      </Button>
    </>
  );
};
