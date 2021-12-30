import React from "react";

import { useService } from "@xstate/react";
import {
  service,
  Context,
  BlockchainEvent,
  BlockchainState,
} from "../../machine";

import speedUp from "../../images/debug/speed-up.png";
import { Panel } from "../ui/Panel";
import { Button } from "../ui/Button";

interface Props {
  code?: string;
}

const Content: React.FC<Props> = ({ code }) => {
  const [_, send] = useService<Context, BlockchainEvent, BlockchainState>(
    service
  );

  const save = () => {
    send("SAVE");
  };

  const close = () => {
    send("CLOSE");
  };

  if (code.includes("50 blocks")) {
    return (
      <div id="error-popup">
        <span id="error-title">The Blockchain is busy right now!</span>
        <span id="error-text">
          You will need to increase the gas price for this transaction to go
          through.
        </span>

        <img src={speedUp} id="error-image" />

        <span id="error-text">
          Once the transaction is succesful please refresh the page.
        </span>
      </div>
    );
  }

  return (
    <div id="error-popup">
      <span id="error-title">Oh no, something went wrong!</span>

      <span id="error-text">{code.slice(0, 200)}</span>

      <span id="error-text">
        Thanks for your patience and being an early adopter! Head over to our{" "}
        <a
          id="error-link"
          href="https://discord.com/invite/3AmWWhbfNq"
          target="_blank"
        >
          discord channel
        </a>{" "}
        and the team will try help out.
      </span>

      <span id="error-text">Otherwise, try again!</span>

      <div id="save-error-buttons">
        <Button onClick={close}>Close</Button>

        <Button onClick={save}>Try again</Button>
      </div>
    </div>
  );
};

export const SaveError: React.FC<Props> = ({ code }) => (
  <Panel>
    <div id="error">
      <Content code={code} />
    </div>
  </Panel>
);
