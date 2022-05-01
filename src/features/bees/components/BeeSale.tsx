import React, { useContext, useState } from "react";

import close from "assets/icons/close.png";
import bee from "assets/animals/bee.png";
import hive from "assets/buildings/Beehive.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { BEES, BEE_ITEMS } from "features/game/types/craftables";
import { CraftingItems } from "features/blacksmith/components/CraftingItems";
import { Rare } from "features/blacksmith/components/Rare";
import * as Auth from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { FLOWER_SEEDS } from "features/game/types/flowers";
import { FlowerSale } from "./FlowerSale";

interface Props {
  onClose: () => void;
}

export const BeeSale: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"bees" | "buy" | "rare">("bees");
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  return (
    <Panel className="pt-5 relative">
      <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
        <div className="flex">
          <Tab isActive={tab === "bees"} onClick={() => setTab("bees")}>
            <img src={bee} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Bees</span>
          </Tab>
          <Tab isActive={tab === "buy"} onClick={() => setTab("buy")}>
            <img src={hive} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Seeds</span>
          </Tab>
          <Tab isActive={tab === "rare"} onClick={() => setTab("rare")}>
            <img src={hive} className="h-5 mr-2" />
            <span className="text-sm text-shadow">Rare</span>
          </Tab>
        </div>
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
        {tab === "bees" && <CraftingItems items={BEES} onClose={onClose} />}{" "}
        {tab === "buy" && (
          <CraftingItems items={FLOWER_SEEDS()} onClose={onClose} />
        )}
        {tab === "rare" && (
          <Rare
            items={BEE_ITEMS}
            onClose={onClose}
            // hasAccess={!!authState.context.token?.userAccess.mintCollectible}
            hasAccess={true}
          />
        )}
      </div>
    </Panel>
  );
};
