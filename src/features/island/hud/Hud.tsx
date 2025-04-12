/* eslint-disable react/jsx-no-undef */
import React, { useContext, useState } from "react";
import { Balances } from "components/Balances";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { Settings } from "./components/Settings";
import { Inventory } from "./components/inventory/Inventory";
import { BumpkinProfile } from "./components/BumpkinProfile";
import { Save } from "./components/Save";
import { DepositArgs } from "lib/blockchain/Deposit";
import { DepositModal } from "features/goblins/bank/components/Deposit";
import { placeEvent } from "features/game/expansion/placeable/landscapingMachine";
import { TravelButton } from "./components/deliveries/TravelButton";
import { CodexButton } from "./components/codex/CodexButton";
import { AuctionCountdown } from "features/retreat/components/auctioneer/AuctionCountdown";
import { PlaceableLocation } from "features/game/types/collectibles";
import { HudContainer } from "components/ui/HudContainer";
import { PIXEL_SCALE } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { CurrenciesModal } from "./components/CurrenciesModal";
import { MachineState } from "features/game/lib/gameMachine";
import { useSound } from "lib/utils/hooks/useSound";
import { SeasonBannerCountdown } from "./SeasonBannerCountdown";
import { TransactionCountdown } from "./Transaction";
import { MarketplaceButton } from "./components/MarketplaceButton";
import { GameCalendar } from "features/game/expansion/components/temperateSeason/GameCalendar";
import { LandscapeButton } from "./components/LandscapeButton";
import { RewardsButton } from "./components/referral/RewardsButton";

const _farmAddress = (state: MachineState) => state.context.farmAddress;
const _linkedWallet = (state: MachineState) => state.context.linkedWallet;

/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */
const HudComponent: React.FC<{
  isFarming: boolean;
  moveButtonsUp?: boolean;
  location: PlaceableLocation;
}> = ({ isFarming, location }) => {
  const { gameService, shortcutItem, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);

  const farmAddress = useSelector(gameService, _farmAddress);
  const linkedWallet = useSelector(gameService, _linkedWallet);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showBuyCurrencies, setShowBuyCurrencies] = useState(false);

  const sfl = useSound("sfl");

  const autosaving = gameState.matches("autosaving");

  const handleDeposit = (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">,
  ) => {
    gameService.send("DEPOSIT", args);
  };

  const handleCurrenciesModal = () => {
    sfl.play();
    setShowBuyCurrencies(!showBuyCurrencies);
  };

  const isFullUser = farmAddress !== undefined;
  const isTutorial = gameState.context.state.island.type === "basic";

  return (
    <>
      <HudContainer>
        <div>
          {isFarming && <LandscapeButton />}
          <Inventory
            state={gameState.context.state}
            isFullUser={isFullUser}
            shortcutItem={shortcutItem}
            selectedItem={selectedItem}
            onPlace={(selected) => {
              gameService.send("LANDSCAPE", {
                action: placeEvent(selected),
                placeable: selected,
                multiple: true,
              });
            }}
            onPlaceBud={(selected) => {
              gameService.send("LANDSCAPE", {
                action: "bud.placed",
                placeable: selected,
                location,
              });
            }}
            onDepositClick={() => setShowDepositModal(true)}
            isSaving={autosaving}
            isFarming={isFarming}
            hideActions={false}
          />
        </div>
        <Balances
          sfl={gameState.context.state.balance}
          coins={gameState.context.state.coins}
          gems={gameState.context.state.inventory["Gem"] ?? new Decimal(0)}
          onClick={handleCurrenciesModal}
        />
        <div
          className="absolute z-50 flex flex-col space-y-2.5 justify-between"
          style={{
            left: `${PIXEL_SCALE * 3}px`,
            bottom: `${PIXEL_SCALE * 3}px`,
            width: `${PIXEL_SCALE * 22}px`,
          }}
        >
          <MarketplaceButton />
          <TravelButton />
        </div>
        <div
          className="absolute z-50 flex flex-col justify-between"
          style={{
            bottom: `${PIXEL_SCALE * 3}px`,
            left: `${PIXEL_SCALE * 28}px`,
          }}
        >
          <TransactionCountdown />
          <AuctionCountdown />
          {/* <SpecialEventCountdown /> */}
          <SeasonBannerCountdown />
        </div>
        <div
          className="absolute z-50 flex flex-col justify-between"
          style={{
            right: `${PIXEL_SCALE * 3}px`,
            bottom: `${PIXEL_SCALE * 3}px`,
            width: `${PIXEL_SCALE * 22}px`,
            height: `${PIXEL_SCALE * 23 * 2 + 8}px`,
          }}
        >
          <Save />
          <Settings isFarming={isFarming} />
        </div>

        <BumpkinProfile />
        {!isTutorial && <GameCalendar />}
        <CodexButton />
        <RewardsButton />

        <DepositModal
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
    </>
  );
};

export const Hud = React.memo(HudComponent);
