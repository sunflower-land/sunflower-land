import React, { useContext, useEffect } from "react";
import { Modal } from "components/ui/Modal";
import { useActor, useSelector } from "@xstate/react";

import { useInterval } from "lib/utils/hooks/useInterval";
import * as AuthProvider from "features/auth/lib/Provider";

import mailIcon from "assets/icons/letter.png";

import { Loading } from "features/auth/components";
import { ErrorCode } from "lib/errors";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { Refreshing } from "features/auth/components/Refreshing";
import { AddingSFL } from "features/auth/components/AddingSFL";
import { Context } from "../GameProvider";
import {
  BlockchainState,
  INITIAL_SESSION,
  MachineState,
  StateValues,
} from "../lib/gameMachine";
import { ToastProvider } from "../toast/ToastProvider";
import { ToastPanel } from "../toast/ToastPanel";
import { Panel } from "components/ui/Panel";

import { Hoarding } from "../components/Hoarding";
import { Swarming } from "../components/Swarming";
import { Cooldown } from "../components/Cooldown";
import { Route, Routes, useNavigate } from "react-router";
import { Land } from "./Land";
import { VisitingHud } from "features/island/hud/VisitingHud";
import { VisitLandExpansionForm } from "./components/VisitLandExpansionForm";

import { IslandNotFound } from "./components/IslandNotFound";
import { Rules } from "../components/Rules";
import { Introduction } from "./components/Introduction";
import { Purchasing } from "../components/Purchasing";
import { ClaimAuction } from "../components/auctionResults/ClaimAuction";
import { RefundAuction } from "../components/auctionResults/RefundAuction";
import { Promo } from "./components/Promo";
import { Traded } from "../components/Traded";
import { Sniped } from "../components/Sniped";
import { NewMail } from "./components/NewMail";
import { Blacklisted } from "../components/Blacklisted";
import { AirdropPopup } from "./components/Airdrop";
import { MarketplaceSalesPopup } from "./components/MarketplaceSalesPopup";
import { isBuildingReady, PIXEL_SCALE, TEST_FARM } from "../lib/constants";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { CONFIG } from "lib/config";
import { Home } from "features/home/Home";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Listed } from "../components/Listed";
import { ListingDeleted } from "../components/listingDeleted";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { usePWAInstall } from "features/pwa/PWAInstallProvider";
import { fixInstallPromptTextStyles } from "features/pwa/lib/fixInstallPromptStyles";
import { hasFeatureAccess } from "lib/flags";
import { SUNNYSIDE } from "assets/sunnyside";
import { PriceChange } from "../components/PriceChange";
import { VIPOffer } from "../components/modal/components/VIPItems";
import { GreenhouseInside } from "features/greenhouse/GreenhouseInside";
import { useSound } from "lib/utils/hooks/useSound";
import { SomethingArrived } from "./components/SomethingArrived";
import { TradeAlreadyFulfilled } from "../components/TradeAlreadyFulfilled";
import { NPC_WEARABLES } from "lib/npcs";
import { Transaction } from "features/island/hud/Transaction";
import { Gems } from "./components/Gems";
import { HenHouseInside } from "features/henHouse/HenHouseInside";
import { BarnInside } from "features/barn/BarnInside";
import { STATE_MACHINE_EFFECTS } from "../actions/effect";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import { GameState } from "../types/game";
import { Ocean } from "features/world/ui/Ocean";
import { OffersAcceptedPopup } from "./components/OffersAcceptedPopup";
import { Marketplace } from "features/marketplace/Marketplace";
import { CompetitionModal } from "features/competition/CompetitionBoard";
import { SeasonChanged } from "./components/temperateSeason/SeasonChanged";
import { CalendarEvent } from "./components/temperateSeason/CalendarEvent";
import { DailyReset } from "../components/DailyReset";
import { RoninWelcomePack } from "./components/RoninWelcomePack";
import { ClaimRoninAirdrop } from "./components/onChainAirdrops/ClaimRoninAirdrop";
import { FLOWERTeaserContent } from "../components/FLOWERTeaser";
import { pixelGrayBorderStyle } from "../lib/style";
import { RoninJinClaim } from "./components/RoninJinClaim";
import {
  EFFECT_SUCCESS_COMPONENTS,
  EffectSuccess,
} from "./components/EffectSuccess";
import { LoveCharm } from "./components/LoveCharm";
import { ClaimReferralRewards } from "./components/ClaimReferralRewards";
import { SoftBan } from "features/retreat/components/personhood/SoftBan";
import { RewardBox } from "features/rewardBoxes/RewardBox";
import { FlowerDashboard } from "features/flowerDashboard/FlowerDashboard";

function camelToDotCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1.$2").toLowerCase() as string;
}

const land = SUNNYSIDE.land.island;

const getModalStatesForEffects = () =>
  Object.values(STATE_MACHINE_EFFECTS).reduce(
    (states, stateName) => ({
      ...states,
      [stateName]: true,
      [`${stateName}Failed`]: true,
      [`${stateName}Success`]: true,
    }),
    {} as Record<BlockchainState["value"], boolean>,
  );

export const AUTO_SAVE_INTERVAL = 1000 * 60; // autosave every 60 seconds
const SHOW_MODAL: Record<StateValues, boolean> = {
  ...getModalStatesForEffects(),
  // Hide these modals
  depositingFlower: false,
  depositingFlowerSuccess: false,
  depositingFlowerFailed: false,
  changingUsername: false,
  changingUsernameSuccess: false,
  changingUsernameFailed: false,
  assigningUsername: false,
  assigningUsernameSuccess: false,
  assigningUsernameFailed: false,
  claimingStreamReward: false,
  claimingStreamRewardSuccess: false,
  claimingStreamRewardFailed: false,
  // Every new state should be added below here
  gems: true,
  communityCoin: true,
  referralRewards: true,
  loading: true,
  playing: false,
  autosaving: false,
  error: true,
  buyingBlockBucks: true,
  refreshing: true,
  hoarding: true,
  landscaping: false,
  swarming: true,
  coolingDown: true,
  gameRules: true,
  FLOWERTeaser: true,
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
  vip: true,
  transacting: true,
  auctionResults: false,
  claimAuction: false,
  refundAuction: false,
  promo: true,
  priceChanged: true,
  buds: false,
  mailbox: false,
  blacklisted: true,
  airdrop: true,
  offers: true,
  marketplaceSale: true,
  portalling: true,
  sellMarketResource: false,
  somethingArrived: true,
  seasonChanged: false,
  roninWelcomePack: true,
  roninAirdrop: true,
  jinAirdrop: true,
  investigating: true,
};

// State change selectors
const isLoading = (state: MachineState) =>
  state.matches("loading") || state.matches("portalling");
const isPortalling = (state: MachineState) => state.matches("portalling");
const isTrading = (state: MachineState) => state.matches("trading");
const isTraded = (state: MachineState) => state.matches("traded");
const isListing = (state: MachineState) => state.matches("listing");
const isListed = (state: MachineState) => state.matches("listed");
const isDeletingListing = (state: MachineState) =>
  state.matches("deleteTradeListing");
const isListingDeleted = (state: MachineState) =>
  state.matches("tradeListingDeleted");
const isFulfillingTradeListing = (state: MachineState) =>
  state.matches("fulfillTradeListing");
const isSniped = (state: MachineState) => state.matches("sniped");
const isTradeAlreadyFulfilled = (state: MachineState) =>
  state.matches("tradeAlreadyFulfilled");
const hasMarketPriceChanged = (state: MachineState) =>
  state.matches("priceChanged");
const isRefreshing = (state: MachineState) => state.matches("refreshing");
const isBuyingSFL = (state: MachineState) => state.matches("buyingSFL");
const isError = (state: MachineState) => state.matches("error");
const isHoarding = (state: MachineState) => state.matches("hoarding");
const isVisiting = (state: MachineState) => state.matches("visiting");
const isSwarming = (state: MachineState) => state.matches("swarming");
const isPurchasing = (state: MachineState) =>
  state.matches("purchasing") || state.matches("buyingBlockBucks");

const showGems = (state: MachineState) => state.matches("gems");
const showCommunityCoin = (state: MachineState) =>
  state.matches("communityCoin");
const _showReferralRewards = (state: MachineState) =>
  state.matches("referralRewards");
const isCoolingDown = (state: MachineState) => state.matches("coolingDown");
const isGameRules = (state: MachineState) => state.matches("gameRules");
const isFLOWERTeaser = (state: MachineState) => state.matches("FLOWERTeaser");
const isDepositing = (state: MachineState) => state.matches("depositing");
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
const isInvestigating = (state: MachineState) => state.matches("investigating");
const hasFulfilledOffers = (state: MachineState) => state.matches("offers");
const hasVipNotification = (state: MachineState) => state.matches("vip");
const isPlaying = (state: MachineState) => state.matches("playing");
const somethingArrived = (state: MachineState) =>
  state.matches("somethingArrived");
