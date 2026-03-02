import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { Loading } from "features/auth/components";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { getKeys } from "features/game/types/decorations";
import { BedName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BED_FARMHAND_COUNT } from "features/game/types/beds";
import { NaturalImage } from "components/ui/NaturalImage";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { Equipped } from "features/game/types/bumpkin";

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
  "Pearl Bed": 26,
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
  "Pearl Bed": 30,
  "Double Bed": 18,
  "Messy Bed": 20,
};

const _farmhands = (state: MachineState) =>
  state.context.state.farmHands.bumpkins;
const _collectibles = (state: MachineState) => state.context.state.collectibles;
const _homeCollectibles = (state: MachineState) =>
  state.context.state.home.collectibles;
const _isLandscaping = (state: MachineState) => state.matches("landscaping");
const _unlockingFarmhand = (state: MachineState) =>
  state.matches("unlockingFarmhand");
const _unlockingFarmhandSuccess = (state: MachineState) =>
  state.matches("unlockingFarmhandSuccess");
const _latestFarmhand = (state: MachineState): Equipped | undefined => {
  const farmHands = Object.values(state.context.state.farmHands.bumpkins);
  const latestFarmhand = farmHands[farmHands.length - 1];
  return latestFarmhand?.equipped;
};

export const Bed: React.FC<BedProps> = ({ name }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const [showModal, setShowModal] = useState(false);

  const farmhands = useSelector(gameService, _farmhands);
  const collectibles = useSelector(gameService, _collectibles);
  const homeCollectibles = useSelector(gameService, _homeCollectibles);
  const isLandscaping = useSelector(gameService, _isLandscaping);
  const unlockingFarmhand = useSelector(gameService, _unlockingFarmhand);
  const unlockingFarmhandSuccess = useSelector(
    gameService,
    _unlockingFarmhandSuccess,
  );
  const latestFarmhand = useSelector(gameService, _latestFarmhand);

  // Limit: main bumpkin + farmhands must not exceed bed count (e.g. 11 beds = 1 main + 10 farmhands max)
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

  // Sort best bed first (highest BED_FARMHAND_COUNT = Pearl Bed) so the next unlock targets it
  const beds = getKeys(BED_FARMHAND_COUNT)
    .filter((bedName) => uniqueBeds.has(bedName))
    .sort((a, b) => {
      const countA = BED_FARMHAND_COUNT[a] ?? 0;
      const countB = BED_FARMHAND_COUNT[b] ?? 0;
      return countB - countA; // descending: best (e.g. Pearl 11) first
    });
  const availableBeds = beds.length - bumpkinCount;

  const canSleepHere = beds.indexOf(name) < availableBeds;
  const isTwoWidthBed = ["Double Bed", "Pearl Bed"].includes(name);

  const handleClose = () => {
    if (!isFarmhandUnlocking) setShowModal(false);
  };

  const handleContinue = () => {
    gameService.send({ type: "CONTINUE" });
    setShowModal(false);
  };

  const unlockFarmhand = () => {
    gameService.send("farmHand.unlocked", {
      effect: { type: "farmHand.unlocked" },
    });
  };

  const isFarmhandUnlocking = unlockingFarmhand || unlockingFarmhandSuccess;

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop={isFarmhandUnlocking ? "static" : true}
      >
        <CloseButtonPanel
          onClose={isFarmhandUnlocking ? undefined : handleClose}
          title={isFarmhandUnlocking ? undefined : t("unlock.farmhand")}
        >
          <BedContent
            name={name}
            handleContinue={handleContinue}
            unlockingFarmhand={unlockingFarmhand}
            unlockingFarmhandSuccess={unlockingFarmhandSuccess}
            unlockFarmhand={unlockFarmhand}
            latestFarmhand={latestFarmhand}
          />
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
            left: isTwoWidthBed
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
              left: isTwoWidthBed
                ? `${16 * PIXEL_SCALE}px`
                : `${8 * PIXEL_SCALE}px`,
              bottom: `${0 * PIXEL_SCALE}px`,
              width: `${PIXEL_SCALE * 14}px`,
            }}
          />
        )}
      </div>
    </>
  );
};

type BedContentProps = {
  name: BedName;
  handleContinue: () => void;
  unlockingFarmhand: boolean;
  unlockingFarmhandSuccess: boolean;
  unlockFarmhand: () => void;
  latestFarmhand: Equipped | undefined;
};

const BedContent: React.FC<BedContentProps> = ({
  name,
  handleContinue,
  unlockingFarmhand,
  unlockingFarmhandSuccess,
  unlockFarmhand,
  latestFarmhand,
}) => {
  const { t } = useAppTranslation();

  if (unlockingFarmhand) {
    return <Loading text={t("unlock.farmhandRevealing")} />;
  }
  if (unlockingFarmhandSuccess) {
    return (
      <>
        <div className="flex flex-col items-center p-1 mb-1">
          <p className="mb-2 text-sm text-center">
            {t("unlock.farmhandSuccess")}
          </p>
          {latestFarmhand && (
            <NPCIcon parts={latestFarmhand} width={PIXEL_SCALE * 18} />
          )}
        </div>
        <Button onClick={handleContinue}>{t("continue")}</Button>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 p-1">
        <NaturalImage
          src={ITEM_DETAILS[name].image}
          alt={name}
          maxWidth={BED_WIDTH[name]}
        />
        <p className="mb-2 text-xx">
          {t("description.unlockFarmhand", { name })}
        </p>
      </div>
      <Button onClick={unlockFarmhand}>{t("unlock.farmhand")}</Button>
    </>
  );
};
