import { SUNNYSIDE } from "assets/sunnyside";
import React, { useContext } from "react";
import sflIcon from "assets/icons/sfl.webp";
import { MarketplaceNavigation } from "./components/MarketplaceHome";
import { useLocation, useNavigate } from "react-router";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { OuterPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { MarketplaceIntroduction } from "./components/MarketplaceIntroduction";
import { formatNumber } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/decorations";

const _balance = (state: MachineState) => state.context.state.balance;

const _tmpDelta = (state: MachineState) => {
  const inventory = state.context.state.inventory;
  const previousInventory = state.context.state.previousInventory || {};
  const wardrobe = state.context.state.wardrobe || {};
  const previousWardrobe = state.context.state.previousWardrobe || {};
  const balance = state.context.state.balance;
  const previousBalance = state.context.state.previousBalance || new Decimal(0);

  let result = "";

  const items = new Set([...getKeys(inventory), ...getKeys(previousInventory)]);

  result += "Inventory:\n";
  for (const item of items) {
    const inventoryCount = inventory[item] ?? new Decimal(0);
    const previousInventoryCount = previousInventory[item] ?? new Decimal(0);

    if (!inventoryCount.eq(previousInventoryCount)) {
      result += `${item}: ${inventoryCount.sub(previousInventoryCount).toString()}\n`;
    }
  }

  const wardrobeItems = new Set([
    ...getKeys(wardrobe),
    ...getKeys(previousWardrobe),
  ]);

  result += "Wardrobe:\n";
  for (const item of wardrobeItems) {
    const wardrobeCount = wardrobe[item] ?? 0;
    const previousWardrobeCount = previousWardrobe[item] ?? 0;

    if (wardrobeCount !== previousWardrobeCount) {
      result += `${item}: ${wardrobeCount - previousWardrobeCount}\n`;
    }
  }

  const balanceDelta = balance.sub(previousBalance);
  if (!balanceDelta.eq(0)) {
    result += `Balance: ${formatNumber(balanceDelta)} SFL`;
  }

  return result.trim();
};

export const Marketplace: React.FC = () => {
  const { gameService, fromRoute } = useContext(Context);
  const balance = useSelector(gameService, _balance);
  const tmpDelta = useSelector(gameService, _tmpDelta);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useAppTranslation();

  const handleClose = () => {
    const defaultRoute = location.pathname.includes("/world")
      ? "/world/plaza"
      : "/";

    fromRoute ? navigate(fromRoute) : navigate(defaultRoute);
  };

  return (
    <>
      <div className="fixed z-50 top-0 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-white px-4 py-2 rounded-b-lg shadow-md">
          <span className="text-xs whitespace-pre-line">{tmpDelta}</span>
        </div>
      </div>
      <MarketplaceIntroduction />
      <div className="bg-[#181425] w-full h-full safe-area-inset-top safe-area-inset-bottom">
        <OuterPanel className="h-full">
          <div
            className="relative flex w-full justify-between pr-10 items-center  mr-auto h-[70px]  mb-0.5"
            style={{}}
          >
            <div
              className="absolute inset-0 w-full h-full -z-0 rounded-sm"
              // Repeating pixel art image background
              style={{
                backgroundImage: `url(${SUNNYSIDE.announcement.marketplace})`,

                imageRendering: "pixelated",
                backgroundSize: "320px",
                backgroundPosition: "center",
              }}
            />
            <div className="z-10 pl-4">
              <p className="text-lg text-white z-10 text-shadow">
                {t("marketplace")}
              </p>
              <p className="text-xs text-white z-10 text-shadow">
                {t("marketplace.buy")}
              </p>
            </div>

            <div className="flex items-center z-10">
              <img src={sflIcon} className="w-8 mr-1" />
              <p className="text-sm text-white">
                {formatNumber(balance, { decimalPlaces: 4 })}
              </p>
            </div>
            <img
              src={SUNNYSIDE.icons.close}
              className="flex-none cursor-pointer absolute right-2"
              onClick={handleClose}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                height: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </div>

          <div style={{ height: "calc(100% - 70px)" }}>
            <MarketplaceNavigation />
          </div>
        </OuterPanel>
      </div>
    </>
  );
};
