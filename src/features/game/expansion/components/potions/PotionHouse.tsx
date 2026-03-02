import React, { useContext } from "react";

import { IntroPage } from "./Intro";
import { Experiment } from "./Experiment";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelRoomBorderStyle } from "features/game/lib/style";
import { Rules } from "./Rules";
import {
  PotionHouseMachineInterpreter,
  potionHouseMachine,
} from "./lib/potionHouseMachine";
import { useActor, useActorRef } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import book from "src/assets/icons/tier1_book.webp";

interface Props {
  onClose: () => void;
}

export const PotionHouse: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);

  const potionHouse = gameService.getSnapshot().context.state.potionHouse;
  const isNewGame = !potionHouse || potionHouse?.game.status === "finished";

  const potionHouseService = useActorRef(potionHouseMachine, {
    context: { isNewGame },
  }) as unknown as PotionHouseMachineInterpreter;

  const [state, send] = useActor(potionHouseService);

  return (
    <div
      className="bg-brown-600  relative"
      style={{ ...pixelRoomBorderStyle, padding: `${PIXEL_SCALE * 1}px` }}
    >
      <div id="cover" />
      <div className="p-1 flex relative flex-col h-full overflow-y-auto scrollable">
        {/* Header */}
        <div className="flex mb-3 w-full justify-center">
          <div
            onClick={() => send("OPEN_RULES")}
            style={{
              height: `${PIXEL_SCALE * 11}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          >
            {!state.matches("rules") && (
              <img src={book} className="cursor-pointer w-full p-0.5" />
            )}
          </div>
          <h1 className="grow text-center text-lg">
            {state.matches("rules") ? "How to play" : "Potion Room"}
          </h1>
        </div>
        <div className="flex flex-col grow mb-1">
          {state.matches("introduction") && (
            <IntroPage onClose={() => send("ACKNOWLEDGE")} />
          )}
          {state.matches("playing") && (
            <Experiment potionHouseService={potionHouseService} />
          )}
          {state.matches("rules") && (
            <Rules onDone={() => send("ACKNOWLEDGE")} />
          )}
        </div>
      </div>
    </div>
  );
};
