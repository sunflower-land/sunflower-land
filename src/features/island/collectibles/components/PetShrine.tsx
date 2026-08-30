import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import type { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "assets/sunnyside";
import { ProgressBar } from "components/ui/ProgressBar";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  EXPIRY_COOLDOWNS,
  getCollectibleExpiry,
  getCollectiblesAcrossLocations,
} from "features/game/lib/collectibleBuilt";
import { TemporaryCollectibleModal } from "features/game/components/TemporaryCollectibleModal";
import { hasFeatureAccess } from "lib/flags";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import type { PetShrineName } from "features/game/types/pets";
import { getObjectEntries } from "lib/object";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { RenewPetShrine } from "features/game/components/RenewPetShrine";
import { useVisiting } from "lib/utils/visitUtils";

const PET_SHRINE_DIMENSIONS: Record<
  PetShrineName | "Obsidian Shrine",
  {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    width?: number;
    height?: number;
  }
> = {
  "Fox Shrine": { width: 18, left: -0.5 },
  "Hound Shrine": { width: 17, left: -0.25 },
  "Boar Shrine": { width: 17, left: -0.25 },
  "Sparrow Shrine": { width: 18, left: -0.5 },
  "Toucan Shrine": { width: 19, left: -0.5 },
  "Collie Shrine": { width: 19, left: -0.5 },
  "Badger Shrine": { width: 18, left: -0.5 },
  "Stag Shrine": { width: 27, left: -2.5 },
  "Mole Shrine": { width: 19, left: -0.5 },
  "Bear Shrine": { width: 18, left: -0.5 },
  "Tortoise Shrine": { width: 18, left: -0.5 },
  "Moth Shrine": { width: 21, left: -1.5 },
  "Bantam Shrine": { width: 18, left: -0.5 },

  // Sprites not out yet
  "Trading Shrine": { width: 22, left: -1.5 },
  "Legendary Shrine": { width: 32, left: 0 },
  "Obsidian Shrine": { width: 19, left: -1.25 },
};

export const PET_SHRINE_DIMENSIONS_STYLES = getObjectEntries(
  PET_SHRINE_DIMENSIONS,
).reduce<Record<PetShrineName | "Obsidian Shrine", React.CSSProperties>>(
  (acc, [pet, styles]) => {
    acc[pet] = {
      left: styles.left ? `${PIXEL_SCALE * styles.left}px` : undefined,
      right: styles.right ? `${PIXEL_SCALE * styles.right}px` : undefined,
      top: styles.top ? `${PIXEL_SCALE * styles.top}px` : undefined,
      bottom: styles.bottom ? `${PIXEL_SCALE * styles.bottom}px` : undefined,
      width: styles.width ? `${PIXEL_SCALE * styles.width}px` : undefined,
      height: styles.height ? `${PIXEL_SCALE * styles.height}px` : undefined,
    };
    return acc;
  },
  { ...PET_SHRINE_DIMENSIONS },
);

const _gameState = (state: MachineState) => state.context.state;

export const PetShrine: React.FC<
  CollectibleProps & { name: PetShrineName | "Obsidian Shrine" }
> = ({ createdAt, id, location, name }) => {
  const { gameService, showTimers, showAnimations } = useContext(Context);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { isVisiting } = useVisiting();
  const gameState = useSelector(gameService, _gameState);

  // Read the placement so any time bought via `collectible.extended` is included
  // in the countdown rather than the shrine appearing to expire early.
  const placed = getCollectiblesAcrossLocations(gameState, name).find(
    (collectible) => collectible.id === id,
  );
  const extendedMs = placed?.extendedMs ?? 0;
  const expiresAt = getCollectibleExpiry({
    name,
    collectible: placed ?? { createdAt },
    game: gameState,
  });
  const canExtend =
    !isVisiting && hasFeatureAccess(gameState, "SPEED_BOOSTS") && !!placed;

  const { totalSeconds: secondsToExpire } = useCountdown(expiresAt);
  const durationSeconds = ((EXPIRY_COOLDOWNS[name] ?? 0) + extendedMs) / 1000;
  const percentage = 100 - (secondsToExpire / durationSeconds) * 100;
  const hasExpired = secondsToExpire <= 0;

  const handleRenewClick = () => {
    setShowRenewalModal(true);
  };

  if (hasExpired) {
    return (
      <>
        <div
          onClick={isVisiting ? undefined : handleRenewClick}
          className="absolute"
          style={{ ...PET_SHRINE_DIMENSIONS_STYLES[name], bottom: 0 }}
        >
          <img
            src={ITEM_DETAILS[name].image}
            style={{
              ...PET_SHRINE_DIMENSIONS_STYLES[name],
              bottom: 0,
              filter: "grayscale(100%)",
            }}
            className="absolute cursor-pointer"
            alt={name}
          />
        </div>
        {showTimers && (
          <div
            className="absolute left-1/2"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              transform: "translateX(-50%)",
              bottom: `${PIXEL_SCALE * -3}px`,
            }}
          >
            <ProgressBar
              seconds={secondsToExpire}
              formatLength="medium"
              type="error"
              percentage={percentage}
            />
          </div>
        )}
        <div
          className="flex justify-center absolute w-full pointer-events-none z-30"
          style={{
            top: `${PIXEL_SCALE * -20}px`,
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
        <RenewPetShrine
          show={showRenewalModal}
          onHide={() => setShowRenewalModal(false)}
          name={name}
          id={id}
          location={location}
        />
      </>
    );
  }

  return (
    <>
      <div onClick={() => setShowDetails(true)}>
        <div
          className="absolute"
          style={{ ...PET_SHRINE_DIMENSIONS_STYLES[name], bottom: 0 }}
        >
          <img
            src={ITEM_DETAILS[name].image}
            style={{ ...PET_SHRINE_DIMENSIONS_STYLES[name], bottom: 0 }}
            className="absolute cursor-pointer"
            alt={name}
          />
        </div>
        {showTimers && (
          <div
            className="absolute left-1/2"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              transform: "translateX(-50%)",
              bottom: `${PIXEL_SCALE * -3}px`,
            }}
          >
            <ProgressBar
              seconds={secondsToExpire}
              formatLength="medium"
              type={"progress"}
              percentage={percentage}
            />
          </div>
        )}
      </div>

      <TemporaryCollectibleModal
        show={showDetails}
        onHide={() => setShowDetails(false)}
        name={name}
        id={id}
        location={location}
        expiresAt={expiresAt}
        canExtend={canExtend}
      />
    </>
  );
};
