import React, { useContext, useLayoutEffect } from "react";
import { SUNNYSIDE } from "assets/sunnyside";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import classNames from "classnames";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { useNavigate } from "react-router";
import { GreenhousePot } from "./GreenhousePot";
import { Hud } from "features/island/hud/Hud";
import { GreenhouseOil } from "./GreenhouseOil";
import { EXTERIOR_ISLAND_BG } from "features/barn/BarnInside";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { PlayerModal } from "features/social/PlayerModal";
import { hasFeatureAccess } from "lib/flags";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { useSelector } from "@xstate/react";
import { isBuildingDestroyed } from "features/island/buildings/components/building/Building";

const background = SUNNYSIDE.land.greenhouse_inside;

const _token = (state: AuthMachineState) => state.context.user.rawToken ?? "";

export const GreenhouseInside: React.FC = () => {
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);

  const token = useSelector(authService, _token);
  const context = gameService.getSnapshot().context;
  const loggedInFarmId = context.visitorId ?? context.farmId;

  const hasAirdropAccess = hasFeatureAccess(
    context.visitorState ?? context.state,
    "AIRDROP_PLAYER",
  );

  const { t } = useAppTranslation();

  const [scrollIntoView] = useScrollIntoView();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  const calendarEvent = isBuildingDestroyed({
    name: "Greenhouse",
    calendar: context.state.calendar,
  });

  if (calendarEvent) {
    navigate("/");
  }

  return (
    <>
      <>
        <div
          className="absolute bg-[#181425]"
          style={{
            width: `${84 * GRID_WIDTH_PX}px`,
            height: `${56 * GRID_WIDTH_PX}px`,
            imageRendering: "pixelated",
            backgroundImage: `url(${EXTERIOR_ISLAND_BG[getCurrentBiome(gameService.getSnapshot().context.state.island)]})`,
            backgroundRepeat: "repeat",
            backgroundPosition: "center",
            backgroundSize: `${96 * PIXEL_SCALE}px ${96 * PIXEL_SCALE}px`,
          }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className={classNames("relative w-full h-full")}>
              <img
                src={background}
                id={Section.GenesisBlock}
                className="relative z-0"
                style={{
                  width: `${176 * PIXEL_SCALE}px`,
                  height: `${192 * PIXEL_SCALE}px`,
                }}
              />

              <div
                className="absolute"
                style={{
                  left: `${60.5 * PIXEL_SCALE}px`,
                  top: `${52 * PIXEL_SCALE}px`,
                  width: `${55 * PIXEL_SCALE}px`,
                }}
              >
                <GreenhouseOil />
              </div>

              <div
                className="absolute"
                style={{
                  left: `${26 * PIXEL_SCALE}px`,
                  bottom: `${95 * PIXEL_SCALE}px`,
                }}
              >
                <GreenhousePot id={1} />
              </div>
              <div
                className="absolute"
                style={{
                  left: `${26 * PIXEL_SCALE}px`,
                  bottom: `${46 * PIXEL_SCALE}px`,
                }}
              >
                <GreenhousePot id={2} />
              </div>
              <div
                className="absolute"
                style={{
                  right: `${26 * PIXEL_SCALE}px`,
                  bottom: `${95 * PIXEL_SCALE}px`,
                }}
              >
                <GreenhousePot id={3} />
              </div>
              <div
                className="absolute"
                style={{
                  right: `${26 * PIXEL_SCALE}px`,
                  bottom: `${46 * PIXEL_SCALE}px`,
                }}
              >
                <GreenhousePot id={4} />
              </div>

              <Button
                className="absolute -bottom-16"
                onClick={() => navigate("/")}
              >
                {t("exit")}
              </Button>
            </div>
          </div>
        </div>
      </>

      <Hud isFarming={false} location="home" />
      <PlayerModal
        loggedInFarmId={loggedInFarmId}
        token={token}
        hasAirdropAccess={hasAirdropAccess}
      />
    </>
  );
};
