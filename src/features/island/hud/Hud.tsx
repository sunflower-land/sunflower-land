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
import { SUNNYSIDE } from "assets/sunnyside";
import { placeEvent } from "features/game/expansion/placeable/landscapingMachine";
import classNames from "classnames";
import { TravelButton } from "./components/deliveries/TravelButton";
import { CodexButton } from "./components/codex/CodexButton";
import { AuctionCountdown } from "features/retreat/components/auctioneer/AuctionCountdown";
import { PlaceableLocation } from "features/game/types/collectibles";
import { HudContainer } from "components/ui/HudContainer";
import { PIXEL_SCALE } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { BuyCurrenciesModal } from "./components/BuyCurrenciesModal";
import { MachineState } from "features/game/lib/gameMachine";
import { useSound } from "lib/utils/hooks/useSound";
import { SpecialEventCountdown } from "./SpecialEventCountdown";
import { SeasonBannerCountdown } from "./SeasonBannerCountdown";
import marketplaceIcon from "assets/icons/shop_disc.png";
import { hasFeatureAccess } from "lib/flags";
import { useNavigate } from "react-router-dom";
import { TransactionCountdown } from "./Transaction";
import * as AuthProvider from "features/auth/lib/Provider";

const _farmAddress = (state: MachineState) => state.context.farmAddress;
const _showMarketplace = (state: MachineState) =>
  hasFeatureAccess(state.context.state, "MARKETPLACE");

/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */
const HudComponent: React.FC<{
  isFarming: boolean;
  moveButtonsUp?: boolean;
  location: PlaceableLocation;
}> = ({ isFarming, location }) => {
  const { authService } = useContext(AuthProvider.Context);

  const { gameService, shortcutItem, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);

  const farmAddress = useSelector(gameService, _farmAddress);
  const hasMarketplaceAccess = useSelector(gameService, _showMarketplace);

  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showBuyCurrencies, setShowBuyCurrencies] = useState(false);

  const sfl = useSound("sfl");
  const button = useSound("button");

  const autosaving = gameState.matches("autosaving");

  const navigate = useNavigate();

  const handleDeposit = (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">,
  ) => {
    gameService.send("DEPOSIT", args);
  };

  const handleBuyCurrenciesModal = () => {
    sfl.play();
    setShowBuyCurrencies(!showBuyCurrencies);
  };

  const isFullUser = farmAddress !== undefined;

  return (
    <>
      <HudContainer>
        <div>
          {isFarming && (
            <div
              onClick={() => {
                button.play();
                if (isFarming) {
                  gameService.send("LANDSCAPE");
                }
              }}
              className={classNames(
                "absolute flex z-50 cursor-pointer hover:img-highlight",
                {
                  "opacity-50 cursor-not-allowed": !isFarming,
                },
              )}
              style={{
                marginLeft: `${PIXEL_SCALE * 2}px`,
                marginBottom: `${PIXEL_SCALE * 25}px`,
                width: `${PIXEL_SCALE * 22}px`,
                right: `${PIXEL_SCALE * 3}px`,
                top: `${PIXEL_SCALE * 31}px`,
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
            hideActions={false}
          />
        </div>

        <Balances
          sfl={gameState.context.state.balance}
          coins={gameState.context.state.coins}
          gems={gameState.context.state.inventory["Gem"] ?? new Decimal(0)}
          onClick={handleBuyCurrenciesModal}
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
          <TransactionCountdown />
          <AuctionCountdown />
          <SpecialEventCountdown />
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
        <BumpkinProfile isFullUser={isFullUser} />

        <DepositModal
          farmAddress={farmAddress ?? ""}
          handleClose={() => setShowDepositModal(false)}
          handleDeposit={handleDeposit}
          showDepositModal={showDepositModal}
        />
        <BuyCurrenciesModal
          show={showBuyCurrencies}
          onClose={handleBuyCurrenciesModal}
        />

        {hasMarketplaceAccess && (
          <>
            <img
              src={marketplaceIcon}
              className="cursor-pointer absolute"
              onClick={() => {
                navigate("/marketplace/hot");
              }}
              style={{
                width: `${PIXEL_SCALE * 22}px`,

                left: `${PIXEL_SCALE * 3}px`,
                bottom: `${PIXEL_SCALE * 55}px`,
              }}
            />
          </>
        )}
      </HudContainer>
    </>
  );
};

export const Hud = React.memo(HudComponent);
