import React, { useContext, useState } from "react";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useVisiting } from "lib/utils/visitUtils";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";
import { ITEM_DETAILS } from "features/game/types/images";
import { setImageWidth } from "lib/images";
import type { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { RenewCollectible } from "features/game/components/RenewCollectible";
import type { MachineState } from "features/game/lib/gameMachine";
import {
  canRenewWeatherCollectible,
  type WeatherProtectionCollectibleName,
} from "features/game/lib/renewableCollectibles";

const _gameState = (state: MachineState) => state.context.state;

type Props = CollectibleProps & {
  name: WeatherProtectionCollectibleName;
};

export const WeatherProtection: React.FC<Props> = ({
  name,
  id,
  location,
  createdAt,
}) => {
  const { gameService, showAnimations } = useContext(Context);
  const { isVisiting } = useVisiting();
  const gameState = useSelector(gameService, _gameState);
  const [showRenewModal, setShowRenewModal] = useState(false);

  const hasExpired = !!createdAt;
  const canRenew = canRenewWeatherCollectible({ game: gameState, name });

  if (hasExpired) {
    return (
      <>
        <div onClick={isVisiting ? undefined : () => setShowRenewModal(true)}>
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
                opacity: canRenew ? 1 : 0.85,
              }}
            />
          </div>

          <img
            src={ITEM_DETAILS[name].image}
            className="absolute left-1/2 transform -translate-x-1/2"
            alt={name}
            style={{
              maxWidth: "none",
              bottom: 0,
              filter: "grayscale(100%)",
            }}
            onLoad={(e) => {
              setImageWidth(e.currentTarget);
            }}
          />
        </div>

        <RenewCollectible
          show={showRenewModal}
          onHide={() => setShowRenewModal(false)}
          name={name}
          id={id}
          location={location}
        />
      </>
    );
  }

  return (
    <SFTDetailPopover name={name}>
      <img
        src={ITEM_DETAILS[name].image}
        className="absolute left-1/2 transform -translate-x-1/2"
        alt={name}
        style={{
          maxWidth: "none",
          bottom: 0,
        }}
        onLoad={(e) => {
          setImageWidth(e.currentTarget);
        }}
      />
    </SFTDetailPopover>
  );
};
