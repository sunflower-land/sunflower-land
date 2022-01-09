import "./Pickaxe.css";

import React from "react";

import disc from "../../images/ui/disc.png";
import hammer from "../../images/ui/hammer.png";
import { Panel } from "./Panel";

interface Props {
  onClick: () => void;
  className: string;
}

export const Pickaxe: React.FC<Props> = ({ className, onClick }) => {
  return (
    <div className={`dig ${className || ""}`} onClick={onClick}>
      <div className="disc">
        <img src={disc} className="discBackground" />
        <img src={hammer} className="pickaxe" />
      </div>
      <Panel hasOuter={false}>
        <span id="upgrade">Upgrade</span>
      </Panel>
    </div>
  );
};
