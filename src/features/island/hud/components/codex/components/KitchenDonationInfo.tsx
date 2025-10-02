import { useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useEffect, useState } from "react";
import lightning from "assets/icons/lightning.png";
import { calculatePoints, getFactionWeekday } from "features/game/lib/factions";
import {
  BASE_POINTS,
  getKingdomKitchenBoost,
} from "features/game/events/landExpansion/deliverFactionKitchen";
import { formatNumber } from "lib/utils/formatNumber";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BoostInfoPanel } from "features/world/ui/factions/BoostInfoPanel";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import {
  FactionName,
  GameState,
  InventoryItemName,
  ResourceRequest,
} from "features/game/types/game";
import { NPC_WEARABLES, NPCName } from "lib/npcs";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import classNames from "classnames";
import { isMobile } from "mobile-device-detect";

export const FACTION_CHEF_MAPPING: Record<FactionName, NPCName> = {
  goblins: "chef tuck",
  nightshades: "chef ebon",
  bumpkins: "chef maple",
  sunflorians: "chef lumen",
};

const calculateMarks = (state: GameState) => {
  const fulfilled = (day: number, request: ResourceRequest) => {
    return request.dailyFulfilled[day] ?? 0;
  };

  const points = (amount = 1, fulfilledCount = 0) =>
    calculatePoints(fulfilledCount, BASE_POINTS, amount);

  const boost = (amount = 1, fulfilledCount = 0) =>
    getKingdomKitchenBoost(state, points(amount, fulfilledCount))[0];

  const marksEarned = (amount = 1, fulfilledCount = 0) =>
    points(amount, fulfilledCount) + boost(amount, fulfilledCount);

  // Days from Monday until today with fulfilled donations
  const fulfilledDaysUpToToday = (today: number, request: ResourceRequest) =>
    Array.from({ length: today }, (_, day) => day + 1).filter(
      (day) => fulfilled(day, request) > 0,
    );

  const calculateRequestTotalEarn = (
    daysUpToToday: number[],
    request: ResourceRequest,
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

export const kitchenDailyDonationCount = (state: GameState) => {
  const faction = state.faction;
  const npc = faction?.kitchen;
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

export const KitchenDonationInfo: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const [weeklyMarksEarned, setWeeklyMarksEarned] = useState(0);
  const [showModalOverlay, setShowModalOverlay] = useState(-1);
  const [showBoostPopover, setShowBoostPopover] = useState(-1);

  const faction = state.faction;
  const chefName = FACTION_CHEF_MAPPING[faction?.name as FactionName];
  const npc = faction?.kitchen;
  const now = Date.now();
  const today = getFactionWeekday(now);
  let weeklyEarn = 0;

  useEffect(() => {
    if (weeklyEarn > 0 && weeklyMarksEarned === 0)
      setWeeklyMarksEarned(weeklyEarn);
  }, [weeklyEarn]);

  if (!npc || npc.requests.length === 0) {
    return <KitchenClosed chefName={chefName} />;
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

  const {
    fulfilled,
    points,
    boost,
    marksEarned,
    fulfilledDaysUpToToday,
    calculateRequestTotalEarn,
  } = calculateMarks(state);

  return (
    <InnerPanel className="my-3">
      <div className="p-0.5">
        <div className="flex flex-wrap justify-between pb-1 mr-2">
          <Label type="default">
            <p className="text-xxs sm:text-xs capitalize">
              {t("faction.codexDonationInfo.kitchen")}
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
          <NPCIcon
            width={isMobile ? PIXEL_SCALE * 18 : PIXEL_SCALE * 14}
            parts={NPC_WEARABLES[chefName as NPCName]}
          />
          <p className="text-xs">
            {t("faction.codexDonationInfo.kitchenDescription")}
          </p>
        </div>
        <div className="flex flex-col gap-y-1">
          {npc.requests.map((request, index) => {
            const fulfilledToday = fulfilled(today, request);
            const hasFulfilledToday = fulfilledToday > 0;

            const baseAmount = points(1, fulfilledToday);
            const boostAmount = boost(1, fulfilledToday);
            const boostedMarks = baseAmount + boostAmount;

            const marksEarnedToday = marksEarned(fulfilledToday, 0);

            const itemName = request.item;
            const itemAmount = request.amount;

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
                      feature={"kitchen"}
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
  request: ResourceRequest;
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

  const { fulfilled, marksEarned } = calculateMarks(state);

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
            </tr>
          </thead>

          {fulfilledUpToToday.map((day, index) => {
            const fullfilledCount = fulfilled(day, request);
            const marksEarnedForDay = marksEarned(fullfilledCount, 0);

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
              </tr>
            );
          })}
        </div>
      </CloseButtonPanel>
    </ModalOverlay>
  );
};

const KitchenClosed: React.FC<{ chefName: NPCName }> = ({ chefName }) => {
  const { t } = useAppTranslation();
  return (
    <InnerPanel className="my-3">
      <div className="p-0.5">
        <div className="flex flex-wrap justify-between">
          <Label type="default">
            <p className="text-xxs sm:text-xs">
              {t("faction.codexDonationInfo.kitchen")}
            </p>
          </Label>
          <Label type="default">
            <p className="text-xxs sm:text-xs">
              {t("faction.codexDonationInfo.kitchenClosed")}
            </p>
          </Label>
        </div>
      </div>
      <div className="flex items-center gap-x-1 py-1">
        <NPCIcon
          width={isMobile ? PIXEL_SCALE * 18 : PIXEL_SCALE * 14}
          parts={NPC_WEARABLES[chefName as NPCName]}
        />
        <div className="flex flex-wrap flex-col sm:flex-row gap-1">
          <p className="text-xs">
            {t("faction.codexDonationInfo.kitchenClosedDesc1")}
          </p>
          <p className="text-xxs sm:text-xs">
            {t("faction.codexDonationInfo.kitchenClosedDesc2")}
          </p>
        </div>
      </div>
    </InnerPanel>
  );
};
