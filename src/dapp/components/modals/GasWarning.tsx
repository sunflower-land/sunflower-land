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
import { isNearHalvening } from "../../utils/supply";

interface Props {
  gasPrice?: number;
  supply?: number;
  action: "SYNC" | "UPGRADE";
}

export const GasWarning: React.FC<Props> = ({
  gasPrice,
  supply,
  action,
}) => {
  const [_, send] = useService<Context, BlockchainEvent, BlockchainState>(
    service
  );

  const save = () => {
    send("SAVE", { action });
  };

  let price = gasPrice / 10 ** 9;

  if (price < MINIMUM_GAS_PRICE) {
    price = MINIMUM_GAS_PRICE;
  }

  const showHalveningWarning = isNearHalvening(supply);

  return (
    <Panel>
      <div id="saving">
        <h4>Save</h4>

        {showHalveningWarning && (
          <h6 className="warning-text">
            We are approaching the halvening period. Plant and upgrade
            prices may change before your transaction is saved.{" "}
            <span className="underline"> Proceed at your own risk.</span>
          </h6>
        )}

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
