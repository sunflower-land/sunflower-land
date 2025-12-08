import React, { useContext } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { Modal } from "components/ui/Modal";
import { ShopItems } from "./ShopItems";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useActor, useSelector } from "@xstate/react";
import { getKeys } from "features/game/types/craftables";
import { CROPS } from "features/game/types/crops";
import { GameState } from "features/game/types/game";
import { CROP_SHORTAGE_HOURS } from "features/game/expansion/lib/boosts";
import { MARKET_VARIANTS } from "features/island/lib/alternateArt";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";
import { MachineState } from "features/game/lib/gameMachine";
import { ITEM_DETAILS } from "features/game/types/images";
import shadow from "assets/npcs/shadow.png";
import lightning from "assets/icons/lightning.png";
import { useSound } from "lib/utils/hooks/useSound";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { useCountdown } from "lib/utils/hooks/useCountdown";

const _season = (state: MachineState) => state.context.state.season.season;

const _specialEvents = (state: MachineState) =>
  Object.entries(state.context.state.specialEvents.current)
    .filter(([, specialEvent]) => !!specialEvent?.isEligible)
    .filter(
      ([, specialEvent]) => (specialEvent?.endAt ?? Infinity) > Date.now(),
    )
    .filter(([, specialEvent]) => (specialEvent?.startAt ?? 0) < Date.now());

const hasSoldCropsBefore = (farmActivity: GameState["farmActivity"]) => {
  return !!getKeys(CROPS).find((crop) =>
    getKeys(farmActivity).includes(`${crop} Sold`),
  );
};

const hasBoughtCropsBefore = (farmActivity: GameState["farmActivity"]) => {
  return !!getKeys(CROPS).find((crop) =>
    getKeys(farmActivity).includes(`${crop} Seed Bought`),
  );
};

const getBettyPositioning = () => {
  return {
    shadow: {
      width: `${PIXEL_SCALE * 15}px`,
      bottom: `${PIXEL_SCALE * 6}px`,
      right: `${PIXEL_SCALE * 9}px`,
    },
    betty: {
      width: `${PIXEL_SCALE * 16}px`,
      bottom: `${PIXEL_SCALE * 8}px`,
      right: `${PIXEL_SCALE * 8}px`,
      transform: "scaleX(-1)",
    },
  };
};

export const Market: React.FC<BuildingProps> = ({ isBuilt, island }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const specialEvents = useSelector(gameService, _specialEvents);

  const season = useSelector(gameService, _season);
  const { t } = useAppTranslation();

  const { play: shopAudio } = useSound("shop");

  const handleClick = () => {
    if (isBuilt) {
      // Add future on click actions here
      shopAudio();
      setIsOpen(true);
      return;
    }
  };

  const hasSoldBefore = hasSoldCropsBefore(
    gameState.context.state.farmActivity,
  );
  const showBuyHelper =
    !hasBoughtCropsBefore(gameState.context.state.farmActivity) &&
    !!hasSoldBefore;

  const showHelper =
    gameState.context.state.farmActivity["Sunflower Harvested"] === 9 &&
    !gameState.context.state.farmActivity["Sunflower Sold"];

  const { totalSeconds: cropShortageSecondsLeft } = useCountdown(
    gameState.context.state.createdAt + CROP_SHORTAGE_HOURS * 60 * 60 * 1000,
  );

  const isCropShortage = cropShortageSecondsLeft > 0;

  const specialEventDetails = specialEvents[0];

  const boostItem = getKeys(specialEventDetails?.[1]?.bonus ?? {})[0];
  const boostAmount =
    specialEventDetails?.[1]?.bonus?.[boostItem]?.saleMultiplier;
  const { shadow: shadowPosition, betty: bettyPosition } =
    getBettyPositioning();

  return (
    <>
      <BuildingImageWrapper name="Market" onClick={handleClick}>
        <img
          src={MARKET_VARIANTS[getCurrentBiome(island)][season]}
          className="absolute bottom-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 48}px`,
          }}
        />

        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={shadowPosition}
        />
        <img
          src={SUNNYSIDE.npcs.betty}
          className="absolute pointer-events-none"
          style={bettyPosition}
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
