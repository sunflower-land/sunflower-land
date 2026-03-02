import { useSelector } from "@xstate/react";
import { Label } from "components/ui/Label";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { SquareIcon } from "components/ui/SquareIcon";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { MachineState } from "features/game/lib/gameMachine";
import {
  CollectivePet,
  Faction,
  FactionName,
  FactionPet,
  FactionPetRequest,
  InventoryItemName,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import powerup from "assets/icons/level_up.png";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { TypingMessage } from "../TypingMessage";
import {
  calculatePoints,
  getWeekKey,
  getFactionWeekEndTime,
  getFactionWeekday,
} from "features/game/lib/factions";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import classNames from "classnames";
import { isMobile } from "mobile-device-detect";
import {
  DifficultyIndex,
  PET_FED_REWARDS_KEY,
  getKingdomPetBoost,
  getTotalXPForRequest,
} from "features/game/events/landExpansion/feedFactionPet";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { getFactionPetUpdate } from "./actions/getFactionPetUpdate";

import { formatNumber } from "lib/utils/formatNumber";
import { BoostInfoPanel } from "./BoostInfoPanel";
import { getKeys } from "features/game/types/decorations";

import goblinEmblem from "assets/icons/goblin_emblem.webp";
import bumpkinEmblem from "assets/icons/bumpkin_emblem.webp";
import sunflorianEmblem from "assets/icons/sunflorian_emblem.webp";
import nightshadeEmblem from "assets/icons/nightshade_emblem.webp";
import xpIcon from "assets/icons/xp.png";
import { useNow } from "lib/utils/hooks/useNow";
import { useCountdown } from "lib/utils/hooks/useCountdown";

const FACTION_EMBLEM_ICONS: Record<FactionName, string> = {
  goblins: goblinEmblem,
  bumpkins: bumpkinEmblem,
  sunflorians: sunflorianEmblem,
  nightshades: nightshadeEmblem,
};

export const PET_SLEEP_DURATION = 7 * 24 * 60 * 60 * 1000;

const PetSleeping = ({ onWake }: { onWake: () => void }) => {
  const { t } = useAppTranslation();
  const week = getWeekKey({ date: new Date() });
  const beginningOfWeek = new Date(week).getTime();
  const wakeTime = beginningOfWeek + PET_SLEEP_DURATION;

  const { totalSeconds: secondsTillWakeUp } = useCountdown(wakeTime);

  useEffect(() => {
    if (secondsTillWakeUp <= 0) {
      onWake();
    }
  }, [secondsTillWakeUp, onWake]);

  return (
    <>
      <Label
        icon={SUNNYSIDE.icons.stopwatch}
        type="info"
        className="absolute right-0 -top-7 shadow-md"
        style={{ wordSpacing: 0 }}
      >
        {`${t("faction.pet.wakes.in", {
          time: secondsToString(secondsTillWakeUp, {
            length: "medium",
            removeTrailingZeros: true,
          }),
        })}`}
      </Label>
      <CloseButtonPanel>
        <div className="p-1 pb-2 space-y-2">
          <Label type="default">{`ZzzZzzz...`}</Label>
          <TypingMessage
            message={t("faction.pet.sleeping")}
            onMessageEnd={() => undefined}
          />
        </div>
      </CloseButtonPanel>
    </>
  );
};

interface Props {
  onClose: () => void;
}

export type PetState = "sleeping" | "hungry" | "happy";

export const FACTION_PET_REFRESH_INTERVAL = 60 * 1000;

const _autosaving = (state: MachineState) => state.matches("autosaving");
const _farmId = (state: MachineState) => state.context.farmId;
const _faction = (state: MachineState) =>
  state.context.state.faction as Faction;
const _inventory = (state: MachineState) => state.context.state.inventory;

const getPetState = (collectivePet: CollectivePet | undefined): PetState => {
  if (!collectivePet) return "hungry";

  if (collectivePet.sleeping) return "sleeping";

  if (collectivePet.goalReached) return "happy";

  return "hungry";
};

// set wake time to 10 seconds after the component loads

export const FactionPetPanel: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const faction = useSelector(gameService, _faction);
  const farmId = useSelector(gameService, _farmId);
  const autosaving = useSelector(gameService, _autosaving);
  const now = useNow();

  const week = getWeekKey({ date: new Date(now) });
  const collectivePet = faction.history?.[week]?.collectivePet;

  const [fedXP, setFedXP] = useState(collectivePet?.totalXP ?? 0);
  const [streak, setStreak] = useState(collectivePet?.streak ?? 0);
  const [refreshing, setRefreshing] = useState(false);
  const [petState, setPetState] = useState<PetState>(
    getPetState(collectivePet),
  );
  const [tab, setTab] = useState<"pet" | "guide" | "streaks">("pet");

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await getFactionPetUpdate({ farmId });

      if (!data) return;

      if (data.totalXP !== fedXP) {
        setFedXP(data.totalXP);
      }

      if (data.streak !== streak) {
        setStreak(data.streak);
      }

      setPetState(getPetState(data));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error fetching updated pet data: ", e);
    } finally {
      setRefreshing(false);
    }
  }, [farmId, fedXP, streak]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (refreshing || autosaving || petState === "sleeping") return;

      handleRefresh();
    }, FACTION_PET_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [autosaving, handleRefresh, petState, refreshing]);

  if (petState === "sleeping") {
    return (
      <PetSleeping onWake={() => setPetState(getPetState(collectivePet))} />
    );
  }

  const secondsTillWeekEnd =
    (getFactionWeekEndTime({ date: new Date(now) }) - now) / 1000;

  const onAcknowledge = () => {
    setTab("pet");
  };

  return (
    <>
      <Label
        icon={SUNNYSIDE.icons.stopwatch}
        type="info"
        className="absolute right-0 -top-7 shadow-md"
        style={{ wordSpacing: 0 }}
      >
        {`${t("faction.pet.newRequests", {
          time: secondsToString(secondsTillWeekEnd, {
            length: "medium",
            removeTrailingZeros: true,
          }),
        })}`}
      </Label>
      <CloseButtonPanel
        onClose={onClose}
        currentTab={tab}
        container={OuterPanel}
        setCurrentTab={setTab}
        tabs={[
          {
            icon: FACTION_EMBLEM_ICONS[faction.name as FactionName],
            name: "Faction Pet",
            id: "pet",
          },
          {
            icon: SUNNYSIDE.icons.expression_confused,
            name: t("guide"),
            id: "guide",
          },
          { icon: SUNNYSIDE.icons.lightning, name: "Streaks", id: "streaks" },
        ]}
      >
        {tab === "pet" && (
          <FactionPetContent
            faction={faction}
            now={now}
            autosaving={autosaving}
            refreshing={refreshing}
            fedXP={fedXP}
            setFedXP={setFedXP}
            handleRefresh={handleRefresh}
            collectivePet={collectivePet}
            week={week}
            streak={streak}
          />
        )}
        {tab === "guide" && <FactionPetGuide onClose={onAcknowledge} />}
        {tab === "streaks" && <FactionPetStreaks onClose={onAcknowledge} />}
      </CloseButtonPanel>
    </>
  );
};

