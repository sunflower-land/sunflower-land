import React, { useCallback, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router";

import logo from "assets/brand/crabs_and_traps.png";

import { OuterPanel, Panel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { useSelector } from "@xstate/react";
import { Context as GameContext } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { MachineState } from "features/game/lib/gameMachine";
import { useNow } from "lib/utils/hooks/useNow";
import { getCurrentChapter } from "features/game/types/chapters";
import { MutantsSection } from "./components/MutantsSection";
import { AuctionsSection } from "./components/AuctionsSection";
import { RafflesSection } from "./components/RafflesSection";
import { LeaderboardSection } from "./components/LeaderboardSection";
import { ShopSection } from "./components/ShopSection";
import { Loading } from "features/auth/components";
import { CONFIG } from "lib/config";
import { ChapterTracks } from "features/world/ui/tracks/ChapterTracks";
import { ChapterIntroSection } from "./components/ChapterIntroSection";

const _farmId = (state: MachineState) => state.context.farmId;
const _gameState = (state: MachineState) => state.context.state;
const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

/**
 * Player-facing chapter dashboard at /chapter.
 */
export const ChapterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(AuthProvider.Context);

  const farmId = useSelector(gameService, _farmId);
  const gameState = useSelector(gameService, _gameState);
  const token = useSelector(authService, _token);
  const now = useNow({ live: true });
  const chapter = getCurrentChapter(now);
  const isOffline = !CONFIG.API_URL;

  const effectiveFarmId = farmId || 1;
  const effectiveToken = token || "offline";

  const showClose = pathname.includes("/game") || pathname === "/chapter";

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  return (
    <div className="bg-[#181425] w-full h-full safe-area-inset-top safe-area-inset-bottom">
      <OuterPanel className="inset-0 fixed pointer-events-auto flex flex-col overflow-y-auto scrollable">
        <div className="relative flex w-full justify-between pr-10 items-center mr-auto h-[70px] mb-2">
          <div
            className="absolute inset-0 w-full h-full -z-0 rounded-sm"
            style={{
              backgroundImage: `url(${SUNNYSIDE.decorations.ocean})`,
              backgroundRepeat: "repeat",
              imageRendering: "pixelated",
              backgroundSize: `${64 * PIXEL_SCALE}px`,
              backgroundPosition: "top left",
            }}
          />
          <div className="absolute inset-0 w-full h-full bg-black opacity-35 -z-0 rounded-sm" />

          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <img
              src={logo}
              alt="Chapter"
              style={{
                height: `${PIXEL_SCALE * 28}px`,
                width: "auto",
              }}
            />
          </div>

          {showClose && (
            <img
              src={SUNNYSIDE.icons.close}
              className="flex-none cursor-pointer absolute right-2"
              onClick={handleClose}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                height: `${PIXEL_SCALE * 11}px`,
              }}
            />
          )}
        </div>

        {!isOffline && (!token || !farmId) ? (
          <div className="p-2">
            <Loading />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-2 px-2 pb-4">
            <div className="flex-1 min-w-0">
              <ShopSection gameState={gameState} />
              <MutantsSection chapter={chapter} />
              <AuctionsSection
                chapter={chapter}
                farmId={effectiveFarmId}
                gameState={gameState}
                token={effectiveToken}
              />
              <RafflesSection chapter={chapter} token={effectiveToken} />
            </div>

            <div className="w-3/5">
              <ChapterIntroSection />
              <ChapterTracks />
            </div>
            <div className="w-full lg:w-[420px] flex-none">
              <LeaderboardSection
                farmId={effectiveFarmId}
                token={effectiveToken}
              />
            </div>
          </div>
        )}
      </OuterPanel>
    </div>
  );
};
