import React from "react";
import { useService } from "@xstate/react";
import {
  service,
  Context,
  BlockchainEvent,
  BlockchainState,
} from "../../machine";

import { Panel } from "../ui/Panel";
import { Button } from "../ui/Button";
import { MINIMUM_GAS_PRICE } from "../../Blockchain";
import exclamation from "../../images/ui/expression_alerted.png";

import "./Saving.css";

interface Props {
  gasPrice?: number;
}

export const GasWarning: React.FC<Props> = ({ gasPrice }) => {
  const [_, send] = useService<Context, BlockchainEvent, BlockchainState>(
    service
  );

  const save = () => {
    send("SAVE");
  };

  let price = gasPrice / 10 ** 9;

  if (price < MINIMUM_GAS_PRICE) {
    price = MINIMUM_GAS_PRICE;
  }

  return (
    <Panel>
      <div id="saving">
        <h4>Save</h4>

        <h6 className="warning-text">
          Each time you save your farm to the Blockchain you must spend 'gas'.
        </h6>

        <h6 className="warning-text">
          The gas price changes based on how busy the Blockchain is.
        </h6>

        <h6 className="warning-text">
          Before confirming your transaction ensure the gas price is high enough
          to succeed.
        </h6>

        <h6 className="warning-text">Recommended gas price: </h6>

        <h2 style={{ display: "inline-block" }}>{price}</h2>
        <h6 className="warning-text" style={{ display: "inline-block" }}>
          GWEI
        </h6>

        <a
          href="https://metamask.zendesk.com/hc/en-us/articles/360015488771-How-to-adjust-Gas-Price-and-Gas-Limit"
          target="_blank"
        >
          <h3 className="current-price-supply-demand">Read more</h3>
        </a>

        <div id="save-error-buttons">
          <Button onClick={save}>Continue</Button>
        </div>
      </div>
    </Panel>
  );
};
