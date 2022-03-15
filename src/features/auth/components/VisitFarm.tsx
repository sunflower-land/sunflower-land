import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";

type FormEvent = Element & {
  farmId: {
    value: string;
  };
};

export const VisitFarm: React.FC = () => {
  const { authService } = useContext(Auth.Context);

  const visit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const _farmId = parseInt((event.target as FormEvent).farmId.value);

    if (isNaN(_farmId) || _farmId <= 0) return;

    authService.send("VISIT", { farmId: _farmId });
  };

  return (
    <>
      <form onSubmit={visit}>
        <span className="text-shadow text-small mb-2 px-1">
          Enter Farm ID:{" "}
        </span>
        <input
          type="number"
          name="farmId"
          className="text-shadow shadow-inner shadow-black bg-brown-200 w-24 p-2 m-2 text-center"
        />
        <div className="flex">
          <Button
            className="overflow-hidden mr-1"
            type="button"
            onClick={() => authService.send("LOAD_FARM")}
          >
            Back
          </Button>
          <Button className="overflow-hidden ml-1" type="submit">
            Visit
          </Button>
        </div>
      </form>
    </>
  );
};
