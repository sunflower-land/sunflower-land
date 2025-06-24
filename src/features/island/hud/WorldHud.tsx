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
import { placeEvent } from "features/game/expansion/placeable/landscapingMachine";
import { Save } from "./components/Save";
import { Settings } from "./components/Settings";
import { TravelButton } from "./components/deliveries/TravelButton";
import { AuctionCountdown } from "features/retreat/components/auctioneer/AuctionCountdown";
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
import { WorldFeed } from "features/social/WorldFeed";
import { isMobile } from "mobile-device-detect";
import { dummyInteractions } from "features/social/PlayerModal";
import { hasFeatureAccess } from "lib/flags";
import { WorldFeedButton } from "features/social/components/WorldFeedButton";
import { MachineState } from "features/game/lib/gameMachine";
import { WorldContext } from "features/world/World";
import {
  Message,
  ModerationTools,
  Player,
} from "features/world/ui/moderationTools/ModerationTools";
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

const _isModerator = (state: MachineState) =>
  !!state.context.state.inventory["Beta Pass"] &&
  !!state.context.state.wardrobe.Halo;
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
  const { isCommunity } = useContext(WorldContext);
  const { gameService, shortcutItem, selectedItem } = useContext(Context);
  const { openModal } = useContext(ModalContext);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositDataLoaded, setDepositDataLoaded] = useState(false);
  const [showFeed, setShowFeed] = useState(false);

  const autosaving = useSelector(gameService, _autosaving);
  const farmAddress = useSelector(gameService, _farmAddress);
  const linkedWallet = useSelector(gameService, _linkedWallet);
  const isTutorial = useSelector(gameService, _isTutorial);
  const isModerator = useSelector(gameService, _isModerator);
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
      {hasFeatureAccess(state, "SOCIAL_FARMING") && (
        <WorldFeed
          server={server}
          showFeed={showFeed}
          setShowFeed={setShowFeed}
          interactions={dummyInteractions}
        />
      )}
      <HudContainer>
        <div className="flex w-screen h-screen">
          {/* Handle translation of left side of the HUD */}
          <div
            className={classNames(
              "flex justify-between transition-transform w-full h-full p-3 duration-300",
              {
                "translate-x-0": hideDesktopFeed,
                "translate-x-[300px]": showDesktopFeed,
              },
            )}
          >
            {/* Left side of the HUD */}
            <div className="flex flex-col justify-between">
              <HudBumpkin isTutorial={isTutorial} />
              <div className="flex space-x-2.5">
                <div className="flex flex-col space-y-2.5">
                  {/* {isModerator && !isCommunity && ( */}
                  <ModerationTools
                    scene={scene}
                    messages={messages ?? []}
                    players={players ?? []}
                    gameService={gameService}
                  />
                  {/* )} */}
                  {hasFeatureAccess(state, "SOCIAL_FARMING") && (
                    <WorldFeedButton
                      showFeed={showFeed}
                      setShowFeed={setShowFeed}
                      newCount={0}
                    />
                  )}
                  <MarketplaceButton />
                  <TravelButton />
                </div>
                <div className="flex flex-col justify-end space-y-2.5">
                  <TransactionCountdown />
                  <StreamCountdown />
                  <FloatingIslandCountdown />
                  <AuctionCountdown />
                </div>
              </div>
            </div>
          </div>

          {/* Right side of the HUD*/}
          <div className="fixed top-0 bottom-0 right-0 flex flex-col justify-between items-end p-3">
            <div className="flex flex-col space-y-2.5">
              <Balances
                onClick={farmAddress ? handleCurrenciesModal : undefined}
                sfl={state.balance}
                coins={state.coins}
                gems={state.inventory["Gem"] ?? new Decimal(0)}
              />
              <Inventory
                state={state}
                isFullUser={!!farmAddress}
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
            </div>
            <div className="flex flex-col space-y-2.5">
              <Save />
              <Settings isFarming={false} />
            </div>
          </div>
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
