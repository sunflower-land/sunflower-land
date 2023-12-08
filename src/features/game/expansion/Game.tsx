import React, { useContext, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "@xstate/react";

import { useInterval } from "lib/utils/hooks/useInterval";

import { Loading } from "features/auth/components";
import { ErrorCode } from "lib/errors";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { Refreshing } from "features/auth/components/Refreshing";
import { AddingSFL } from "features/auth/components/AddingSFL";
import { Context } from "../GameProvider";
import { INITIAL_SESSION, MachineState, StateValues } from "../lib/gameMachine";
import { ToastProvider } from "../toast/ToastProvider";
import { ToastPanel } from "../toast/ToastPanel";
import { Panel } from "components/ui/Panel";
import { Success } from "../components/Success";
import { Syncing } from "../components/Syncing";

import { Notifications } from "../components/Notifications";
import { Hoarding } from "../components/Hoarding";
import { NoBumpkin } from "features/island/bumpkin/NoBumpkin";
import { Swarming } from "../components/Swarming";
import { Cooldown } from "../components/Cooldown";
import { Route, Routes } from "react-router-dom";
import { Land } from "./Land";
import { Helios } from "features/helios/Helios";
import { VisitingHud } from "features/island/hud/VisitingHud";
import { VisitLandExpansionForm } from "./components/VisitLandExpansionForm";

import land from "assets/land/islands/island.webp";
import { IslandNotFound } from "./components/IslandNotFound";
import { Rules } from "../components/Rules";
import { WalletOnboarding } from "features/tutorials/wallet/WalletOnboarding";
import { Introduction } from "./components/Introduction";
import { NoTownCenter } from "../components/NoTownCenter";
import { SpecialOffer } from "./components/SpecialOffer";
import { Purchasing } from "../components/Purchasing";
import { Transacting } from "../components/Transacting";
import { Minting } from "../components/Minting";
import { ClaimAuction } from "../components/auctionResults/ClaimAuction";
import { RefundAuction } from "../components/auctionResults/RefundAuction";
import { Promo } from "./components/Promo";
import { Traded } from "../components/Traded";
import { Sniped } from "../components/Sniped";
import { NewMail } from "./components/NewMail";
import { Blacklisted } from "../components/Blacklisted";
import { AirdropPopup } from "./components/Airdrop";

export const AUTO_SAVE_INTERVAL = 1000 * 30; // autosave every 30 seconds
const SHOW_MODAL: Record<StateValues, boolean> = {
  loading: true,
  playing: false,
  autosaving: false,
  syncing: true,
  synced: true,
  error: true,
  purchasing: true,
  buyingBlockBucks: true,
  refreshing: true,
  deposited: true,
  hoarding: true,
  landscaping: false,
  noBumpkinFound: true,
  noTownCenter: true,
  swarming: true,
  coolingDown: true,
  gameRules: true,
  randomising: false,
  visiting: false,
  loadLandToVisit: true,
  landToVisitNotFound: true,
  revealing: false,
  revealed: false,
  genieRevealed: false,
  beanRevealed: false,
  buyingSFL: true,
  depositing: true,
  introduction: false,
  specialOffer: false,
  transacting: true,
  minting: true,
  auctionResults: false,
  claimAuction: false,
  refundAuction: false,
  promo: true,
  trading: true,
  sniped: true,
  traded: true,
  buds: false,
  mailbox: false,
  blacklisted: true,
  airdrop: true,
  portalling: true,
};

// State change selectors
const isLoading = (state: MachineState) =>
  state.matches("loading") || state.matches("portalling");
const isPortalling = (state: MachineState) => state.matches("portalling");
const isTrading = (state: MachineState) => state.matches("trading");
const isTraded = (state: MachineState) => state.matches("traded");
const isSniped = (state: MachineState) => state.matches("sniped");
const isRefreshing = (state: MachineState) => state.matches("refreshing");
const isBuyingSFL = (state: MachineState) => state.matches("buyingSFL");
const isDeposited = (state: MachineState) => state.matches("deposited");
const isError = (state: MachineState) => state.matches("error");
const isSynced = (state: MachineState) => state.matches("synced");
const isSyncing = (state: MachineState) => state.matches("syncing");
const isHoarding = (state: MachineState) => state.matches("hoarding");
const isVisiting = (state: MachineState) => state.matches("visiting");
const isSwarming = (state: MachineState) => state.matches("swarming");
const isPurchasing = (state: MachineState) =>
  state.matches({ purchasing: "fetching" }) ||
  state.matches({ purchasing: "transacting" }) ||
  state.matches({ buyingBlockBucks: "fetching" }) ||
  state.matches({ buyingBlockBucks: "transacting" });
const isNoTownCenter = (state: MachineState) => state.matches("noTownCenter");
const isNoBumpkinFound = (state: MachineState) =>
  state.matches("noBumpkinFound");
const isCoolingDown = (state: MachineState) => state.matches("coolingDown");
const isGameRules = (state: MachineState) => state.matches("gameRules");
const isDepositing = (state: MachineState) => state.matches("depositing");
const isMinting = (state: MachineState) => state.matches("minting");
const isLoadingLandToVisit = (state: MachineState) =>
  state.matches("loadLandToVisit");
const isLoadingSession = (state: MachineState) =>
  state.matches("loading") && state.context.sessionId === INITIAL_SESSION;
const isLandToVisitNotFound = (state: MachineState) =>
  state.matches("landToVisitNotFound");
const currentState = (state: MachineState) => state.value;
const getErrorCode = (state: MachineState) => state.context.errorCode;
const getActions = (state: MachineState) => state.context.actions;

const isTransacting = (state: MachineState) => state.matches("transacting");
const isClaimAuction = (state: MachineState) => state.matches("claimAuction");
const isRefundingAuction = (state: MachineState) =>
  state.matches("refundAuction");
const isPromoing = (state: MachineState) => state.matches("promo");
const isBlacklisted = (state: MachineState) => state.matches("blacklisted");
const hasAirdrop = (state: MachineState) => state.matches("airdrop");

const GameContent = () => {
  const { gameService } = useContext(Context);

  const visiting = useSelector(gameService, isVisiting);
  const landToVisitNotFound = useSelector(gameService, isLandToVisitNotFound);

  if (landToVisitNotFound) {
    return (
      <>
        <div className="absolute z-20">
          <VisitingHud />
        </div>
        <div className="relative">
          <Modal centered show backdrop={false}>
            <Panel
              bumpkinParts={{
                body: "Beige Farmer Potion",
                hair: "Rancher Hair",
                pants: "Farmer Overalls",
                shirt: "Red Farmer Shirt",
                tool: "Farmer Pitchfork",
                background: "Farm Background",
                shoes: "Black Farmer Boots",
              }}
            >
              <div className="flex flex-col items-center">
                <h2 className="text-center">Island Not Found!</h2>
                <img src={land} className="h-9 my-3" />
              </div>
              <VisitLandExpansionForm />
            </Panel>
          </Modal>
        </div>
      </>
    );
  }

  if (visiting) {
    return (
      <>
        <div className="absolute z-10 w-full h-full">
          <Routes>
            <Route path="/:id" element={<Land />} />
          </Routes>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="absolute w-full h-full z-10">
        <Routes>
          <Route path="/" element={<Land />} />
          {/* Legacy route */}
          <Route path="/farm" element={<Land />} />
          <Route path="/helios" element={<Helios key="helios" />} />
          <Route path="*" element={<IslandNotFound />} />
        </Routes>
      </div>
    </>
  );
};

export const Game: React.FC = () => {
  return (
    <GameWrapper>
      <GameContent />
    </GameWrapper>
  );
};

export const GameWrapper: React.FC = ({ children }) => {
  const { gameService } = useContext(Context);

  const loading = useSelector(gameService, isLoading);
  const portalling = useSelector(gameService, isPortalling);
  const trading = useSelector(gameService, isTrading);
  const traded = useSelector(gameService, isTraded);
  const sniped = useSelector(gameService, isSniped);
  const refreshing = useSelector(gameService, isRefreshing);
  const buyingSFL = useSelector(gameService, isBuyingSFL);
  const deposited = useSelector(gameService, isDeposited);
  const error = useSelector(gameService, isError);
  const synced = useSelector(gameService, isSynced);
  const syncing = useSelector(gameService, isSyncing);
  const purchasing = useSelector(gameService, isPurchasing);
  const hoarding = useSelector(gameService, isHoarding);
  const swarming = useSelector(gameService, isSwarming);
  const noBumpkinFound = useSelector(gameService, isNoBumpkinFound);
  const noTownCenter = useSelector(gameService, isNoTownCenter);
  const coolingDown = useSelector(gameService, isCoolingDown);
  const gameRules = useSelector(gameService, isGameRules);
  const depositing = useSelector(gameService, isDepositing);
  const loadingLandToVisit = useSelector(gameService, isLoadingLandToVisit);
  const loadingSession = useSelector(gameService, isLoadingSession);
  const state = useSelector(gameService, currentState);
  const errorCode = useSelector(gameService, getErrorCode);
  const actions = useSelector(gameService, getActions);
  const transacting = useSelector(gameService, isTransacting);
  const minting = useSelector(gameService, isMinting);
  const claimingAuction = useSelector(gameService, isClaimAuction);
  const refundAuction = useSelector(gameService, isRefundingAuction);
  const promo = useSelector(gameService, isPromoing);
  const blacklisted = useSelector(gameService, isBlacklisted);
  const airdrop = useSelector(gameService, hasAirdrop);

  useInterval(() => {
    gameService.send("SAVE");
  }, AUTO_SAVE_INTERVAL);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (actions.length === 0) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // cleanup on every gameState update
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [actions]);

  useEffect(() => {
    const save = () => {
      gameService.send("SAVE");
    };

    window.addEventListener("blur", save);

    // cleanup on every gameState update
    return () => {
      window.removeEventListener("blur", save);

      // Do a final save
      save();
    };
  }, []);

  if (loadingSession || loadingLandToVisit || portalling) {
    return (
      <div className="h-screen w-full fixed top-0" style={{ zIndex: 1050 }}>
        <Modal show centered backdrop={false}>
          <Panel>
            <Loading />
          </Panel>
        </Modal>
      </div>
    );
  }

  if (blacklisted) {
    return (
      <div className="h-screen w-full fixed top-0" style={{ zIndex: 1050 }}>
        <Modal show centered backdrop={false}>
          <Panel>
            <Blacklisted />
          </Panel>
        </Modal>
      </div>
    );
  }

  const stateValue = typeof state === "object" ? Object.keys(state)[0] : state;

  return (
    <ToastProvider>
      <ToastPanel />

      <Modal show={SHOW_MODAL[stateValue as StateValues]} centered>
        <Panel>
          {loading && <Loading />}
          {refreshing && <Refreshing />}
          {buyingSFL && <AddingSFL />}
          {deposited && <Notifications />}
          {error && <ErrorMessage errorCode={errorCode as ErrorCode} />}
          {synced && <Success />}
          {syncing && <Syncing />}
          {purchasing && <Purchasing />}
          {hoarding && <Hoarding />}
          {swarming && <Swarming />}
          {noBumpkinFound && <NoBumpkin />}

          {noTownCenter && <NoTownCenter />}
          {coolingDown && <Cooldown />}
          {gameRules && <Rules />}
          {transacting && <Transacting />}
          {depositing && <Loading text="Depositing" />}
          {trading && <Loading text="Trading" />}
          {traded && <Traded />}
          {sniped && <Sniped />}
          {minting && <Minting />}
          {promo && <Promo />}
          {airdrop && <AirdropPopup />}
        </Panel>
      </Modal>

      {claimingAuction && <ClaimAuction />}
      {refundAuction && <RefundAuction />}

      <SpecialOffer />
      <Introduction />
      <NewMail />

      {children}
    </ToastProvider>
  );
};
