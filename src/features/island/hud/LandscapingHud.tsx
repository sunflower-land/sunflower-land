import React, { useContext, useState } from "react";
import { Balance } from "components/Balance";
import { useActor } from "@xstate/react";
import * as AuthProvider from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";
import { BlockBucks } from "./components/BlockBucks";
import Decimal from "decimal.js-light";
import { DepositArgs } from "lib/blockchain/Deposit";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";

import { SUNNYSIDE } from "assets/sunnyside";
import buildingIcon from "assets/icons/building_icon.png";
import chest from "assets/icons/chest.png";
import mouse from "assets/icons/mouse.png";
import shovel from "assets/icons/shovel.png";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Box } from "components/ui/Box";

const LandscapingHudComponent: React.FC<{ isFarming: boolean }> = ({
  isFarming,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService, shortcutItem, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositDataLoaded, setDepositDataLoaded] = useState(false);

  const handleClose = () => {
    setShowDepositModal(false);
  };

  const handleDeposit = (
    args: Pick<DepositArgs, "sfl" | "itemIds" | "itemAmounts">
  ) => {
    gameService.send("DEPOSIT", args);
  };

  const isEditing = gameState.matches("editing");
  const landId = gameState.context.state.id;
  const farmAddress = authService.state.context.address as string;

  return (
    <div
      data-html2canvas-ignore="true"
      aria-label="Hud"
      className="absolute z-40"
    >
      <Balance
        farmAddress={gameState.context.state.farmAddress as string}
        onBalanceClick={() => setShowDepositModal(true)}
        balance={gameState.context.state.balance}
      />
      <BlockBucks
        blockBucks={
          gameState.context.state.inventory["Block Buck"] ?? new Decimal(0)
        }
      />
      <div
        className="fixed"
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          top: `${PIXEL_SCALE * 4}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
      >
        <img src={SUNNYSIDE.icons.disc} className="absolute w-full" />
        <img
          src={SUNNYSIDE.icons.cancel}
          className="absolute w-full"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            top: `${PIXEL_SCALE * 6}px`,
            left: `${PIXEL_SCALE * 6.5}px`,
          }}
        />
      </div>
      <div
        className="flex flex-col items-center fixed z-50"
        style={{
          right: `${PIXEL_SCALE * 1}px`,
          top: `${PIXEL_SCALE * 38}px`,
        }}
      >
        <Box isSelected image={mouse} />
        <Box image={SUNNYSIDE.icons.drag} />
        <Box image={shovel} />
      </div>
      <div className="fixed  bottom-2 w-full flex justify-center">
        <OuterPanel
          className="flex justify-center"
          style={{
            bottom: `${PIXEL_SCALE * 2}px`,
            height: `${PIXEL_SCALE * 28}px`,
          }}
        >
          <InnerPanel
            className="relative p-2 flex items-center justify-center mr-2"
            style={{
              width: `${PIXEL_SCALE * 24}px`,
            }}
          >
            <img src={buildingIcon} className="object-fit" />
          </InnerPanel>
          <InnerPanel
            className="relative p-2 flex items-center justify-center mr-2"
            style={{
              width: `${PIXEL_SCALE * 24}px`,
            }}
          >
            <img src={ITEM_DETAILS["Maneki Neko"].image} className="h-full" />
          </InnerPanel>
          <InnerPanel
            className="relative p-2 flex items-center justify-center mr-2"
            style={{
              width: `${PIXEL_SCALE * 24}px`,
            }}
          >
            <img
              src={ITEM_DETAILS["Potted Sunflower"].image}
              className="h-full"
            />
          </InnerPanel>
          <InnerPanel
            className="relative p-2 flex items-center justify-center mr-2"
            style={{
              width: `${PIXEL_SCALE * 24}px`,
            }}
          >
            <img src={chest} className="h-full  " />
          </InnerPanel>
        </OuterPanel>
      </div>
    </div>
  );
};

export const LandscapingHud = React.memo(LandscapingHudComponent);
