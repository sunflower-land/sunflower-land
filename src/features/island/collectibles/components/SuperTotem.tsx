import React, { useContext, useState } from "react";

import superTotem from "assets/sfts/super_totem.webp";
import fastForward from "assets/icons/fast_forward.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "assets/sunnyside";
import { ProgressBar } from "components/ui/ProgressBar";
import { Context } from "features/game/GameProvider";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import { useVisiting } from "lib/utils/visitUtils";
import { RenewCollectible } from "features/game/components/RenewCollectible";
import Decimal from "decimal.js-light";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import {
  getCollectibleExpiry,
  getCollectiblesAcrossLocations,
  getExpiryCooldown,
} from "features/game/lib/collectibleBuilt";
import { TemporaryCollectibleModal } from "features/game/components/TemporaryCollectibleModal";
import { hasFeatureAccess } from "lib/flags";

const _gameState = (state: MachineState) => state.context.state;

export const SuperTotem: React.FC<CollectibleProps> = ({
  createdAt,
  id,
  location,
}) => {
  const { gameService, showTimers, showAnimations } = useContext(Context);
  const { isVisiting } = useVisiting();
  const gameState = useSelector(gameService, _gameState);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const chestItems = getChestItems(gameState);

  const duration = getExpiryCooldown("Super Totem", gameState);
  // Read the placement so any time bought via `collectible.extended` is included
  // in the countdown rather than the totem appearing to expire early.
  const placed = getCollectiblesAcrossLocations(gameState, "Super Totem").find(
    (collectible) => collectible.id === id,
  );
  const expiresAt = getCollectibleExpiry({
    name: "Super Totem",
    collectible: placed ?? { createdAt },
    game: gameState,
  });
  const { totalSeconds: secondsToExpire } = useCountdown(expiresAt);
  const hasExpired = secondsToExpire <= 0;
  const durationSeconds = (duration + (placed?.extendedMs ?? 0)) / 1000;
  const percentage = 100 - (secondsToExpire / durationSeconds) * 100;
  const canExtend =
    !isVisiting && hasFeatureAccess(gameState, "SPEED_BOOSTS") && !!placed;
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
    <>
      <div onClick={() => setShowDetails(true)}>
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
      </div>

      <TemporaryCollectibleModal
        show={showDetails}
        onHide={() => setShowDetails(false)}
        name="Super Totem"
        id={id}
        location={location}
        expiresAt={expiresAt}
        canExtend={canExtend}
      />
    </>
  );
};
