import { SUNNYSIDE } from "assets/sunnyside";
import React, { useContext, useEffect, useCallback } from "react";
import sflIcon from "assets/icons/flower_token.webp";
import { MarketplaceNavigation } from "./components/home/MarketplaceHome";
import { useLocation, useNavigate } from "react-router";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { OuterPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { MarketplaceIntroduction } from "./components/MarketplaceIntroduction";
import { formatNumber } from "lib/utils/formatNumber";

const _balance = (state: MachineState) => state.context.state.balance;

export const Marketplace: React.FC = () => {
  const { gameService, fromRoute } = useContext(Context);
  const balance = useSelector(gameService, _balance);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useAppTranslation();

  const handleClose = useCallback(() => {
    const defaultRoute = location.pathname.includes("/world")
      ? "/world/plaza"
      : "/";

    fromRoute ? navigate(fromRoute) : navigate(defaultRoute);
  }, [location.pathname, fromRoute, navigate]);

  // exit marketplace if Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose]);

  return (
    <>
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
