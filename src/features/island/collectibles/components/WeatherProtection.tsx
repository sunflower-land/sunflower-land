import React, { useCallback, useContext, useState } from "react";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useVisiting } from "lib/utils/visitUtils";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";
import { ITEM_DETAILS } from "features/game/types/images";
import { setImageWidth } from "lib/images";
import type { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { RenewWeatherCollectible } from "features/game/components/RenewWeatherCollectible";
import type { MachineState } from "features/game/lib/gameMachine";
import type { WeatherShopItem } from "features/game/types/calendar";

type Props = CollectibleProps & {
  name: WeatherShopItem;
};

const selectWeatherProtectionUsed = (
  state: MachineState,
  name: WeatherShopItem,
  id: string,
  location: CollectibleProps["location"],
) => {
  const game = state.context.state;
  const group =
    location === "home"
      ? game.home.collectibles[name]
      : location === "interior"
        ? game.interior.ground.collectibles[name]
        : location === "level_one"
          ? game.interior.level_one?.collectibles[name]
          : game.collectibles[name];

  return !!group?.find((collectible) => collectible.id === id)?.used;
};

export const WeatherProtection: React.FC<Props> = ({ name, id, location }) => {
  const { gameService, showAnimations } = useContext(Context);
  const { isVisiting } = useVisiting();
  const [showRenewModal, setShowRenewModal] = useState(false);

  const isUsed = useSelector(
    gameService,
    useCallback(
      (state: MachineState) =>
        selectWeatherProtectionUsed(state, name, id, location),
      [name, id, location],
    ),
  );

  if (isUsed) {
    return (
      <>
        <div
          className={isVisiting ? undefined : "cursor-pointer"}
          onClick={isVisiting ? undefined : () => setShowRenewModal(true)}
        >
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

        <RenewWeatherCollectible
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