const FactionPetContent: React.FC<{
  faction: Faction;
  now: number;
  autosaving: boolean;
  refreshing: boolean;
  fedXP: number;
  setFedXP: React.Dispatch<React.SetStateAction<number>>;
  handleRefresh: () => Promise<void>;
  collectivePet: CollectivePet | undefined;
  week: string;
  streak: number;
}> = ({
  faction,
  now,
  autosaving,
  setFedXP,
  handleRefresh,
  collectivePet,
  week,
  refreshing,
  fedXP,
  streak,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const inventory = useSelector(gameService, _inventory);

  const pet = faction.pet as FactionPet;

  const day = getFactionWeekday(now);

  // All pets sleep for the first day of the week if the streak is 0
  // const wakeTime = new Date(week).getTime() + PET_SLEEP_DURATION;

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRequestIdx, setSelectedRequestIdx] = useState(0);
  const [showBoostInfo, setShowBoostInfo] = useState(false);

  const selectedRequest = pet.requests[selectedRequestIdx] as FactionPetRequest;

  const handleFeed = (amount = 1) => {
    gameService.send({
      type: "factionPet.fed",
      requestIndex: selectedRequestIdx,
      amount,
    });
    if (!autosaving) gameService.send({ type: "SAVE" });

    const totalXP = getTotalXPForRequest(
      gameService.getSnapshot().context.state,
      pet.requests[selectedRequestIdx],
    );
    setFedXP((prev) => prev + totalXP);
    handleRefresh(); // update pet xp upon feeding
    setShowConfirm(false);
  };
  const fulfilled = selectedRequest.dailyFulfilled?.[day] ?? 0;

  const selectedRequestReward = (amount = 1) =>
    calculatePoints(
      fulfilled,
      PET_FED_REWARDS_KEY[selectedRequestIdx as DifficultyIndex],
      amount,
    );

  const { goalXP } = collectivePet ?? { goalXP: 0 };

  const canFulfillRequest = (amount = 1) =>
    (inventory[selectedRequest.food] ?? new Decimal(0)).gte(
      selectedRequest.quantity * amount,
    );
  const boost = (amount = 1) =>
    getKingdomPetBoost(
      gameService.getSnapshot().context.state,
      selectedRequestReward(amount),
    )[0];
  const boostedMarks = (amount = 1) =>
    selectedRequestReward(amount) + boost(amount);

  const singularReward = selectedRequestReward();
  const singularBoost = boost();
  const singularBoostedMarks = singularReward + singularBoost;
  const singularCanFulfillRequest = canFulfillRequest();

  const isContributingMemberForThisWeek = pet.requests.every(
    (request) => getKeys(request.dailyFulfilled).length > 0,
  );

  const lastWeek = getWeekKey({
    date: new Date(new Date(week).getTime() - 7 * 24 * 60 * 60 * 1000),
  });
  const isStreakWeek =
    (faction?.history[lastWeek]?.collectivePet?.streak ?? 0) >= 2;
  const isBoostCooldown =
    faction?.boostCooldownUntil && faction.boostCooldownUntil > now;
  return (
    <div>
      {!showConfirm && (
        <SplitScreenView
          mobileReversePanelOrder
          content={
            <div className="flex flex-col space-y-2 w-full">
              <div className="flex flex-wrap justify-between items-center gap-1">
                <Label
                  type="default"
                  className={classNames({
                    pulse: refreshing || autosaving,
                  })}
                >
                  {t("faction.pet.weeklyGoal", {
                    goalXP: goalXP.toLocaleString(),
                    totalXP: fedXP.toLocaleString(),
                  })}
                </Label>
                {isBoostCooldown && (
                  <Label type="danger" className="text-xs">
                    {"XP boost cooldown until:"}{" "}
                    {new Date(
                      faction?.boostCooldownUntil ?? 0,
                    ).toLocaleString()}
                  </Label>
                )}
                {streak > 0 && (
                  <Label
                    type={streak >= 2 ? "success" : "default"}
                    icon={isStreakWeek ? powerup : ""}
                    secondaryIcon={
                      isStreakWeek && pet.qualifiesForBoost
                        ? SUNNYSIDE.icons.confirm
                        : ""
                    }
                  >
                    {t("faction.pet.streak", { streak })}
                  </Label>
                )}
              </div>
              <p className="hidden sm:block text-xs p-1 pb-2">
                {t("faction.pet.gatherResources")}
              </p>
              <div className="flex w-full flex-wrap justify-between gap-2 pl-0.5 pb-2">
                {pet.requests.map((request, idx) => {
                  const fulfilled = request.dailyFulfilled[day] ?? 0;
                  const points = calculatePoints(
                    fulfilled,
                    PET_FED_REWARDS_KEY[idx as DifficultyIndex],
                  );

                  const boost = getKingdomPetBoost(
                    gameService.getSnapshot().context.state,
                    points,
                  )[0];

                  const boostedMarks = points + boost;

                  return (
                    <OuterPanel
                      key={JSON.stringify(request)}
                      className={classNames(
                        "flex relative flex-col flex-1 items-center p-2 cursor-pointer hover:bg-brown-300",
                        { "img-highlight": selectedRequestIdx === idx },
                      )}
                      onClick={() => setSelectedRequestIdx(idx)}
                    >
                      <div className="flex flex-1 justify-center items-center mb-4 w-full relative">
                        <SquareIcon
                          width={24}
                          icon={
                            ITEM_DETAILS[request.food as InventoryItemName]
                              .image
                          }
                        />
                        <Label
                          icon={ITEM_DETAILS["Mark"].image}
                          secondaryIcon={
                            boost ? SUNNYSIDE.icons.lightning : undefined
                          }
                          type="warning"
                          className="absolute h-6"
                          iconWidth={10}
                          style={{
                            width: "calc(100% + 10px)",
                            bottom: "-24px",
                            left: "-4px",
                          }}
                        >
                          <span className={boost ? "pl-1.5" : ""}>
                            {formatNumber(boostedMarks)}
                          </span>
                        </Label>
                      </div>
                      {selectedRequestIdx === idx && (
                        <div id="select-box">
                          <img
                            className="absolute pointer-events-none"
                            src={SUNNYSIDE.ui.selectBoxTL}
                            style={{
                              top: `${PIXEL_SCALE * -3}px`,
                              left: `${PIXEL_SCALE * -3}px`,
                              width: `${PIXEL_SCALE * 8}px`,
                            }}
                          />
                          <img
                            className="absolute pointer-events-none"
                            src={SUNNYSIDE.ui.selectBoxTR}
                            style={{
                              top: `${PIXEL_SCALE * -3}px`,
                              right: `${PIXEL_SCALE * -3}px`,
                              width: `${PIXEL_SCALE * 8}px`,
                            }}
                          />
                        </div>
                      )}
                    </OuterPanel>
                  );
                })}
              </div>
              {!!collectivePet?.streak && collectivePet.streak > 0 && (
                <div className="flex items-center space-x-1">
                  <p className="text-xs pb-1">{`${t("faction.pet.contributingMember")}: `}</p>
                  <img
                    className="w-3"
                    src={
                      isContributingMemberForThisWeek
                        ? SUNNYSIDE.icons.confirm
                        : SUNNYSIDE.icons.close
                    }
                  />
                </div>
              )}
            </div>
          }
          panel={
            <div className="flex flex-col justify-between h-full sm:items-center">
              <div className="flex flex-col items-center space-y-1 px-1.5 mb-1">
                <div className="flex items-center relative">
                  <BoostInfoPanel
                    feature="pet"
                    show={showBoostInfo}
                    baseAmount={singularReward}
                    onClick={() => setShowBoostInfo(false)}
                  />
                  <Label
                    onClick={() => setShowBoostInfo(!showBoostInfo)}
                    icon={ITEM_DETAILS["Mark"].image}
                    secondaryIcon={
                      singularBoost ? SUNNYSIDE.icons.lightning : undefined
                    }
                    type="warning"
                    className="m-1 cursor-pointer"
                  >
                    <span className={singularBoost ? "pl-1.5" : ""}>
                      {`${formatNumber(singularBoostedMarks)} ${t("marks")}`}
                    </span>
                  </Label>
                </div>
                <div className="hidden sm:flex flex-col space-y-1 w-full justify-center items-center">
                  <p className="text-sm">{selectedRequest.food}</p>
                  <SquareIcon
                    icon={
                      ITEM_DETAILS[selectedRequest.food as InventoryItemName]
                        .image
                    }
                    width={12}
                  />
                </div>
                <RequirementLabel
                  className={classNames(
                    "flex justify-between items-center sm:justify-center",
                    { "-mt-1": isMobile },
                  )}
                  showLabel={isMobile}
                  hideIcon={!isMobile}
                  type="item"
                  item={selectedRequest.food}
                  balance={inventory[selectedRequest.food] ?? new Decimal(0)}
                  requirement={new Decimal(selectedRequest.quantity)}
                />
              </div>
              <div className="flex flex-row sm:flex-col gap-1 w-full">
                <Button
                  disabled={!singularCanFulfillRequest}
                  onClick={() => handleFeed()}
                >
                  {`${t("deliver")} ${selectedRequest.quantity}`}
                </Button>
                <Button
                  disabled={!canFulfillRequest(10)}
                  onClick={() => setShowConfirm(true)}
                >
                  {`${t("deliver")} ${selectedRequest.quantity * 10}`}
                </Button>
              </div>
            </div>
          }
        />
      )}
      {showConfirm && (
        <InnerPanel>
          <div className="space-y-3">
            <span className="text-xs sm:text-sm">
              {t("faction.donation.confirm", {
                factionPoints: formatNumber(boostedMarks(10)),
              })}
            </span>
            <div className="flex flex-col space-y-1">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <SquareIcon
                    icon={ITEM_DETAILS[selectedRequest.food].image}
                    width={7}
                  />
                  <span className="text-xs sm:text-sm ml-1">
                    {selectedRequest.food}
                  </span>
                </div>
                <span className="text-xs">{`${selectedRequest.quantity * 10}`}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-1 mt-2">
            <Button onClick={() => setShowConfirm(false)}>{t("cancel")}</Button>
            <Button onClick={() => handleFeed(10)}>{t("confirm")}</Button>
          </div>
        </InnerPanel>
      )}
    </div>
  );
};

const FactionPetGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <InnerPanel>
      <div className="p-2">
        <img src="" className="w-full mx-auto rounded-lg mb-2" />
        <div className="flex mb-2">
          <div className="w-12 flex justify-center">
            <img
              src={ITEM_DETAILS["Pumpkin Soup"].image}
              className="h-6 mr-2 object-contain"
            />
          </div>
          <p className="text-xs  flex-1">{t("guide.factionPet.one")}</p>
        </div>
        <div className="flex mb-2">
          <div className="w-12 flex justify-center">
            <img src={xpIcon} className="h-6 mr-2 object-contain" />
          </div>
          <p className="text-xs flex-1">{t("guide.factionPet.two")}</p>
        </div>
        <div className="flex mb-2">
          <div className="w-12 flex justify-center">
            <img
              src={SUNNYSIDE.icons.sad}
              className="h-6 mr-2 object-contain"
            />
          </div>
          <p className="text-xs flex-1">{t("guide.factionPet.three")}</p>
        </div>
        <div className="flex mb-2">
          <div className="w-12 flex justify-center">
            <img
              src={SUNNYSIDE.icons.lightning}
              className="h-6 mr-2 object-contain"
            />
          </div>
          <p className="text-xs flex-1">{t("guide.factionPet.four")}</p>
        </div>
        <div className="flex mb-2">
          <div className="w-12 flex justify-center">
            <img
              src={SUNNYSIDE.icons.expression_confused}
              className="h-6 mr-2 object-contain"
            />
          </div>
          <p className="text-xs flex-1">{t("guide.factionPet.five")}</p>
        </div>
        <div className="flex mb-2">
          <div className="w-12 flex justify-center">
            <img
              src={ITEM_DETAILS["Mark"].image}
              className="h-6 mr-2 object-contain"
            />
          </div>
          <p className="text-xs flex-1">{t("guide.factionPet.six")}</p>
        </div>
      </div>
      <Button
        className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
        onClick={onClose}
      >
        {t("ok")}
      </Button>
    </InnerPanel>
  );
};

