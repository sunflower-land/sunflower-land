import React, { useContext, useState } from "react";
import { Balances } from "components/Balances";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { Inventory } from "./components/inventory/Inventory";
import { BumpkinProfile } from "./components/BumpkinProfile";
import Decimal from "decimal.js-light";
import { DepositArgs } from "lib/blockchain/Deposit";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Deposit } from "features/goblins/bank/components/Deposit";
import { placeEvent } from "features/game/expansion/placeable/landscapingMachine";
import { Save } from "./components/Save";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Settings } from "./components/Settings";
import { TravelButton } from "./components/deliveries/TravelButton";
import { AuctionCountdown } from "features/retreat/components/auctioneer/AuctionCountdown";
import { CodexButton } from "./components/codex/CodexButton";
import { HudContainer } from "components/ui/HudContainer";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useLocation } from "react-router";
import { DesertDiggingDisplay } from "./components/DesertDiggingDisplay";
import { TransactionCountdown } from "./Transaction";
import { MarketplaceButton } from "./components/MarketplaceButton";
import { GameCalendar } from "features/game/expansion/components/temperateSeason/GameCalendar";

import chest from "assets/icons/chest.png";
import { LockdownWidget } from "features/announcements/AnnouncementWidgets";
import { RewardsButton } from "./components/referral/RewardsButton";
import { StreamCountdown } from "./components/StreamCountdown";
import { FloatingIslandCountdown } from "./components/FloatingIslandCountdown";
/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */
const HudComponent: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService, shortcutItem, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { openModal } = useContext(ModalContext);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositDataLoaded, setDepositDataLoaded] = useState(false);

  const { pathname } = useLocation();

  const autosaving = gameState.matches("autosaving");

  const handleCurrenciesModal = () => {
    openModal("BUY_GEMS");
  };

  const handleDepositModal = () => {
    setShowDepositModal(!showDepositModal);
  };

  const handleDeposit = (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">,
  ) => {
    gameService.send("DEPOSIT", args);
  };

  const farmAddress = gameService.state?.context?.farmAddress;
  const linkedWallet = gameService.state?.context?.linkedWallet;
  const isFullUser = farmAddress !== undefined;
  const isTutorial = gameState.context.state.island.type === "basic";

  return (
    <>
      <HudContainer>
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
          onDepositClick={() => setShowDepositModal(true)}
          isSaving={autosaving}
          isFarming={false}
          hideActions={
            pathname.includes("retreat") ||
            pathname.includes("visit") ||
            pathname.includes("dawn-breaker")
          }
        />
        {pathname.includes("beach") && <DesertDiggingDisplay />}
        <Balances
          onClick={farmAddress ? handleCurrenciesModal : undefined}
          sfl={gameState.context.state.balance}
          coins={gameState.context.state.coins}
          gems={gameState.context.state.inventory["Gem"] ?? new Decimal(0)}
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

          <StreamCountdown />

          <FloatingIslandCountdown />
          <AuctionCountdown />
          {/* <SpecialEventCountdown /> */}
        </div>
        <BumpkinProfile />
        {!isTutorial && <GameCalendar />}
        <CodexButton />
        <RewardsButton />

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
          <Settings isFarming={false} />
        </div>
        {farmAddress && linkedWallet && (
          <Modal
            show={showDepositModal}
            onHide={() => setShowDepositModal(false)}
          >
            <CloseButtonPanel
              onClose={depositDataLoaded ? handleDepositModal : undefined}
              tabs={[
                {
                  icon: chest,
                  name: t("deposit"),
                },
              ]}
            >
              <Deposit
                farmAddress={farmAddress}
                linkedWallet={linkedWallet}
                onDeposit={handleDeposit}
                onLoaded={(loaded) => setDepositDataLoaded(loaded)}
                onClose={handleDepositModal}
              />
            </CloseButtonPanel>
            <LockdownWidget />
          </Modal>
        )}
      </HudContainer>
    </>
  );
};

export const WorldHud = React.memo(HudComponent);