const isEffectPending = (state: MachineState) =>
  Object.values(STATE_MACHINE_EFFECTS).some((stateName) =>
    state.matches(stateName),
  );
const isEffectSuccess = (state: MachineState) =>
  Object.values(STATE_MACHINE_EFFECTS).some((stateName) =>
    state.matches(`${stateName}Success`),
  );
const isEffectFailed = (state: MachineState) =>
  Object.values(STATE_MACHINE_EFFECTS).some((stateName) =>
    state.matches(`${stateName}Failed`),
  );
const hasMarketplaceSales = (state: MachineState) =>
  state.matches("marketplaceSale");
const isCompetition = (state: MachineState) => state.matches("competition");
const isSeasonChanged = (state: MachineState) => state.matches("seasonChanged");
const isCalendarEvent = (state: MachineState) => state.matches("calendarEvent");
const isRoninWelcomePack = (state: MachineState) =>
  state.matches("roninWelcomePack");
const isRoninAirdrop = (state: MachineState) => state.matches("roninAirdrop");
const isJinAirdrop = (state: MachineState) => state.matches("jinAirdrop");
const GameContent: React.FC = () => {
  const { gameService } = useContext(Context);
  useSound("desert", true);

  const visiting = useSelector(gameService, isVisiting);
  const landToVisitNotFound = useSelector(gameService, isLandToVisitNotFound);
  const { t } = useAppTranslation();
  const [gameState] = useActor(gameService);
  const navigate = useNavigate();

  const PATH_ACCESS: Partial<Record<string, (game: GameState) => boolean>> = {
    GreenHouse: (game) =>
      !!game.buildings.Greenhouse && isBuildingReady(game.buildings.Greenhouse),
    Barn: (game) =>
      !!game.buildings.Barn && isBuildingReady(game.buildings.Barn),
    HenHouse: (game) =>
      !!game.buildings["Hen House"] &&
      isBuildingReady(game.buildings["Hen House"]),
  };

  const hasAccess = (pathName: string) => {
    return (
      PATH_ACCESS[pathName] && PATH_ACCESS[pathName](gameState.context.state)
    );
  };

  if (landToVisitNotFound) {
    return (
      <>
        <div className="absolute z-20">
          <VisitingHud />
        </div>
        <div className="relative">
          <Modal show backdrop={false}>
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
                <h2 className="text-center">
                  {t("visitislandNotFound.title")}
                </h2>
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
          <Route path="/" element={<Land />}>
            <Route path="marketplace/*" element={<Marketplace />} />
            <Route path="flower-dashboard" element={<FlowerDashboard />} />
          </Route>
          {/* Legacy route */}
          <Route path="/farm" element={<Land />} />
          <Route path="/home" element={<Home />} />
          {hasAccess("GreenHouse") && (
            <Route path="/greenhouse" element={<GreenhouseInside />} />
          )}
          {hasAccess("Barn") && <Route path="/barn" element={<BarnInside />} />}
          {hasAccess("HenHouse") && (
            <Route path="/hen-house" element={<HenHouseInside />} />
          )}
          <Route
            path="*"
            element={
              <Ocean>
                <IslandNotFound />
              </Ocean>
            }
          />
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

const _showPWAInstallPrompt = (state: AuthMachineState) =>
  state.context.showPWAInstallPrompt;

export const GameWrapper: React.FC = ({ children }) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const pwaInstallRef = usePWAInstall();

  const loading = useSelector(gameService, isLoading);
  const portalling = useSelector(gameService, isPortalling);
  const trading = useSelector(gameService, isTrading);
  const traded = useSelector(gameService, isTraded);
  const listing = useSelector(gameService, isListing);
  const listed = useSelector(gameService, isListed);
  const deletingListing = useSelector(gameService, isDeletingListing);
  const listingDeleted = useSelector(gameService, isListingDeleted);
  const sniped = useSelector(gameService, isSniped);
  const tradeAlreadyFulfilled = useSelector(
    gameService,
    isTradeAlreadyFulfilled,
  );
  const marketPriceChanged = useSelector(gameService, hasMarketPriceChanged);
  const refreshing = useSelector(gameService, isRefreshing);
  const buyingSFL = useSelector(gameService, isBuyingSFL);
  const error = useSelector(gameService, isError);
  const purchasing = useSelector(gameService, isPurchasing);
  const hoarding = useSelector(gameService, isHoarding);
  const swarming = useSelector(gameService, isSwarming);
  const coolingDown = useSelector(gameService, isCoolingDown);
  const gameRules = useSelector(gameService, isGameRules);
  const FLOWERTeaser = useSelector(gameService, isFLOWERTeaser);
  const depositing = useSelector(gameService, isDepositing);
  const loadingLandToVisit = useSelector(gameService, isLoadingLandToVisit);
  const loadingSession = useSelector(gameService, isLoadingSession);
  const state = useSelector(gameService, currentState);
  const errorCode = useSelector(gameService, getErrorCode);
  const actions = useSelector(gameService, getActions);
  const transacting = useSelector(gameService, isTransacting);
  const claimingAuction = useSelector(gameService, isClaimAuction);
  const refundAuction = useSelector(gameService, isRefundingAuction);
  const promo = useSelector(gameService, isPromoing);
  const blacklisted = useSelector(gameService, isBlacklisted);
  const airdrop = useSelector(gameService, hasAirdrop);
  const showOffers = useSelector(gameService, hasFulfilledOffers);
  const vip = useSelector(gameService, hasVipNotification);
  const playing = useSelector(gameService, isPlaying);
  const hasSomethingArrived = useSelector(gameService, somethingArrived);
  const hasBBs = useSelector(gameService, showGems);
  const hasCommunityCoin = useSelector(gameService, showCommunityCoin);
  const showReferralRewards = useSelector(gameService, _showReferralRewards);
  const effectPending = useSelector(gameService, isEffectPending);
  const effectSuccess = useSelector(gameService, isEffectSuccess);
  const effectFailed = useSelector(gameService, isEffectFailed);
  const showSales = useSelector(gameService, hasMarketplaceSales);
  const competition = useSelector(gameService, isCompetition);
  const seasonChanged = useSelector(gameService, isSeasonChanged);
  const calendarEvent = useSelector(gameService, isCalendarEvent);
  const roninWelcomePack = useSelector(gameService, isRoninWelcomePack);
  const roninAirdrop = useSelector(gameService, isRoninAirdrop);
  const jinAirdrop = useSelector(gameService, isJinAirdrop);
  const showPWAInstallPrompt = useSelector(authService, _showPWAInstallPrompt);
  const investigating = useSelector(gameService, isInvestigating);

  const { t } = useAppTranslation();
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

  useEffect(() => {
    if (playing && showPWAInstallPrompt) {
      pwaInstallRef.current?.showDialog();

      authService.send("PWA_INSTALL_PROMPT_SHOWN");

      fixInstallPromptTextStyles();
    }
  }, [playing, pwaInstallRef, showPWAInstallPrompt]);

  if (loadingSession || loadingLandToVisit || portalling) {
    return (
      <>
        <Ocean>
          <Modal show backdrop={false}>
            <div
              className={classNames(
                "relative flex items-center justify-center mb-4 w-full -mt-12 max-w-xl transition-opacity duration-500 opacity-100",
              )}
            >
              <div className="w-[90%] relative">
                <img
                  src={SUNNYSIDE.fx.sparkle}
                  className="absolute animate-pulse"
                  style={{
                    width: `${PIXEL_SCALE * 8}px`,
                    top: `${PIXEL_SCALE * 0}px`,
                    right: `${PIXEL_SCALE * 0}px`,
                  }}
                />
                <>
                  {hasFeatureAccess(TEST_FARM, "EASTER") ? (
                    <img
                      id="logo"
                      src={SUNNYSIDE.brand.easterlogo}
                      className="w-full"
                    />
                  ) : (
                    <img
                      id="logo"
                      src={SUNNYSIDE.brand.logo}
                      className="w-full"
                    />
                  )}
                  <div className="flex justify-center">
                    <Label type="default" className="font-secondary">
                      {CONFIG.RELEASE_VERSION?.split("-")[0]}
                    </Label>
                    {hasFeatureAccess(TEST_FARM, "EASTER") && (
                      <Label
                        secondaryIcon={SUNNYSIDE.icons.stopwatch}
                        type="vibrant"
                        className="ml-2"
                      >
                        {t("event.Easter")}
                      </Label>
                    )}
                  </div>
                </>
              </div>
            </div>
            <Panel>
              <Loading />
            </Panel>
            <div
              className={classNames(
                `w-full justify-center items-center flex  text-xs p-1 pr-4 mt-1 relative`,
              )}
              style={{
                background: "#c0cbdc",
                color: "#181425",
                ...pixelGrayBorderStyle,
              }}
            >
              <img src={mailIcon} className="w-8 mr-2" />
              <p className="text-xs flex-1">{t("news.flowerSoon")}</p>
            </div>
          </Modal>
        </Ocean>
      </>
    );
  }

  if (blacklisted) {
    return (
      <div className="h-screen w-full fixed top-0" style={{ zIndex: 49 }}>
        <Modal show backdrop={false}>
          <Panel>
            <Blacklisted />
          </Panel>
        </Modal>
      </div>
    );
  }

  const stateValue =
    typeof state === "object"
      ? (Object.keys(state)[0] as StateValues)
      : (state as StateValues);

  const onHide = (): (() => void) | undefined => {
    if (
      listed ||
      listingDeleted ||
      traded ||
      sniped ||
      marketPriceChanged ||
      tradeAlreadyFulfilled
    ) {
      gameService.send("CONTINUE");
    } else {
      return undefined;
    }
  };

  const effectTranslationKey = camelToDotCase(
    stateValue as string,
  ) as TranslationKeys;

  return (
    <>
      <ToastProvider>
        <ToastPanel />

        <Modal show={SHOW_MODAL[stateValue as StateValues]} onHide={onHide}>
          <Panel
            bumpkinParts={error ? NPC_WEARABLES["worried pete"] : undefined}
          >
            {/* Effects */}
            {effectPending && <Loading text={t(effectTranslationKey)} />}
            {effectSuccess &&
              (EFFECT_SUCCESS_COMPONENTS[stateValue as StateValues] ?? (
                <EffectSuccess state={stateValue} />
              ))}
            {effectFailed && (
              <ErrorMessage errorCode={errorCode as ErrorCode} />
            )}

            {loading && <Loading />}
            {refreshing && <Refreshing />}
            {buyingSFL && <AddingSFL />}
            {error && <ErrorMessage errorCode={errorCode as ErrorCode} />}
            {purchasing && <Purchasing />}
            {hoarding && <Hoarding />}
            {swarming && <Swarming />}
            {coolingDown && <Cooldown />}
            {gameRules && <Rules />}
            {FLOWERTeaser && <FLOWERTeaserContent />}
            {transacting && <Transaction />}
            {depositing && <Loading text={t("depositing")} />}
            {trading && <Loading text={t("trading")} />}
            {traded && <Traded />}
            {listing && <Loading text={t("listing")} />}
            {listed && <Listed />}
            {deletingListing && <Loading text={t("deleting.listing")} />}
            {listingDeleted && <ListingDeleted />}
            {sniped && <Sniped />}
            {tradeAlreadyFulfilled && <TradeAlreadyFulfilled />}
            {marketPriceChanged && <PriceChange />}
            {promo && <Promo />}
            {airdrop && <AirdropPopup />}
            {showOffers && <OffersAcceptedPopup />}
            {showSales && <MarketplaceSalesPopup />}
            {vip && <VIPOffer />}
            {hasSomethingArrived && <SomethingArrived />}
            {hasBBs && <Gems />}
            {hasCommunityCoin && <LoveCharm />}
            {roninWelcomePack && <RoninWelcomePack />}
            {roninAirdrop && <ClaimRoninAirdrop />}
            {jinAirdrop && <RoninJinClaim />}
            {showReferralRewards && <ClaimReferralRewards />}
            {investigating && <SoftBan />}
          </Panel>
        </Modal>

        {claimingAuction && <ClaimAuction />}
        {refundAuction && <RefundAuction />}
        {seasonChanged && <SeasonChanged />}
        {calendarEvent && <CalendarEvent />}
        {competition && (
          <Modal show onHide={() => gameService.send("ACKNOWLEDGE")}>
            <CompetitionModal
              competitionName="ANIMALS"
              onClose={() => gameService.send("ACKNOWLEDGE")}
            />
          </Modal>
        )}

        <Introduction />
        <NewMail />

        <RewardBox />

        {children}
      </ToastProvider>
      {/* Handles daily reset */}
      <DailyReset />
    </>
  );
};
