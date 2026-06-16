import React, { useContext, useState } from "react";

import superTotem from "assets/sfts/super_totem.webp";
import fastForward from "assets/icons/fast_forward.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "assets/sunnyside";
import { ProgressBar } from "components/ui/ProgressBar";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  SFTDetailPopoverBuffs,
  SFTDetailPopoverInnerPanel,
  SFTDetailPopoverLabel,
} from "components/ui/SFTDetailPopover";
import { secondsToString } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import { useVisiting } from "lib/utils/visitUtils";
import { RenewCollectible } from "features/game/components/RenewCollectible";
import Decimal from "decimal.js-light";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";

const _gameState = (state: MachineState) => state.context.state;

export const SuperTotem: React.FC<CollectibleProps> = ({
  createdAt,
  id,
  location,
}) => {
  const { t } = useAppTranslation();
  const { gameService, showTimers, showAnimations } = useContext(Context);
  const { isVisiting } = useVisiting();
  const gameState = useSelector(gameService, _gameState);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const chestItems = getChestItems(gameState);

  const expiresAt = createdAt + 7 * 24 * 60 * 60 * 1000;
  const { totalSeconds: secondsToExpire } = useCountdown(expiresAt);
  const hasExpired = secondsToExpire <= 0;
  const percentage = 100 - (secondsToExpire / (7 * 24 * 60 * 60)) * 100;
  const hasReplacement = (chestItems["Super Totem"] ?? new Decimal(0)).gt(0);

  const handleRemove = () => {
    gameService.send("collectible.burned", {
      name: "Super Totem",
      location,
      id,
    });
  };

  if (hasExpired) {
    return (
      <>
        <div
          onClick={
            isVisiting
              ? undefined
              : hasReplacement
                ? () => setShowRenewModal(true)
                : handleRemove
          }
        >
          {showTimers && (
            <div className="absolute bottom-0 left-0">
              <ProgressBar
                seconds={secondsToExpire}
                formatLength="medium"
                type="error"
                percentage={percentage}
              />
            </div>
          )}

          {!hasReplacement && (
            <img
              className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
              src={SUNNYSIDE.icons.dig_icon}
              style={{
                width: `${PIXEL_SCALE * 18}px`,
                right: `${PIXEL_SCALE * -8}px`,
                top: `${PIXEL_SCALE * -8}px`,
              }}
            />
          )}

          {hasReplacement && (
            <div
              className="flex justify-center absolute w-full pointer-events-none z-30"
              style={{
                top: `${PIXEL_SCALE * -12}px`,
              }}
            >
              <img
                src={SUNNYSIDE.icons.expression_alerted}
                className={showAnimations ? "ready" : ""}
                style={{
                  width: `${PIXEL_SCALE * 4}px`,
                }}
              />
            </div>
          )}

          <img
            src={superTotem}
            style={{
              width: `${PIXEL_SCALE * 20}px`,
              bottom: `${PIXEL_SCALE * 0}px`,
              left: `${PIXEL_SCALE * 0}px`,
              filter: "grayscale(100%)",
            }}
            className="absolute cursor-pointer"
            alt="Super Totem"
          />
        </div>

        <RenewCollectible
          show={showRenewModal}
          onHide={() => setShowRenewModal(false)}
          name="Super Totem"
          id={id}
          location={location}
        />
      </>
    );
  }
  return (
    <Popover>
      <PopoverButton as="div">
        {showTimers && (
          <div className="absolute bottom-0 left-0">
            <ProgressBar
              seconds={secondsToExpire}
              formatLength="medium"
              type={"buff"}
              percentage={percentage}
            />
          </div>
        )}

        <img
          src={superTotem}
          style={{
            width: `${PIXEL_SCALE * 20}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
          className="absolute cursor-pointer"
          alt="Super Totem"
        />
        <img
          src={fastForward}
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            top: `${PIXEL_SCALE * -5}px`,
            left: `${PIXEL_SCALE * 3}px`,
          }}
          className="absolute pointer-events-none animate-pulse"
        />
      </PopoverButton>

      <PopoverPanel anchor={{ to: "left start" }} className="flex">
        <SFTDetailPopoverInnerPanel>
          <SFTDetailPopoverLabel name={"Super Totem"} />
          <Label type="info" className="mt-2 mb-2">
            <span className="text-xs">
              {t("time.remaining", {
                time: secondsToString(secondsToExpire, {
                  length: "medium",
                  isShortFormat: true,
                  removeTrailingZeros: true,
                }),
              })}
            </span>
          </Label>
          <SFTDetailPopoverBuffs name={"Super Totem"} />
        </SFTDetailPopoverInnerPanel>
      </PopoverPanel>
    </Popover>
  );
};
