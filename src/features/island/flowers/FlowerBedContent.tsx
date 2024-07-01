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
  FlowerName,
  FlowerSeedName,
} from "features/game/types/flowers";
import { getKeys } from "features/game/types/craftables";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { SquareIcon } from "components/ui/SquareIcon";
import { secondsToString } from "lib/utils/time";
import { getFlowerTime } from "features/game/events/landExpansion/plantFlower";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const isFlower = (name: FlowerCrossBreedName): name is FlowerName =>
  name in FLOWERS;

interface Props {
  id: string;
  onClose: () => void;
}

export const FlowerBedContent: React.FC<Props> = ({ id, onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [
    {
      context: { state, farmId },
    },
  ] = useActor(gameService);
  const { inventory, flowers } = state;

  const [selecting, setSelecting] = useState<"seed" | "crossbreed" | null>(
    "seed",
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

  const seedFlowers = getKeys(FLOWERS).filter(
    (flowerName) => FLOWERS[flowerName].seed === seed,
  );
  const resultFlower =
    crossbreed &&
    seedFlowers.find((seedFlower) =>
      (flowers.discovered[seedFlower] ?? []).includes(crossbreed),
    );

  const hasSeedRequirements = !!(seed && inventory[seed]?.gte(1));

  const hasCrossbreedRequirements = !!(
    crossbreed &&
    inventory[crossbreed]?.gte(FLOWER_CROSS_BREED_AMOUNTS[crossbreed])
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
            <span className="text-xs">
              {t("flowerBedContent.select.combination")}
            </span>
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
              {},
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
              <div className="h-full w-full flex justify-center items-center">
                <SquareIcon
                  icon={ITEM_DETAILS[seed].image}
                  width={14}
                  className="mb-1"
                />
              </div>
            )}
            {selecting === "seed" && (
              <img
                src={SUNNYSIDE.ui.select_box}
                className="w-full absolute inset-0 -top-1"
              />
            )}
          </div>

          <div
            className="absolute z-40 cursor-pointer bg-green-800 border-t-4 border-green-900 rounded-md"
            onClick={() => setSelecting("crossbreed")}
            style={{
              height: `${PIXEL_SCALE * 16}px`,
              width: `${PIXEL_SCALE * 16}px`,
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 12}px`,
            }}
          >
            {crossbreed && (
              <div className="h-full w-full flex justify-center items-center">
                <SquareIcon
                  icon={ITEM_DETAILS[crossbreed].image}
                  width={9}
                  className="mb-1"
                />
              </div>
            )}
            {selecting === "crossbreed" && (
              <img
                src={SUNNYSIDE.ui.select_box}
                className="w-full  absolute inset-0 -top-1"
              />
            )}
          </div>
        </div>

        {selecting === "seed" && (
          <>
            <Label type="default" className="mb-1">
              {t("flowerBedContent.select.seed")}
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
            {seed && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <Label type="default" icon={ITEM_DETAILS[seed].image}>
                    {seed}
                  </Label>
                  {hasSeedRequirements ? (
                    <Label type={"info"} icon={SUNNYSIDE.icons.stopwatch}>
                      {secondsToString(
                        getFlowerTime(seed, gameService.state.context.state),
                        {
                          length: "medium",
                        },
                      )}
                    </Label>
                  ) : (
                    <Label type={"danger"}>{`1 ${seed} required`}</Label>
                  )}
                </div>
                <p className="text-xs">{FLOWER_SEEDS()[seed].description}</p>
              </div>
            )}
          </>
        )}

        {selecting === "crossbreed" && (
          <>
            <Label type="default" className="mb-1">
              {t("flowerBedContent.select.crossbreed")}
            </Label>
            <div className="flex flex-wrap mb-2">
              {getKeys(FLOWER_CROSS_BREED_AMOUNTS)
                .filter(
                  (name) =>
                    !isFlower(name) ||
                    !!state.farmActivity[`${name} Harvested`] ||
                    !!state.inventory[name],
                )
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
            {crossbreed && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label type="default" icon={ITEM_DETAILS[crossbreed].image}>
                    {crossbreed}
                  </Label>
                  <Label
                    type={!hasCrossbreedRequirements ? "danger" : "default"}
                  >{`${FLOWER_CROSS_BREED_AMOUNTS[crossbreed]} ${crossbreed} required`}</Label>
                </div>
                <p className="text-xs mt-1">
                  {FLOWER_CROSS_BREED_DETAILS[crossbreed]}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <Button
        disabled={
          !seed ||
          !crossbreed ||
          !hasCrossbreedRequirements ||
          !hasSeedRequirements
        }
        onClick={() => plant()}
      >
        {t("plant")} {resultFlower ?? "Flower"}
      </Button>
    </>
  );
};
