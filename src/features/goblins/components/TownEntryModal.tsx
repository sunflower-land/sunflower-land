import React, { useContext } from "react";
import { useActor } from "@xstate/react";
import { useNavigate } from "react-router-dom";

import * as AuthProvider from "features/auth/lib/Provider";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import bumpkin from "assets/npcs/bumpkin.png";

export const TownEntryModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const farmId = authState.context.farmId;

  return (
    <Panel>
      <div className="flex flex-col items-center p-2">
        <h1 className="text-lg text-center">Time to get back to your farm?</h1>
        <img src={bumpkin} alt="bumpkin avatar" className="w-16 m-2" />
        <p className="text-sm mb-4">
          {
            "Tired of giving these greedy goblins all your hard earned resources?"
          }
        </p>
        <p className="text-sm mb-3">
          Head back to Farming Land and be safe from these intruders.
        </p>
      </div>

      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          Close
        </Button>
        <Button className="ml-1" onClick={() => navigate(`/farm/${farmId}`)}>
          Continue
        </Button>
      </div>
    </Panel>
  );
};
