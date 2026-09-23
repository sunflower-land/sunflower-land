import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";
import classNames from "classnames";
import { isMobile } from "mobile-device-detect";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { DepositArgs } from "lib/blockchain/Deposit";
import {
  getPowerSkills,
  type BumpkinRevampSkillName,
} from "features/game/types/bumpkinSkills";

import { HudContainer } from "components/ui/HudContainer";
import { Balances } from "components/Balances";
import { Inventory } from "features/island/hud/components/inventory/Inventory";
import { Save } from "features/island/hud/components/Save";
import { Settings } from "features/island/hud/components/Settings";
import { CurrenciesModal } from "features/island/hud/components/CurrenciesModal";
import { HudBumpkin } from "features/island/hud/components/bumpkinProfile/HudBumpkin";
import { MarketplaceButton } from "features/island/hud/components/MarketplaceButton";
import { PowerSkillsButton } from "features/island/hud/components/PowerSkillsButton";
import { TravelButton } from "features/island/hud/components/deliveries/TravelButton";
import { DepositGameItemsModal } from "features/goblins/bank/components/DepositGameItems";
import { Feed } from "features/social/Feed";
import { WorldFeedButton } from "features/social/components/WorldFeedButton";

const _autosaving = (state: MachineState) => state.matches("autosaving");
const _farmAddress = (state: MachineState) => state.context.farmAddress;
const _linkedWallet = (state: MachineState) => state.context.linkedWallet;
const _state = (state: MachineState) => state.context.state;
const _isTutorial = (state: MachineState) =>
  state.context.state.island.type === "basic";

/**
 * A pared-down HUD for the Cave interior: the standard basics (Bumpkin,
 * balances, inventory, save, settings) plus the bottom-left button cluster
 * (feed, power skills, marketplace, travel). The Travel button opens the world
 * map — the in-room ladder still leaves straight back to the farm.
 */
const CaveHudComponent: React.FC = () => {
  const { gameService, shortcutItem, selectedItem } = useContext(Context);

  const autosaving = useSelector(gameService, _autosaving);
  const farmAddress = useSelector(gameService, _farmAddress);
  const linkedWallet = useSelector(gameService, _linkedWallet);
  const state = useSelector(gameService, _state);
  const isTutorial = useSelector(gameService, _isTutorial);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showBuyCurrencies, setShowBuyCurrencies] = useState(false);
  const [showFeed, setShowFeed] = useState(false);

  const handleDeposit = (
    args: Pick<DepositArgs, "itemIds" | "itemAmounts">,
  ) => {
    gameService.send("DEPOSIT", args);
  };

  const handleCurrenciesModal = () => setShowBuyCurrencies((show) => !show);

  const hasPowerSkills = getPowerSkills().some(
    (skill) => !!state.bumpkin.skills[skill.name as BumpkinRevampSkillName],
  );

  const showDesktopFeed = showFeed && !isMobile;
  const hideDesktopFeed = !showFeed && !isMobile;

  return (
    <HudContainer>
      <Feed type="world" showFeed={showFeed} setShowFeed={setShowFeed} />

      <div
        className={classNames(
          "absolute left-0 top-0 p-2.5 transition-transform duration-200",
          {
            "translate-x-0": hideDesktopFeed,
            "translate-x-[320px]": showDesktopFeed,
          },
        )}
      >
        <HudBumpkin isTutorial={isTutorial} />
      </div>

      <div
        className={classNames(
          "absolute bottom-0 p-2.5 left-0 flex flex-col space-y-2.5 transition-transform",
          {
            "translate-x-0": hideDesktopFeed,
            "translate-x-[320px]": showDesktopFeed,
          },
        )}
      >
        <WorldFeedButton showFeed={showFeed} setShowFeed={setShowFeed} />
        {hasPowerSkills && <PowerSkillsButton />}
        <MarketplaceButton />
        <TravelButton />
      </div>

      <div className="absolute right-0 top-0 p-2.5">
        <Balances
          sfl={state.balance}
          coins={state.coins}
          gems={state.inventory["Gem"] ?? new Decimal(0)}
          onClick={farmAddress ? handleCurrenciesModal : undefined}
        />
      </div>

      <div className="absolute right-0 top-16 p-2.5">
        <Inventory
          state={state}
          isFullUser={farmAddress !== undefined}
          shortcutItem={shortcutItem}
          selectedItem={selectedItem}
          onDepositClick={() => setShowDepositModal(true)}
          isSaving={autosaving}
          isFarming={false}
          hideActions={false}
        />
      </div>

      <div className="absolute bottom-0 p-2.5 right-0 flex flex-col space-y-2.5">
        <Save />
        <Settings isFarming={false} />
      </div>

      <DepositGameItemsModal
        farmAddress={farmAddress ?? ""}
        linkedWallet={linkedWallet ?? ""}
        handleClose={() => setShowDepositModal(false)}
        handleDeposit={handleDeposit}
        showDepositModal={showDepositModal}
      />

      <CurrenciesModal
        show={showBuyCurrencies}
        onClose={handleCurrenciesModal}
      />
    </HudContainer>
  );
};

export const CaveHud = React.memo(CaveHudComponent);
