import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";

import * as Auth from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

type FormEvent = Element & {
  landId: {
    value: string;
  };
};

export const VisitLandExpansionForm: React.FC<{ onBack?: () => void }> = ({
  onBack,
}) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(Context);
  const [_, gameSend] = useActor(gameService);
  const navigate = useNavigate();
  const location = useLocation();

  const visit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const landId = parseInt((event.target as FormEvent).landId.value);

    if (isNaN(landId) || landId <= 0) return;

    if (location.pathname.includes("visit")) {
      gameSend({ type: "VISIT", landId });
    }

    navigate(`/visit/${landId}`);
  };

  const handleEndVisit = () => {
    if (authState.matches({ connected: "authorised" })) {
      gameService.send("END_VISIT");
      navigate(`/land/${authState.context.farmId}`);
    } else {
      authService.send("RETURN");
    }
  };

  return (
    <div>
      <form onSubmit={visit}>
        <span className="text-shadow text-small mb-2 px-1">
          Enter Land ID:{" "}
        </span>
        <input
          type="number"
          name="landId"
          className="text-shadow shadow-inner shadow-black bg-brown-200 w-24 p-2 m-2 text-center"
        />
        <div className="flex">
          <Button
            className="overflow-hidden mr-1"
            type="button"
            onClick={onBack ?? handleEndVisit}
          >
            Back
          </Button>
          <Button className="overflow-hidden ml-1" type="submit">
            Visit
          </Button>
        </div>
      </form>
    </div>
  );
};
