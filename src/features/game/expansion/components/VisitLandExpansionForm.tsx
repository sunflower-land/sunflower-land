import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "components/ui/Button";

import * as Auth from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { AuthMachineState } from "features/auth/lib/authMachine";

type FormEvent = Element & {
  landId: {
    value: string;
  };
};

const _playing = (state: MachineState) => state.matches("playing");
const _actions = (state: MachineState) => state.context.actions;
const _connected = (state: AuthMachineState) => state.matches("connected");

export const VisitLandExpansionForm: React.FC<{ onBack?: () => void }> = ({
  onBack,
}) => {
  const { t } = useAppTranslation();

  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);
  const playing = useSelector(gameService, _playing);
  const actions = useSelector(gameService, _actions);
  const connected = useSelector(authService, _connected);
  const navigate = useNavigate();
  const location = useLocation();

  const visit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const landId = parseInt((event.target as FormEvent).landId.value);

    if (isNaN(landId) || landId <= 0) return;

    // If the player has been playing and there are unsaved actions then save progress
    if (playing && actions.length > 0) {
      gameService.send("SAVE");
    }

    // If the player has already been visiting ie /visit/id then there will be no rerender when navigating
    // therefore we stay in the current game machine so we send an event back to handle the visit flow
    if (location.pathname.includes("visit")) {
      gameService.send({ type: "VISIT", landId });
    }

    // If a player has been playing the game ie /land/id there will be a rerender and the current gameMachine
    // will end when we navigate and a new one will be created therefore we don't need to send an event back
    navigate(`/visit/${landId}`);
  };

  const handleEndVisit = () => {
    if (connected) {
      gameService.send("END_VISIT");
    } else {
      authService.send("RETURN");
    }
  };

  return (
    <div>
      <form onSubmit={visit}>
        <div className="flex items-center mb-2">
          <span className=" text-small px-1 whitespace-nowrap">
            {t("visitIsland.enterIslandId")}{" "}
          </span>
          <input
            type="number"
            name="landId"
            className="text-shadow shadow-inner shadow-black bg-brown-200 w-[60%] p-2 m-2 text-center"
          />
        </div>
        <div className="flex">
          <Button
            className="overflow-hidden mr-1"
            type="button"
            onClick={onBack ?? handleEndVisit}
          >
            {t("back")}
          </Button>
          <Button className="overflow-hidden ml-1" type="submit">
            {t("visitIsland.visit")}
          </Button>
        </div>
      </form>
    </div>
  );
};
