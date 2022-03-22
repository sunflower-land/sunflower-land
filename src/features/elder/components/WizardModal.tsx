import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";
import Decimal from "decimal.js-light";

import token from "assets/icons/token.gif";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import * as Auth from "features/auth/lib/Provider";

import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { Craftable } from "features/game/types/craftables";
import { InventoryItemName } from "features/game/types/game";
import { metamask } from "lib/blockchain/metamask";
import { ItemSupply } from "lib/blockchain/Inventory";


interface Props {
  onClose: () => void;
  items?: Partial<Record<InventoryItemName, Craftable>>;
}

export const WizardModal
: React.FC<Props> = ({   }) => {
 
  return (
    <div className="flex">
      Loading...
    </div>
  );
};
