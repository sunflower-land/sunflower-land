import React, { useContext, useState } from "react";
import { Balance } from "components/Balance";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { Settings } from "./components/Settings";
import { Inventory } from "./components/inventory/Inventory";
import { BumpkinProfile } from "./components/BumpkinProfile";
import { Save } from "./components/Save";
import { BlockBucks } from "./components/BlockBucks";
import Decimal from "decimal.js-light";
import { DepositArgs } from "lib/blockchain/Deposit";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Deposit } from "features/goblins/bank/components/Deposit";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { placeEvent } from "features/game/expansion/placeable/landscapingMachine";
import classNames from "classnames";
import { TravelButton } from "./components/deliveries/TravelButton";
import { CodexButton } from "./components/codex/CodexButton";
import { AuctionCountdown } from "features/retreat/components/auctioneer/AuctionCountdown";
import { getBumpkinLevel } from "features/game/lib/level";
import { CollectibleLocation } from "features/game/types/collectibles";
import { HudContainer } from "components/ui/HudContainer";
import { HalveningCountdown } from "./HalveningCountdown";
/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */
const HudComponent: React.FC<{
  isFarming: boolean;
  moveButtonsUp?: boolean;
  location: CollectibleLocation;
}> = ({ isFarming, location }) => {
  const { gameService, shortcutItem, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositDataLoaded, setDepositDataLoaded] = useState(false);

  const autosaving = gameState.matches("autosaving");

  const handleClose = () => {
    setShowDepositModal(false);
  };

  const handleDeposit = (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">
  ) => {
    gameService.send("DEPOSIT", args);
  };

  const farmAddress = gameService.state?.context?.farmAddress;
  const isFullUser = farmAddress !== undefined;

  return (
    <>
      <HudContainer>
        <div>
          {isFarming && (
            <div
              onClick={() => {
                if (isFarming) {
                  gameService.send("LANDSCAPE");
                }
              }}
              className={classNames(
                "absolute flex z-50 cursor-pointer hover:img-highlight",
                {
                  "opacity-50 cursor-not-allowed": !isFarming,
                }
              )}
              style={{
                marginLeft: `${PIXEL_SCALE * 2}px`,
                marginBottom: `${PIXEL_SCALE * 25}px`,
                width: `${PIXEL_SCALE * 22}px`,
                right: `${PIXEL_SCALE * 3}px`,
                top: `${PIXEL_SCALE * 38}px`,
              }}
            >
              <img
                src={SUNNYSIDE.ui.round_button}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 22}px`,
                }}
              />
              <img
                src={SUNNYSIDE.icons.drag}
                className={"absolute"}
                style={{
                  top: `${PIXEL_SCALE * 4}px`,
                  left: `${PIXEL_SCALE * 4}px`,
                  width: `${PIXEL_SCALE * 14}px`,
                }}
              />
            </div>
          )}
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
          />
        </div>

        <Balance
          onBalanceClick={() => setShowDepositModal(true)}
          balance={gameState.context.state.balance}
        />
        <BlockBucks
          blockBucks={
            gameState.context.state.inventory["Block Buck"] ?? new Decimal(0)
          }
        />

        <div
          className="absolute z-50 flex flex-col justify-between"
          style={{
            left: `${PIXEL_SCALE * 3}px`,
            bottom: `${PIXEL_SCALE * 3}px`,
            width: `${PIXEL_SCALE * 22}px`,
            height: `${PIXEL_SCALE * 23 * 2 + 8}px`,
          }}
        >
          <CodexButton />
          <TravelButton />
        </div>

        <div
          className="absolute z-50 flex flex-col justify-between"
          style={{
            bottom: `${PIXEL_SCALE * 3}px`,
            left: `${PIXEL_SCALE * 28}px`,
          }}
        >
          <AuctionCountdown />
          <HalveningCountdown />
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
        <BumpkinProfile isFullUser={isFullUser} />

        <Modal show={showDepositModal} onHide={handleClose}>
          <CloseButtonPanel
            onClose={depositDataLoaded ? handleClose : undefined}
          >
            <Deposit
              farmAddress={gameState.context.farmAddress ?? ""}
              onDeposit={handleDeposit}
              onLoaded={(loaded) => setDepositDataLoaded(loaded)}
              onClose={handleClose}
              canDeposit={
                getBumpkinLevel(
                  gameState.context.state.bumpkin?.experience ?? 0
                ) >= 3
              }
            />
          </CloseButtonPanel>
        </Modal>
      </HudContainer>
    </>
  );
};

export const Hud = React.memo(HudComponent);
