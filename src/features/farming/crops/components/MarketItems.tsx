import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import seeds from "assets/icons/seeds.png";
import sunflowerPlant from "assets/crops/sunflower/crop.png";
import close from "assets/icons/close.png";
import goldenCauliflower from "assets/nfts/golden_cauliflower.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";

import { Rare } from "features/goblins/Rare";
import { MARKET_ITEMS } from "features/game/types/craftables";
import * as Auth from "features/auth/lib/Provider";
import { Seeds } from "./Seeds";
import { Plants } from "./Plants";

interface Props {
  onClose: () => void;
}

export const MarketItems: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"buy" | "sell" | "rare">("buy");
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const handleTabClick = (tab: "buy" | "sell" | "rare") => {
    setTab(tab);
  };

  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive={tab === "buy"} onClick={() => handleTabClick("buy")}>
            <img src={seeds} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Buy</span>
          </Tab>
          <Tab isActive={tab === "sell"} onClick={() => handleTabClick("sell")}>
            <img src={sunflowerPlant} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Sell</span>
          </Tab>
          <Tab isActive={tab === "rare"} onClick={() => handleTabClick("rare")}>
            <img src={goldenCauliflower} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Rare</span>
          </Tab>
        </div>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1"
          onClick={onClose}
        />
      </div>

      {tab === "buy" && <Seeds onClose={onClose} />}
      {tab === "sell" && <Plants />}
      {tab === "rare" && (
        <Rare
          items={MARKET_ITEMS}
          onClose={onClose}
          hasAccess={!!authState.context.token?.userAccess.mintCollectible}
        />
      )}
    </Panel>
  );
};
