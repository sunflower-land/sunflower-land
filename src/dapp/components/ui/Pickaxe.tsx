import React from "react";

import "./Pickaxe.css";
import { Panel } from "./Panel";
import disc from "../../images/ui/disc.png";
import hammer from "../../images/ui/hammer.png";
import {
  BlockchainEvent,
  BlockchainState,
  Context,
  service,
} from "../../machine";
import { useService } from "@xstate/react";
interface Props {
  onClick: () => void;
}
export const Pickaxe: React.FC<Props> = ({ className, onClick }) => {
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);

  return (
    !machineState.matches("exploring") && (
      <div className={`dig ${className || ""}`} onClick={onClick}>
        <>
          <div className="disc">
            <img src={disc} className="discBackground" />
            <img src={hammer} className="pickaxe" />
          </div>
          <Panel hasOuter={false}>
            <span id="upgrade">Upgrade</span>
          </Panel>
        </>
      </div>
    )
  );
};
