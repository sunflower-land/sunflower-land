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
import { BED_FARMHAND_COUNT, BEDS } from "features/game/types/beds";

interface BedProps {
  name: BedName;
}

export const BED_WIDTH: Record<BedName, number> = {
  "Basic Bed": 16,
  "Fisher Bed": 22,
  "Floral Bed": 16,
  "Sturdy Bed": 18,
  "Desert Bed": 16,
  "Cow Bed": 22,
  "Pirate Bed": 16,
  "Royal Bed": 16,
  "Double Bed": 24,
  "Messy Bed": 17,
};

export const BED_HEIGHT: Record<BedName, number> = {
  "Basic Bed": 20,
  "Fisher Bed": 38,
  "Floral Bed": 22,
  "Sturdy Bed": 20,
  "Desert Bed": 26,
  "Cow Bed": 22,
  "Pirate Bed": 34,
  "Royal Bed": 22,
  "Double Bed": 18,
  "Messy Bed": 20,
};

const _farmhands = (state: MachineState) =>
  state.context.state.farmHands.bumpkins;
const _collectibles = (state: MachineState) => state.context.state.collectibles;
const _homeCollectibles = (state: MachineState) =>
  state.context.state.home.collectibles;
const _isLandscaping = (state: MachineState) => state.matches("landscaping");

export const Bed: React.FC<BedProps> = ({ name }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const [showModal, setShowModal] = useState(false);

  const farmhands = useSelector(gameService, _farmhands);
  const collectibles = useSelector(gameService, _collectibles);
  const homeCollectibles = useSelector(gameService, _homeCollectibles);
  const isLandscaping = useSelector(gameService, _isLandscaping);

  // The main bumpkin + the farmhands that are already on the bed
  const bumpkinCount = getKeys(farmhands).length + 1;
  const uniqueBedCollectibles = getKeys(collectibles).filter(
    (collectible) => collectible in BED_FARMHAND_COUNT,
  );
  const uniqueHomeBedCollectibles = getKeys(homeCollectibles).filter(
    (collectible) => collectible in BED_FARMHAND_COUNT,
  );
  const uniqueBeds = new Set([
    ...uniqueBedCollectibles,
    ...uniqueHomeBedCollectibles,
  ]);

  const beds = getKeys(BEDS)
    .filter((bedName) => uniqueBeds.has(bedName))
    .reverse();
  const availableBeds = beds.length - bumpkinCount;

  const canSleepHere = beds.indexOf(name) < availableBeds;

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
        className="relative h-full"
        style={{
          width: `${PIXEL_SCALE * BED_WIDTH[name]}px`,
        }}
      >
        <img
          className="absolute"
          src={ITEM_DETAILS[name].image}
          alt={name}
          style={{
            width: `${PIXEL_SCALE * BED_WIDTH[name]}px`,
            left:
              name === "Double Bed"
                ? `${PIXEL_SCALE * 4}px`
                : `-${((BED_WIDTH[name] - 16) * PIXEL_SCALE) / 2}px`,
            top: `-${(BED_HEIGHT[name] * PIXEL_SCALE) / 2}px`,
          }}
        />
        {canSleepHere && !isLandscaping && (
          <img
            id="bed-icon"
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
