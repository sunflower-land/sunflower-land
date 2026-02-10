import React, { useCallback, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSafeAreaPaddingTop } from "lib/utils/hooks/useSafeAreaPaddingTop";

import logo from "assets/brand/crabs_and_traps.png";

import { OuterPanel } from "components/ui/Panel";
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
import { CONFIG } from "lib/config";
import { ChapterTracks } from "features/world/ui/tracks/ChapterTracks";
import { ChapterIntroSection } from "./components/ChapterIntroSection";
import { ChapterTracksPreview } from "features/world/ui/tracks/ChapterTracks";
import { ChapterTimer } from "./components/ChapterTimer";
import { ChapterMarketplaceWidget } from "./components/ChapterMarketplaceWidget";
import { SocialRewardsWidget } from "./components/SocialRewardsWidget";

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
  const _isOffline = !CONFIG.API_URL;

  const effectiveFarmId = farmId || 1;
  const effectiveToken = token || "offline";

  const showClose = pathname.includes("/game") || pathname === "/chapter";

  const safeAreaPaddingTop = useSafeAreaPaddingTop(50);

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
    <div
      className="bg-[#181425] w-full h-full safe-area-inset-bottom"
      style={{ paddingTop: safeAreaPaddingTop }}
    >
      <OuterPanel className="relative h-full pointer-events-auto flex flex-col overflow-y-auto scrollable">
        <div className="relative flex w-full justify-between pr-10 items-center mr-auto h-20 min-h-20 shrink-0 mb-2">
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

          <div className="absolute left-2 top-2 hidden md:block">
            <ChapterTimer />
          </div>

          <div className="absolute mx-12 inset-0 flex h-[70px] items-center justify-center z-10 pointer-events-none">
            <img
              src={logo}
              alt="Chapter"
              className="mt-2 object-contain"
              style={{
                height: `${PIXEL_SCALE * 28}px`,
                width: "auto",
              }}
            />
          </div>

          {showClose && (
            <img
              src={SUNNYSIDE.icons.close}
              className="flex-none cursor-pointer absolute right-2 z-10"
              onClick={handleClose}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                height: `${PIXEL_SCALE * 11}px`,
              }}
            />
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-2 pb-4">
          <div className="block md:hidden">
            <ChapterTimer />
          </div>
          <div className="flex flex-col-reverse lg:flex-row w-full lg:w-4/5 gap-x-1">
            <div className="w-full lg:w-1/4 ">
              <div className="hidden lg:block">
                <ShopSection gameState={gameState} />
              </div>
              <AuctionsSection
                chapter={chapter}
                farmId={effectiveFarmId}
                gameState={gameState}
                token={effectiveToken}
              />
              <RafflesSection chapter={chapter} token={effectiveToken} />
              <MutantsSection chapter={chapter} />
            </div>

            <div className="w-full lg:w-3/4">
              <div className="lg:hidden block">
                <ShopSection gameState={gameState} />
              </div>

              <ChapterIntroSection />

              <div className="hidden lg:block">
                <ChapterTracks />
              </div>
              <div className="block lg:hidden mb-1">
                <ChapterTracksPreview />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <LeaderboardSection
              farmId={effectiveFarmId}
              token={effectiveToken}
            />
            <ChapterMarketplaceWidget />
            <SocialRewardsWidget />
          </div>
        </div>
      </OuterPanel>
    </div>
  );
};
