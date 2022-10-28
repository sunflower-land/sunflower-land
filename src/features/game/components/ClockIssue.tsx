import React, { useState } from "react";

import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";
import { Button } from "components/ui/Button";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

interface Props {
  show: boolean;
}
export const ClockIssue: React.FC<Props> = ({ show }) => {
  const [hidden, setHidden] = useState(false);

  return (
    <Modal show={show && !hidden} centered>
      <Panel>
        <div className="flex flex-col items-center text-center p-2">
          <span>Clock not in sync</span>
          <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />
          <span className="text-xs">
            Uh oh, it looks like your clock is not in sync with the game. Set
            date and time to automatic to avoid disruptions
          </span>
          <Button className="mt-2" onClick={() => setHidden(true)}>
            Continue
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