const FactionPetStreaks: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <InnerPanel>
      <div className="p-2">
        <div className="flex items-center mb-2">
          <div className="w-12 flex justify-center">
            <img src={xpIcon} className="h-4 mr-2 object-contain" />
          </div>
          <p className="text-sm flex-1">{`Streaks Explained`}</p>
        </div>
        <ul className="flex mr-2 list-inside flex-col mb-2 space-y-2">
          <li className="text-xs flex-1 flex">
            <div className="mx-2">{`-`}</div>
            <p>{t("guide.streak.one")}</p>
          </li>
          <li className="text-xs flex-1 flex">
            <div className="mx-2">{`-`}</div>
            <p>{t("guide.streak.two")}</p>
          </li>
          <li className="text-xs flex-1 flex">
            <div className="mx-2">{`-`}</div>
            <p>{t("guide.streak.three")}</p>
          </li>
          <li className="text-xs flex-1 flex">
            <div className="mx-2">{`-`}</div>
            <p>{t("guide.streak.four")}</p>
          </li>
        </ul>
        <div className="space-y-1 mt-1">
          <p className="my-1 text-xs">{t("guide.streak.beyond")}</p>
          <p className="my-1 text-xs">{t("guide.streak.furtherInfo")}</p>
        </div>
      </div>
      <Button
        className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
        onClick={onClose}
      >
        {t("ok")}
      </Button>
    </InnerPanel>
  );
};
