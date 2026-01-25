import React, { useContext, useLayoutEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { useNavigate } from "react-router";
import { Context } from "features/game/GameProvider";
import { EXTERIOR_ISLAND_BG } from "features/barn/BarnInside";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { UpgradeBuildingModal } from "features/game/expansion/components/UpgradeBuildingModal";

export const PET_HOUSE_IMAGES: Record<
  number,
  { src: string; height: number; width: number }
> = {
  1: { src: SUNNYSIDE.land.pet_house_inside_one, height: 128, width: 128 },
  2: { src: SUNNYSIDE.land.pet_house_inside_two, height: 160, width: 160 },
  3: { src: SUNNYSIDE.land.pet_house_inside_three, height: 192, width: 192 },
};

const _petHouse = (state: MachineState) => state.context.state.petHouse;

export const PetHouseInside: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [scrollIntoView] = useScrollIntoView();
  const navigate = useNavigate();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const petHouse = useSelector(gameService, _petHouse);
  const level = petHouse.level;
  const nextLevel = Math.min(level + 1, 3);

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  const { src: image, height, width } = PET_HOUSE_IMAGES[level];

  return (
    <>
      <UpgradeBuildingModal
        buildingName="Pet House"
        currentLevel={level}
        nextLevel={nextLevel}
        show={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      <div
        className="absolute bg-[#181425]"
        style={{
          width: `${84 * GRID_WIDTH_PX}px`,
          height: `${56 * GRID_WIDTH_PX}px`,
          imageRendering: "pixelated",
          backgroundImage: `url(${
            EXTERIOR_ISLAND_BG[
              getCurrentBiome(gameService.getSnapshot().context.state.island)
            ]
          })`,
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          backgroundSize: `${96 * PIXEL_SCALE}px ${96 * PIXEL_SCALE}px`,
        }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-full h-full">
            <Button
              className="absolute -bottom-16"
              onClick={() => navigate("/")}
            >
              {t("exit")}
            </Button>

            <img
              src={SUNNYSIDE.icons.upgrade_disc}
              alt="Upgrade Building"
              className="absolute top-[18px] left-[18px] cursor-pointer z-10"
              style={{
                width: `${PIXEL_SCALE * 18}px`,
              }}
              onClick={() => setShowUpgradeModal(true)}
            />

            <img
              src={image}
              id={Section.GenesisBlock}
              className="relative z-0"
              style={{
                width: `${width * PIXEL_SCALE}px`,
                height: `${height * PIXEL_SCALE}px`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
