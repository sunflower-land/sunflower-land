import React, { useContext, useEffect } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { Modal } from "components/ui/Modal";
import { ShopItems } from "./ShopItems";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useActor, useSelector } from "@xstate/react";
import { getKeys } from "features/game/types/craftables";
import { PLOT_CROPS } from "features/game/types/crops";
import { Bumpkin } from "features/game/types/game";
import { loadAudio, shopAudio } from "lib/utils/sfx";
import { CROP_SHORTAGE_HOURS } from "features/game/expansion/lib/boosts";
import { MARKET_VARIANTS } from "features/island/lib/alternateArt";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";
import { MachineState } from "features/game/lib/gameMachine";
import { ITEM_DETAILS } from "features/game/types/images";
import shadow from "assets/npcs/shadow.png";
import lightning from "assets/icons/lightning.png";

const _specialEvents = (state: MachineState) =>
  Object.entries(state.context.state.specialEvents.current)
    .filter(([, specialEvent]) => !!specialEvent?.isEligible)
    .filter(
      ([, specialEvent]) => (specialEvent?.endAt ?? Infinity) > Date.now(),
    )
    .filter(([, specialEvent]) => (specialEvent?.startAt ?? 0) < Date.now());

const hasSoldCropsBefore = (bumpkin?: Bumpkin) => {
  if (!bumpkin) return false;

  const { activity = {} } = bumpkin;

  return !!getKeys(PLOT_CROPS).find((crop) =>
    getKeys(activity).includes(`${crop} Sold`),
  );
};

const hasBoughtCropsBefore = (bumpkin?: Bumpkin) => {
  if (!bumpkin) return false;

  const { activity = {} } = bumpkin;

  return !!getKeys(PLOT_CROPS).find((crop) =>
    getKeys(activity).includes(`${crop} Seed Bought`),
  );
};

export const Market: React.FC<BuildingProps> = ({
  isBuilt,
  onRemove,
  island,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const specialEvents = useSelector(gameService, _specialEvents);

  const { t } = useAppTranslation();

  useEffect(() => {
    loadAudio([shopAudio]);
  }, []);

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }
    if (isBuilt) {
      // Add future on click actions here
      shopAudio.play();
      setIsOpen(true);
      return;
    }
  };

  const hasSoldBefore = hasSoldCropsBefore(gameState.context.state.bumpkin);
  const showBuyHelper =
    !hasBoughtCropsBefore(gameState.context.state.bumpkin) && !!hasSoldBefore;

  const showHelper =
    gameState.context.state.bumpkin?.activity?.["Sunflower Harvested"] === 9 &&
    !gameState.context.state.bumpkin?.activity?.["Sunflower Sold"];

  const cropShortageSecondsLeft =
    (gameState.context.state.createdAt +
      CROP_SHORTAGE_HOURS * 60 * 60 * 1000 -
      Date.now()) /
    1000;
  const isCropShortage = cropShortageSecondsLeft >= 0;

  const specialEventDetails = specialEvents[0];

  const boostItem = getKeys(specialEventDetails?.[1]?.bonus ?? {})[0];
  const boostAmount =
    specialEventDetails?.[1]?.bonus?.[boostItem]?.saleMultiplier;

  return (
    <>
      <BuildingImageWrapper name="Market" onClick={handleClick}>
        <img
          src={MARKET_VARIANTS[island]}
          className="absolute bottom-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 48}px`,
          }}
        />

        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 6}px`,
            right: `${PIXEL_SCALE * 18}px`,
          }}
        />
        <img
          src={SUNNYSIDE.npcs.betty}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 8}px`,
            right: `${PIXEL_SCALE * 16}px`,
            transform: "scaleX(-1)",
          }}
        />

        {showHelper && (
          <>
            <img
              className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
              src={SUNNYSIDE.icons.click_icon}
              style={{
                width: `${PIXEL_SCALE * 18}px`,
                right: `${PIXEL_SCALE * -8}px`,
                top: `${PIXEL_SCALE * 20}px`,
              }}
            />
            <img
              className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
              src={SUNNYSIDE.icons.money_icon}
              style={{
                width: `${PIXEL_SCALE * 18}px`,
                right: `${PIXEL_SCALE * 8}px`,
                top: `${PIXEL_SCALE * 20}px`,
              }}
            />
          </>
        )}
      </BuildingImageWrapper>
      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <ShopItems
          onClose={() => setIsOpen(false)}
          hasSoldBefore={hasSoldBefore}
          showBuyHelper={showBuyHelper}
        />
        {isCropShortage && (
          <Label
            icon={SUNNYSIDE.icons.stopwatch}
            type="vibrant"
            className="absolute right-0 -top-7 shadow-md"
            style={{
              wordSpacing: 0,
            }}
          >
            {`${t("2x.sale")}: ${secondsToString(cropShortageSecondsLeft, {
              length: "medium",
            })} left`}
          </Label>
        )}
        {boostItem && (
          <div className="flex justify-between">
            <Label
              icon={boostItem ? ITEM_DETAILS[boostItem].image : undefined}
              secondaryIcon={lightning}
              type="vibrant"
              className="absolute right-0 -top-7 shadow-md"
            >
              {`${boostAmount}x ${boostItem} ${t("sale")}`}
            </Label>
          </div>
        )}
      </Modal>
    </>
  );
};
