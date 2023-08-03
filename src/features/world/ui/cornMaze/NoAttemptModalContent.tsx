import React from "react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";

interface Props {
  onClick: () => void;
}

export const NoActiveAttemptContent: React.FC<Props> = ({ onClick }) => {
  return (
    <Panel
      bumpkinParts={{
        ...NPC_WEARABLES.luna,
        body: "Light Brown Worried Farmer Potion",
      }}
    >
      <>
        <div className="p-1 pt-2 space-y-2 mb-2">
          <p>
            {` Hey there cheeky Bumpkin. I don't remember granting you access via
            the portal!`}
          </p>
          <p>
            {`In order to start helping me find my crows, you need to visit me in
            the Plaza. I'll be waiting for you there.`}
          </p>
        </div>
        {<Button onClick={onClick}>Return to Plaza</Button>}
      </>
    </Panel>
  );
};
