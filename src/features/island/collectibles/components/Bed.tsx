import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { getKeys } from "features/game/types/decorations";
import { BedName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface BedProps {
  name: BedName;
}

const BED_WIDTH: Record<BedName, number> = {
  "Basic Bed": 16,
  "Floral Bed": 16,
  "Fisher Bed": 20,
  "Cow Bed": 22,
  "Sturdy Bed": 18,
  "Pirate Bed": 16,
  "Desert Bed": 16,
  "Royal Bed": 16,
};

const BED_FARMHAND_COUNT: Record<BedName, number> = {
  "Basic Bed": 0,
  "Fisher Bed": 1,
  "Floral Bed": 2,
  "Sturdy Bed": 3,
  "Desert Bed": 4,
  "Cow Bed": 5,
  "Pirate Bed": 6,
  "Royal Bed": 7,
};

const _farmhands = (state: MachineState) =>
  state.context.state.farmHands.bumpkins;
const _collectibles = (state: MachineState) => state.context.state.collectibles;
const _homeCollectibles = (state: MachineState) =>
  state.context.state.home.collectibles;

export const Bed: React.FC<BedProps> = ({ name }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const [showModal, setShowModal] = useState(false);

  const farmhands = useSelector(gameService, _farmhands);
  const collectibles = useSelector(gameService, _collectibles);
  const homeCollectibles = useSelector(gameService, _homeCollectibles);

  // The main bumpkin + the farmhands that are already on the bed
  const bumpkinCount = getKeys(farmhands).length + 1;
  const uniqueBedCollectibles = getKeys(collectibles)
    .filter((collectible) => collectible in BED_FARMHAND_COUNT)
    .filter((collectible) => (collectibles[collectible]?.length ?? 0) > 0);
  const uniqueHomeBedCollectibles = getKeys(homeCollectibles)
    .filter((collectible) => collectible in BED_FARMHAND_COUNT)
    .filter((collectible) => (homeCollectibles[collectible]?.length ?? 0) > 0);
  const uniqueBedCount = new Set([
    ...uniqueBedCollectibles,
    ...uniqueHomeBedCollectibles,
  ]).size;

  const canSleepHere =
    bumpkinCount < uniqueBedCount && BED_FARMHAND_COUNT[name] > bumpkinCount;

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          onClose={() => setShowModal(false)}
          title={t("unlock.farmhand")}
        >
          <div className="p-2">
            <div className="flex justify-center mb-2">
              <img
                src={ITEM_DETAILS[name].image}
                alt={name}
                className="w-full h-auto"
                style={{ maxWidth: `${PIXEL_SCALE * BED_WIDTH[name]}px` }}
              />
            </div>
            <p className="mb-2 text-xx">
              {t("description.unlockFarmhand", {
                name,
              })}
            </p>
          </div>
          <Button
            onClick={() => {
              gameService.send({ type: "farmHand.unlocked" });
              setShowModal(false);
            }}
          >
            {t("unlock.farmhand")}
          </Button>
        </CloseButtonPanel>
      </Modal>
      <div
        className="relative"
        style={{
          width: `${PIXEL_SCALE * BED_WIDTH[name]}px`,
          height: `${PIXEL_SCALE * 19}px`,
        }}
      >
        <img
          className="absolute bottom-0"
          src={ITEM_DETAILS[name].image}
          alt={name}
          style={{
            width: `${PIXEL_SCALE * BED_WIDTH[name]}px`,
            left: `-${((BED_WIDTH[name] - 16) * PIXEL_SCALE) / 2}px`,
          }}
        />

        {canSleepHere && (
          <img
            src={SUNNYSIDE.icons.click_icon}
            className="z-10 absolute animate-pulsate hover:img-highlight"
            onClick={() => setShowModal(true)}
            style={{
              left: `${8 * PIXEL_SCALE}px`,
              bottom: `${16 * PIXEL_SCALE}px`,
              width: `${PIXEL_SCALE * 14}px`,
            }}
          />
        )}
      </div>
    </>
  );
};
