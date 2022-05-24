import React from "react";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";

import bumpkin from "assets/npcs/bumpkin.png";

export const TownEntryModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <Panel>
      <div className="p-2">
        <h1 className="text-lg text-center">Time to get back to your farm?</h1>
        <div className="flex my-3 justify-center">
          <img src={bumpkin} alt="bumpkin avatar" />
        </div>
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
        <Button className="ml-1" onClick={() => navigate(-1)}>
          Continue
        </Button>
      </div>
    </Panel>
  );
};
