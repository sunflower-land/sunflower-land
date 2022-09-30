import React from "react";

import close from "assets/icons/close.png";
import token from "assets/icons/token_2.png";

import { Tab } from "components/ui/Tab";
import classNames from "classnames";

interface TabsProps {
  disabled: boolean;
  isSelling: boolean;
  setIsSelling: (selling: boolean) => void;
  onClose: () => void;
}

export const Tabs: React.FC<TabsProps> = ({
  disabled,
  isSelling,
  setIsSelling,
  onClose,
}) => (
  <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
    <div className="flex">
      <Tab
        className={classNames("flex items-center", {
          "cursor-pointer": !disabled,
          "cursor-not-allowed": disabled,
        })}
        isActive={isSelling}
        onClick={!disabled ? () => setIsSelling(true) : undefined}
      >
        <img src={token} className="h-4 sm:h-5 mr-2" />
        <span className="text-sm overflow-hidden text-ellipsis">Sell</span>
      </Tab>
      <Tab
        className={classNames("flex items-center", {
          "cursor-pointer": !disabled,
          "cursor-not-allowed": disabled,
        })}
        isActive={!isSelling}
        onClick={!disabled ? () => setIsSelling(false) : undefined}
      >
        <img src={token} className="h-4 sm:h-5 mr-2" />
        <span className="text-sm overflow-hidden text-ellipsis">Buy</span>
      </Tab>
    </div>
    <img
      src={close}
      className={classNames("h-6 mr-2 mb-1", {
        "cursor-pointer": !disabled,
        "cursor-not-allowed": disabled,
      })}
      onClick={!disabled ? onClose : undefined}
    />
  </div>
);
