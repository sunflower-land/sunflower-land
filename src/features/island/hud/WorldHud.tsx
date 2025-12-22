import React, { useContext, useState } from "react";
import { Balances } from "components/Balances";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { Inventory } from "./components/inventory/Inventory";
import Decimal from "decimal.js-light";
import { DepositArgs } from "lib/blockchain/Deposit";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { DepositGameItems } from "features/goblins/bank/components/DepositGameItems";
import { Save } from "./components/Save";
import { Settings } from "./components/Settings";
import { TravelButton } from "./components/deliveries/TravelButton";
import { AuctionCountdown } from "features/retreat/components/auctioneer/AuctionCountdown";
import { VersionUpdateWidget } from "./components/VersionUpdateWidget";
import { HudContainer } from "components/ui/HudContainer";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useLocation } from "react-router";
import { TransactionCountdown } from "./Transaction";
import { MarketplaceButton } from "./components/MarketplaceButton";

import chest from "assets/icons/chest.png";
import { StreamCountdown } from "./components/streamCountdown/StreamCountdown";
import { FloatingIslandCountdown } from "./components/FloatingIslandCountdown";
import { HudBumpkin } from "./components/bumpkinProfile/HudBumpkin";
import classNames from "classnames";
import { Feed } from "features/social/Feed";
import { isMobile } from "mobile-device-detect";
import { hasFeatureAccess } from "lib/flags";
import { WorldFeedButton } from "features/social/components/WorldFeedButton";
import { MachineState } from "features/game/lib/gameMachine";
import {
  Message,
  ModerationTools,
  Player,
} from "features/world/ui/moderationTools/ModerationTools";
import { DesertDiggingDisplay } from "./components/DesertDiggingDisplay";
/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */

type Props = {
  scene: string;
  server?: string;
  messages: Message[];
  players: Player[];
};

const _autosaving = (state: MachineState) => state.matches("autosaving");
const _farmAddress = (state: MachineState) => state.context.farmAddress;
const _linkedWallet = (state: MachineState) => state.context.linkedWallet;
const _isTutorial = (state: MachineState) =>
  state.context.state.island.type === "basic";
const _state = (state: MachineState) => state.context.state;

const HudComponent: React.FC<Props> = ({
  server,
  scene,
  messages,
  players,
}) => {
  const { t } = useAppTranslation();
  const { gameService, shortcutItem, selectedItem } = useContext(Context);
  const { openModal } = useContext(ModalContext);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositDataLoaded, setDepositDataLoaded] = useState(false);
  const [showFeed, setShowFeed] = useState(false);

  const autosaving = useSelector(gameService, _autosaving);
  const farmAddress = useSelector(gameService, _farmAddress);
  const linkedWallet = useSelector(gameService, _linkedWallet);
  const isTutorial = useSelector(gameService, _isTutorial);
  const state = useSelector(gameService, _state);

  const { pathname } = useLocation();

  const handleCurrenciesModal = () => {
    openModal("BUY_GEMS");
  };

  const handleDepositModal = () => {
    setShowDepositModal(!showDepositModal);
  };

  const handleDeposit = (
    args: Pick<DepositArgs, "itemIds" | "itemAmounts">,
  ) => {
    gameService.send("DEPOSIT", args);
  };

  const showDesktopFeed = showFeed && !isMobile;
  const hideDesktopFeed = !showFeed && !isMobile;

  return (
    <>
      <Feed
        type="world"
        server={server}
        showFeed={showFeed}
        setShowFeed={setShowFeed}
      />
      <HudContainer>
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
        {/* Left side of the HUD with translation */}

        <div
          className={classNames(
            "absolute bottom-0 p-2.5 left-0 flex flex-col space-y-2.5 transition-transform",
            {
              "translate-x-0": hideDesktopFeed,
              "translate-x-[320px]": showDesktopFeed,
            },
          )}
        >
          {hasFeatureAccess(state, "MODERATOR") && (
            <ModerationTools
              scene={scene}
              messages={messages ?? []}
              players={players ?? []}
              gameService={gameService}
            />
          )}
          <WorldFeedButton showFeed={showFeed} setShowFeed={setShowFeed} />
          <MarketplaceButton />
          <TravelButton />
        </div>

        {pathname.includes("beach") && <DesertDiggingDisplay />}

        <div
          className={classNames(
            "absolute bottom-0 pb-2 pl-3 left-16 flex flex-col space-y-2.5 transition-transform",
            {
              "translate-x-0": hideDesktopFeed,
              "translate-x-[320px]": showDesktopFeed,
            },
          )}
        >
          <TransactionCountdown />
          <StreamCountdown />
          <FloatingIslandCountdown />
          <AuctionCountdown />
          <VersionUpdateWidget />
        </div>

        {/* Right side of the HUD*/}

        <div className="absolute right-0 top-0 p-2.5">
          <Balances
            onClick={farmAddress ? handleCurrenciesModal : undefined}
            sfl={state.balance}
            coins={state.coins}
            gems={state.inventory["Gem"] ?? new Decimal(0)}
          />
        </div>

        <div className="absolute right-0 top-16 p-2.5">
          <Inventory
            state={state}
            isFullUser={!!farmAddress}
            shortcutItem={shortcutItem}
            selectedItem={selectedItem}
            onDepositClick={() => setShowDepositModal(true)}
            isSaving={autosaving}
            isFarming={false}
            hideActions={
              pathname.includes("retreat") ||
              pathname.includes("visit") ||
              pathname.includes("dawn-breaker")
            }
          />
        </div>

        <div className="absolute bottom-0 p-2.5 right-0 flex flex-col space-y-2.5">
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
              <DepositGameItems
                farmAddress={farmAddress}
                linkedWallet={linkedWallet}
                onDeposit={handleDeposit}
                onLoaded={(loaded) => setDepositDataLoaded(loaded)}
                onClose={handleDepositModal}
              />
            </CloseButtonPanel>
          </Modal>
        )}
      </HudContainer>
    </>
  );
};

export const WorldHud = React.memo(HudComponent);
