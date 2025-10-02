import { useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useEffect, useState } from "react";
import lightning from "assets/icons/lightning.png";
import {
  calculatePoints,
  getFactionWeekday,
  getWeekKey,
} from "features/game/lib/factions";
import { formatNumber, shortenCount } from "lib/utils/formatNumber";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BoostInfoPanel } from "features/world/ui/factions/BoostInfoPanel";
import {
  FactionName,
  FactionPetRequest,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import classNames from "classnames";
import {
  DifficultyIndex,
  getKingdomPetBoost,
  getTotalXPForRequest,
  PET_FED_REWARDS_KEY,
} from "features/game/events/landExpansion/feedFactionPet";
import GoblinsPetSleeping from "public/world/goblins_pet_sleeping.webp";
import NightshadesPetSleeping from "public/world/nightshades_pet_sleeping.webp";
import BumpkinsPetSleeping from "public/world/bumpkins_pet_sleeping.webp";
import SunflorainsPetSleeping from "public/world/sunflorians_pet_sleeping.webp";
import GoblinsPetHungry from "public/world/goblins_pet_hungry.webp";
import NightshadesPetHungry from "public/world/nightshades_pet_hungry.webp";
import BumpkinsPetHungry from "public/world/bumpkins_pet_hungry.webp";
import SunflorainsPetHungry from "public/world/sunflorians_pet_hungry.webp";
import GoblinsPetHappy from "public/world/goblins_pet_happy.webp";
import NightshadesPetHappy from "public/world/nightshades_pet_happy.webp";
import BumpkinsPetHappy from "public/world/bumpkins_pet_happy.webp";
import SunflorainsPetHappy from "public/world/sunflorians_pet_happy.webp";
import powerup from "assets/icons/level_up.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { getKeys } from "features/game/types/decorations";
import { getFactionPetUpdate } from "features/world/ui/factions/actions/getFactionPetUpdate";
import {
  FACTION_PET_REFRESH_INTERVAL,
  getPetState,
  PET_SLEEP_DURATION,
  PetState,
} from "features/world/ui/factions/FactionPetPanel";

export const FACTION_PET_MAPPING: Record<
  FactionName,
  (petState: PetState) => string
> = {
  goblins: (petState) =>
    petState === "sleeping"
      ? GoblinsPetSleeping
      : petState === "hungry"
        ? GoblinsPetHungry
        : GoblinsPetHappy,
  nightshades: (petState) =>
    petState === "sleeping"
      ? NightshadesPetSleeping
      : petState === "hungry"
        ? NightshadesPetHungry
        : NightshadesPetHappy,
  bumpkins: (petState) =>
    petState === "sleeping"
      ? BumpkinsPetSleeping
      : petState === "hungry"
        ? BumpkinsPetHungry
        : BumpkinsPetHappy,
  sunflorians: (petState) =>
    petState === "sleeping"
      ? SunflorainsPetSleeping
      : petState === "hungry"
        ? SunflorainsPetHungry
        : SunflorainsPetHappy,
};

const factionPetIcon = (
  factionName: FactionName,
  petState: PetState,
): string => {
  return FACTION_PET_MAPPING[factionName](petState);
};

const calculateMarks = (state: GameState, index: number) => {
  const fulfilled = (day: number, request: FactionPetRequest) => {
    return request.dailyFulfilled[day] ?? 0;
  };

  const points = (amount = 1, fulfilledCount = 0) =>
    calculatePoints(
      fulfilledCount,
      PET_FED_REWARDS_KEY[index as DifficultyIndex],
      amount,
    );

  const boost = (amount = 1, fulfilledCount = 0) =>
    getKingdomPetBoost(state, points(amount, fulfilledCount))[0];

  const marksEarned = (amount = 1, fulfilledCount = 0) =>
    points(amount, fulfilledCount) + boost(amount, fulfilledCount);

  // Days from Monday until today with fulfilled donations
  const fulfilledDaysUpToToday = (today: number, request: FactionPetRequest) =>
    Array.from({ length: today }, (_, day) => day + 1).filter(
      (day) => fulfilled(day, request) > 0,
    );

  const calculateRequestTotalEarn = (
    daysUpToToday: number[],
    request: FactionPetRequest,
  ) => {
    return daysUpToToday.reduce((sum, day) => {
      return sum + marksEarned(fulfilled(day, request), 0);
    }, 0);
  };

  return {
    fulfilled,
    points,
    boost,
    marksEarned,
    fulfilledDaysUpToToday,
    calculateRequestTotalEarn,
  };
};

export const petDailyDonationCount = (state: GameState) => {
  const faction = state.faction;
  const npc = faction?.pet;
  const now = Date.now();
  const today = getFactionWeekday(now);
  return (
    npc?.requests.reduce(
      (count, request) =>
        (request.dailyFulfilled[today] ?? 0) <= 0 ? count + 1 : count,
      0,
    ) ?? 0
  );
};

export const PetDonationInfo: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const farmId = useSelector(gameService, (state) => state.context.farmId);
  const [weeklyMarksEarned, setWeeklyMarksEarned] = useState(0);
  const [showModalOverlay, setShowModalOverlay] = useState(-1);
  const [showBoostPopover, setShowBoostPopover] = useState(-1);

  const faction = state.faction;
  const npc = faction?.pet;
  const now = Date.now();
  const today = getFactionWeekday(now);
  let weeklyEarn = 0;
  const week = getWeekKey({ date: new Date() });

  const collectivePet = faction?.history?.[week]?.collectivePet;
  const [fedXP, setFedXP] = useState(collectivePet?.totalXP ?? 0);
  const [streak, setStreak] = useState(collectivePet?.streak ?? 0);
  const [refreshing, setRefreshing] = useState(false);
  const [petState, setPetState] = useState<PetState>(
    getPetState(collectivePet),
  );

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await getFactionPetUpdate({ farmId });

      if (!data) return;

      if (data.totalXP !== fedXP) {
        setFedXP(data.totalXP);
      }

      if (data.streak !== streak) {
        setStreak(data.streak);
      }

      setPetState(getPetState(data));
      setRefreshing(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error fetching updated pet data in codex: ", e);
    }
  };

  useEffect(() => {
    if (weeklyEarn > 0 && weeklyMarksEarned === 0) {
      setWeeklyMarksEarned(weeklyEarn);
    }
  }, [weeklyEarn]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (refreshing || petState === "sleeping") return;

      handleRefresh();
    }, FACTION_PET_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [petState]);

  if (petState === "sleeping") {
    return (
      <PetSleeping
        onWake={() => setPetState(getPetState(collectivePet))}
        factionName={faction?.name as FactionName}
      />
    );
  }

  const handleShowPopover = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    e.stopPropagation();
    showBoostPopover === index
      ? setShowBoostPopover(-1)
      : setShowBoostPopover(index);
  };

  const handleShowOverlay = (index: number) => {
    showModalOverlay === index
      ? setShowModalOverlay(-1)
      : setShowModalOverlay(index);
  };

  const { goalXP } = collectivePet ?? { goalXP: 0 };
  const lastWeek = getWeekKey({
    date: new Date(new Date(week).getTime() - 7 * 24 * 60 * 60 * 1000),
  });
  const isBoostCooldown =
    faction?.boostCooldownUntil && faction.boostCooldownUntil > Date.now();
  const isStreakWeek =
    (faction?.history[lastWeek]?.collectivePet?.streak ?? 0) >= 2;
  const isContributingMemberForThisWeek = npc?.requests.every(
    (request) => getKeys(request.dailyFulfilled).length > 0,
  );

  return (
    <InnerPanel className="my-3">
      <div className="p-0.5">
        <div className="flex flex-wrap justify-between pb-1 mr-2">
          <Label type="default">
            <p className="text-xxs sm:text-xs capitalize">
              {t("faction.codexDonationInfo.pet")}
            </p>
          </Label>
          <Label type="default" secondaryIcon={ITEM_DETAILS["Mark"].image}>
            <p className="text-xxs sm:text-xs">
              {t("faction.codexDonationInfo.weeklyEarn", {
                amount: weeklyMarksEarned,
              })}
            </p>
          </Label>
        </div>
        <div className="flex items-center gap-x-1 py-3 sm:py-2 pb-5 sm:pb-2">
          <img
            src={factionPetIcon(faction?.name as FactionName, petState)}
            className="px-1 min-h-16 md:min-h-14"
          />
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1 md:flex-row">
              <Label
                type="default"
                className={classNames({
                  pulse: refreshing,
                })}
              >
                <p className="text-xxs sm:text-xs">
                  {t("faction.codexDonationInfo.petWeeklyGoal", {
                    fedXP: shortenCount(fedXP),
                    goalXP: shortenCount(goalXP),
                  })}
                </p>
              </Label>
              {streak > 0 && (
                <Label
                  type={streak >= 2 ? "success" : "default"}
                  icon={isStreakWeek ? powerup : undefined}
                  secondaryIcon={
                    isStreakWeek && npc?.qualifiesForBoost
                      ? SUNNYSIDE.icons.confirm
                      : undefined
                  }
                >
                  <p className="text-xxs sm:text-xs">
                    {t("faction.pet.streak", { streak })}
                  </p>
                </Label>
              )}
            </div>
            {isBoostCooldown ? (
              <Label type="danger">
                <p className="text-xxs sm:text-xs">
                  {t("faction.codexDonationInfo.petXPBoostCooldown", {
                    time: new Date(
                      faction?.boostCooldownUntil ?? 0,
                    ).toLocaleString(),
                  })}
                </p>
              </Label>
            ) : (
              !!collectivePet?.streak &&
              collectivePet.streak > 0 && (
                <div className="flex items-center ml-1">
                  <p className="text-xxs sm:text-xs">{`${t("faction.pet.contributingMember")}: `}</p>
                  <img
                    className="w-3 ml-1"
                    src={
                      isContributingMemberForThisWeek
                        ? SUNNYSIDE.icons.confirm
                        : SUNNYSIDE.icons.close
                    }
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex flex-col gap-y-1">
          {npc?.requests.map((request, index) => {
            const {
              fulfilled,
              points,
              boost,
              marksEarned,
              fulfilledDaysUpToToday,
              calculateRequestTotalEarn,
            } = calculateMarks(state, index);

            const fulfilledToday = fulfilled(today, request);
            const hasFulfilledToday = fulfilledToday > 0;

            const baseAmount = points(1, fulfilledToday);
            const boostAmount = boost(1, fulfilledToday);
            const boostedMarks = baseAmount + boostAmount;

            const marksEarnedToday = marksEarned(fulfilledToday, 0);

            const itemName = request.food;
            const itemAmount = request.quantity;

            const fulfilledUpToToday = fulfilledDaysUpToToday(today, request);
            const hasFulfilledUpToToday = fulfilledUpToToday.length > 0;
            const requestTotalEarn = calculateRequestTotalEarn(
              fulfilledUpToToday,
              request,
            );
            weeklyEarn = weeklyEarn + requestTotalEarn;

            return (
              <>
                <div className="relative">
                  <ButtonPanel
                    key={index}
                    onClick={
                      !hasFulfilledUpToToday
                        ? undefined
                        : () => handleShowOverlay(index)
                    }
                    disabled={!hasFulfilledUpToToday}
                  >
                    <div className="flex justify-between items-center pt-1.5 sm:pt-0">
                      <div className="flex items-center sm:-mb-1 -ml-1">
                        <Box
                          image={ITEM_DETAILS[itemName].image}
                          count={new Decimal(itemAmount)}
                        />
                        <div className="flex flex-col p-1 pl-1.5 gap-y-1">
                          <p className="text-xs sm:text-sm">{itemName}</p>
                          <div
                            className="ml-0.5"
                            onClick={(e) => handleShowPopover(e, index)}
                          >
                            <Label
                              icon={ITEM_DETAILS["Mark"].image}
                              secondaryIcon={boostAmount ? lightning : null}
                              type="default"
                            >
                              <p className="text-xxs sm:text-xs">
                                {t("faction.codexDonationInfo.rewardLabel", {
                                  amount: formatNumber(boostedMarks),
                                })}
                              </p>
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="hidden sm:flex mr-1">
                        <Label
                          type={hasFulfilledToday ? "success" : "warning"}
                          secondaryIcon={ITEM_DETAILS["Mark"].image}
                        >
                          <p className="text-xxs sm:text-xs">
                            {t("faction.codexDonationInfo.dailyEarnLabel", {
                              amount: hasFulfilledToday ? marksEarnedToday : 0,
                            })}
                          </p>
                        </Label>
                      </div>
                      {/* Mobile */}
                      <div className="absolute -top-3 right-0 sm:hidden">
                        <Label
                          type={hasFulfilledToday ? "success" : "warning"}
                          secondaryIcon={ITEM_DETAILS["Mark"].image}
                        >
                          <p className="text-xxs sm:text-xs">
                            {t("faction.codexDonationInfo.dailyEarnLabel", {
                              amount: hasFulfilledToday ? marksEarnedToday : 0,
                            })}
                          </p>
                        </Label>
                      </div>
                    </div>
                  </ButtonPanel>

                  {/* Marks Boost Popover */}
                  <div className="absolute left-[10%] top-8 text-xxs sm:text-xs">
                    <BoostInfoPanel
                      feature={"pet"}
                      show={showBoostPopover === index}
                      baseAmount={baseAmount}
                      onClick={() => setShowBoostPopover(-1)}
                    />
                  </div>
                </div>

                {/* Modal Overlay - Dontation Details */}
                <ItemDetailsOverlay
                  showModalOverlay={showModalOverlay}
                  setShowModalOverlay={setShowModalOverlay}
                  request={request}
                  itemName={itemName}
                  itemAmount={itemAmount}
                  index={index}
                  fulfilledUpToToday={fulfilledUpToToday}
                  requestTotalEarn={requestTotalEarn}
                />
              </>
            );
          })}
        </div>
      </div>
    </InnerPanel>
  );
};

const ItemDetailsOverlay: React.FC<{
  showModalOverlay: number;
  setShowModalOverlay: (number: number) => void;
  request: FactionPetRequest;
  itemName: InventoryItemName;
  itemAmount: number;
  index: number;
  fulfilledUpToToday: number[];
  requestTotalEarn: number;
}> = ({
  showModalOverlay,
  setShowModalOverlay,
  request,
  itemName,
  itemAmount,
  index,
  fulfilledUpToToday,
  requestTotalEarn,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);

  const { fulfilled, marksEarned } = calculateMarks(state, index);

  return (
    <ModalOverlay
      show={showModalOverlay === index}
      onBackdropClick={() => setShowModalOverlay(-1)}
    >
      <CloseButtonPanel
        tabs={[{ name: itemName, icon: ITEM_DETAILS[itemName].image }]}
        onClose={() => setShowModalOverlay(-1)}
      >
        <div className="p-1 text-xs">
          <div className="p-1 pb-2">
            {fulfilledUpToToday.length > 1 && (
              <Label type="default" icon={ITEM_DETAILS["Mark"].image}>
                {t("faction.codexDonationInfo.TotalEarnLabel", {
                  amount: requestTotalEarn,
                })}
              </Label>
            )}
          </div>
          <thead>
            <tr className="bg-[#c285697d]">
              <th
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 w-1/5"
              >
                <p>{t("faction.codexDonationInfo.day")}</p>
              </th>
              <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
                <p>{t("faction.codexDonationInfo.donated")}</p>
              </th>
              <th
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 w-1/5"
              >
                <p>{t("faction.codexDonationInfo.marksEarned")}</p>
              </th>
              <th
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 w-1/5"
              >
                <p>{t("faction.codexDonationInfo.xp")}</p>
              </th>
            </tr>
          </thead>

          {fulfilledUpToToday.map((day, index) => {
            const fullfilledCount = fulfilled(day, request);
            const marksEarnedForDay = marksEarned(fullfilledCount, 0);
            const totalXPForDay = getTotalXPForRequest(
              state,
              request,
              fullfilledCount,
            );

            return (
              <tr
                key={index}
                className={classNames("relative", {
                  "bg-[#ead4aa]": index % 2 === 0,
                })}
              >
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 w-1/5"
                >
                  {day}
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 w-1/5"
                >
                  <span className="flex flex-row items-center">
                    {`${fullfilledCount}x(${itemAmount}`}
                    <img
                      src={ITEM_DETAILS[itemName].image}
                      className="ml-0.5 w-auto h-4"
                    />
                    {`)`}
                  </span>
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 w-1/5"
                >
                  {marksEarnedForDay}
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 w-1/5"
                >
                  {totalXPForDay}
                </td>
              </tr>
            );
          })}
        </div>
      </CloseButtonPanel>
    </ModalOverlay>
  );
};

const PetSleeping: React.FC<{
  onWake: () => void;
  factionName: FactionName;
}> = ({ onWake, factionName }) => {
  const { t } = useAppTranslation();
  const week = getWeekKey({ date: new Date() });
  const beginningOfWeek = new Date(week).getTime();
  const wakeTime = beginningOfWeek + PET_SLEEP_DURATION;

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = (wakeTime - Date.now()) / 1000;

      if (seconds <= 1) {
        onWake();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <InnerPanel className="my-3">
      <div className="p-0.5">
        <div className="flex flex-wrap justify-between pb-1">
          <Label type="default">
            <p className="text-xxs sm:text-xs">
              {t("faction.codexDonationInfo.pet")}
            </p>
          </Label>
          <Label type="default">
            <p className="text-xxs sm:text-xs">{`ZzzZzzz...`}</p>
          </Label>
        </div>
      </div>
      <div className="flex items-center gap-x-1 py-1 pb-2">
        <img
          src={factionPetIcon(factionName as FactionName, "sleeping")}
          className="px-1 min-h-16 md:min-h-14"
        />
        <div className="flex flex-col gap-y-1">
          <p className="text-xs">
            {t("faction.codexDonationInfo.petSleepingDesc1")}
          </p>
          <p className="text-xxs sm:text-xs">
            {t("faction.codexDonationInfo.petSleepingDesc2")}
          </p>
        </div>
      </div>
    </InnerPanel>
  );
};
