import "./Saving.css";

import React from "react";

import person from "../../images/characters/crafting.gif";
import { Panel } from "../ui/Panel";

export const Crafting: React.FC = () => (
  <Panel>
    <div id="saving">
      <h4>Crafting...</h4>
      <h6>
        Miners are working hard to save your items to the blockchain.
      </h6>

      <div id="mining-animation">
        <img id="crafting-gif" src={person} />
      </div>

      <span>Increase the gas price for faster transactions</span>
    </div>
  </Panel>
);
