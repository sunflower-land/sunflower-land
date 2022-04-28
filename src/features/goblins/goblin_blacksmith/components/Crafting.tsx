import React, { useContext, useState } from "react";

import close from "assets/icons/close.png";

import { Panel } from "components/ui/Panel";

import { BLACKSMITH_ITEMS, TOOLS } from "features/game/types/craftables";
import * as Auth from "features/auth/lib/Provider";

import { Rare } from "./Rare";
import { useActor } from "@xstate/react";

interface Props {
  onClose: () => void;
}

export const Crafting: React.FC<Props> = ({ onClose }) => {
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

      <div
        style={{
          minHeight: "200px",
        }}
      >
        <Rare
          items={BLACKSMITH_ITEMS}
          onClose={onClose}
          hasAccess={!!authState.context.token?.userAccess.mintCollectible}
        />
      </div>
    </Panel>
  );
};
