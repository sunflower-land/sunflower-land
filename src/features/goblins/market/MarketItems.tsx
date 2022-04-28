import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";

import { Rare } from "features/farming/blacksmith/components/Rare";
import { MARKET_ITEMS } from "features/game/types/craftables";
import * as Auth from "features/auth/lib/Provider";

interface Props {
  onClose: () => void;
}

export const MarketItems: React.FC<Props> = ({ onClose }) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>

      <Rare
        items={MARKET_ITEMS}
        onClose={onClose}
        hasAccess={!!authState.context.token?.userAccess.mintCollectible}
      />
    </Panel>
  );
};
