import React from "react";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";

export const TownEntryModal: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Panel>
      <h1 className="text-xl text-center">Time to get back to your farm?</h1>

      <p className="text-sm pt-4">
        {"Don't let these greedy goblins get all your hard earned resources."}
      </p>
      <p className="text-sm pt-4 pb-2">
        Come back to Farming Land and be safe from these intruders.
      </p>
      <Button onClick={() => navigate(-1)}>Continue</Button>
    </Panel>
  );
};
