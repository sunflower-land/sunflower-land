import React from "react";

import disc from "assets/icons/disc.png";
import { InnerPanel } from "./Panel";
import classNames from "classnames";

interface Props {
  text: string;
  icon: any;
  onClick: () => void;
  className: string;
}

export const Action: React.FC<Props> = ({ text, icon, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className={classNames("cursor-pointer", className)}
      data-html2canvas-ignore="false"
    >
      <div className="absolute w-10 h-10 -left-2 -top-1 flex items-center justify-center">
        <img src={disc} className="w-full absolute inset-0" />
        <img src={icon} className="w-2/3 z-10" />
      </div>
      <InnerPanel className="text-white text-shadow text-xs w-fit">
        <span className="pl-7">{text}</span>
      </InnerPanel>
    </div>
  );
};
