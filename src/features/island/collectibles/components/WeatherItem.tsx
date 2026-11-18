import React, { useCallback, useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { useVisiting } from "lib/utils/visitUtils";
import {
  ITEM_DETAILS,
  getTranslatedItemName,
} from "features/game/types/images";
import { setImageWidth } from "lib/images";
import type { CollectibleProps } from "../Collectible";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { MachineState } from "features/game/lib/gameMachine";
import type { WeatherItemName } from "features/game/types/weatherItems";
import { getCollectiblesAcrossLocations } from "features/game/lib/getCollectiblesAcrossLocations";
import {
  getWeatherEvents,
  isWeatherItemGreyed,
} from "features/game/lib/weatherItemCover";
import { RenewWeatherItem } from "features/game/components/RenewWeatherItem";
import { useNow } from "lib/utils/hooks/useNow";
import { PRE_ACTION_TICK_MS } from "features/game/lib/timerDisplay";
import { TemplateCollectible } from "../TemplateCollectible";

type Props = CollectibleProps & {
  name: WeatherItemName;
};

/**
 * A weather item on the farm. Once it has been used on an event that has
 * ended it shows greyed out, and clicking it opens the renew modal.
 */
export const WeatherItem: React.FC<Props> = ({ name, id, location }) => {
  const { gameService, showAnimations } = useContext(Context);
  const { isVisiting } = useVisiting();
  const [showRenewModal, setShowRenewModal] = useState(false);
  // Live, so the item greys out when its event ends without a reload.
  const now = useNow({ live: true, intervalMs: PRE_ACTION_TICK_MS });

  const isGreyed = useSelector(
    gameService,
    useCallback(
      (state: MachineState) => {
        const game = state.context.state;
        const placement = getCollectiblesAcrossLocations(game, name).find(
          (collectible) => collectible.id === id,
        );

        return (
          !!placement &&
          isWeatherItemGreyed({
            game,
            item: name,
            placement,
            events: getWeatherEvents(game),
            now,
          })
        );
      },
      [name, id, now],
    ),
  );

  if (!isGreyed) return <TemplateCollectible name={name} />;

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
            alt=""
            className={showAnimations ? "ready" : ""}
            style={{
              width: `${PIXEL_SCALE * 4}px`,
            }}
          />
        </div>

        <img
          src={ITEM_DETAILS[name].image}
          className="absolute left-1/2 transform -translate-x-1/2"
          alt={getTranslatedItemName(name)}
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

      <RenewWeatherItem
        show={showRenewModal}
        onHide={() => setShowRenewModal(false)}
        name={name}
        id={id}
        location={location}
      />
    </>
  );
};
