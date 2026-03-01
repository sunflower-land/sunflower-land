/* eslint-disable react/jsx-no-undef */
import React, { useContext, useState } from "react";
import { Balances } from "components/Balances";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { Settings } from "./components/Settings";
import { Inventory } from "./components/inventory/Inventory";
import { Save } from "./components/Save";
import { DepositArgs } from "lib/blockchain/Deposit";
import { DepositGameItemsModal } from "features/goblins/bank/components/DepositGameItems";
import { placeEvent } from "features/game/expansion/placeable/landscapingMachine";
import { TravelButton } from "./components/deliveries/TravelButton";
import { AuctionCountdown } from "features/retreat/components/auctioneer/AuctionCountdown";
import { VersionUpdateWidget } from "./components/VersionUpdateWidget";
import { PlaceableLocation } from "features/game/types/collectibles";
import { HudContainer } from "components/ui/HudContainer";
import Decimal from "decimal.js-light";
import { CurrenciesModal } from "./components/CurrenciesModal";
import { MachineState } from "features/game/lib/gameMachine";
import { useSound } from "lib/utils/hooks/useSound";
import { TransactionCountdown } from "./Transaction";
import { MarketplaceButton } from "./components/MarketplaceButton";
import { LandscapeButton } from "./components/LandscapeButton";
import { StreamCountdown } from "./components/streamCountdown/StreamCountdown";
import { HudBumpkin } from "./components/bumpkinProfile/HudBumpkin";
import { WorldFeedButton } from "features/social/components/WorldFeedButton";
import classNames from "classnames";
import { isMobile } from "mobile-device-detect";
import { Feed } from "features/social/Feed";
import { RaffleWidget } from "features/retreat/components/auctioneer/RaffleWidget";

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
  const [showFeed, setShowFeed] = useState(false);

  const sfl = useSound("sfl");

  const autosaving = gameState.matches("autosaving");

  const handleDeposit = (
    args: Pick<DepositArgs, "itemIds" | "itemAmounts">,
  ) => {
    gameService.send("DEPOSIT", args);
  };

  const handleCurrenciesModal = () => {
    sfl.play();
    setShowBuyCurrencies(!showBuyCurrencies);
  };

  const isFullUser = farmAddress !== undefined;
  const isTutorial = gameState.context.state.island.type === "basic";

  const showDesktopFeed = showFeed && !isMobile;
  const hideDesktopFeed = !showFeed && !isMobile;

  return (
    <HudContainer>
      <Feed type="world" showFeed={showFeed} setShowFeed={setShowFeed} />
      <div
        className={classNames(
          "absolute left-0 top-0 bottom-0 p-2.5 transition-transform duration-200",
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
        <MarketplaceButton />
        <TravelButton />
      </div>
      <div className="absolute bottom-0 pb-2 pl-3 left-16 flex flex-col space-y-2.5">
        <RaffleWidget />
        <TransactionCountdown />
        <StreamCountdown />
        <AuctionCountdown />
        <VersionUpdateWidget />
      </div>

      {/* Right side of the HUD */}
      <div className="absolute right-0 top-0 p-2.5">
        <Balances
          sfl={gameState.context.state.balance}
          coins={gameState.context.state.coins}
          gems={gameState.context.state.inventory["Gem"] ?? new Decimal(0)}
          onClick={handleCurrenciesModal}
        />
      </div>
      <div className="absolute right-0 top-16 p-2.5 flex flex-col space-y-2.5">
        {isFarming && <LandscapeButton />}
        <Inventory
          state={gameState.context.state}
          isFullUser={isFullUser}
          shortcutItem={shortcutItem}
          selectedItem={selectedItem}
          onPlace={(selected) => {
            gameService.send("LANDSCAPE", {
              action: placeEvent(selected),
              placeable: { name: selected },
              multiple: true,
            });
          }}
          onPlaceNFT={(id, nft) => {
            gameService.send("LANDSCAPE", {
              action: "nft.placed",
              placeable: { id, name: nft },
              location,
            });
          }}
          onPlaceFarmHand={(id) => {
            gameService.send("LANDSCAPE", {
              action: "farmHand.placed",
              placeable: { name: "FarmHand", id },
              multiple: true,
            });
          }}
          onDepositClick={() => setShowDepositModal(true)}
          isSaving={autosaving}
          isFarming={isFarming}
          hideActions={false}
          location={location}
        />
      </div>

      <div className="absolute bottom-0 p-2 right-0 flex flex-col space-y-2.5">
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

export const Hud = React.memo(HudComponent);
