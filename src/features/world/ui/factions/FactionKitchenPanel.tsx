import React, { useContext, useState } from "react";
import { Equipped } from "features/game/types/bumpkin";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { Faction, ResourceRequest } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { SquareIcon } from "components/ui/SquareIcon";
import {
  BASE_POINTS,
  getKingdomKitchenBoost,
} from "features/game/events/landExpansion/deliverFactionKitchen";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { isMobile } from "mobile-device-detect";
import Decimal from "decimal.js-light";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import classNames from "classnames";
import { secondsToString } from "lib/utils/time";
import lightning from "assets/icons/lightning.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { TypingMessage } from "../TypingMessage";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  calculatePoints,
  getFactionWeekEndTime,
  getFactionWeekday,
} from "features/game/lib/factions";
import { formatNumber } from "lib/utils/formatNumber";
import { BoostInfoPanel } from "./BoostInfoPanel";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useNow } from "lib/utils/hooks/useNow";

interface Props {
  bumpkinParts: Equipped;
}

export const FACTION_KITCHEN_START_TIME = new Date(
  "2024-07-08T00:00:00Z",
).getTime();

const _faction = (state: MachineState) =>
  state.context.state.faction as Faction;
const _inventory = (state: MachineState) => state.context.state.inventory;
// TODO: Remove when feature released
const _game = (state: MachineState) => state.context.state;

export const FactionKitchenPanel: React.FC<Props> = ({ bumpkinParts }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const inventory = useSelector(gameService, _inventory);
  const faction = useSelector(gameService, _faction);
  const game = useSelector(gameService, _game);

  const kitchen = faction.kitchen;

  const [selectedRequestIdx, setSelectedRequestIdx] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBoostInfo, setShowBoostInfo] = useState(false);

  const now = useNow();
  const { totalSeconds: secondsTillWeekEnd } = useCountdown(
    getFactionWeekEndTime({ date: new Date(now) }),
  );

  if (!kitchen || kitchen.requests.length === 0) {
    return (
      <CloseButtonPanel bumpkinParts={bumpkinParts}>
        <div className="p-1 space-y-2">
          <Label type="default">{`Kitchen`}</Label>
          <TypingMessage
            message={t("faction.kitchen.preparing")}
            onMessageEnd={() => undefined}
          />
        </div>
      </CloseButtonPanel>
    );
  }

  const handleDeliver = (amount = 1) => {
    gameService.send({
      type: "factionKitchen.delivered",
      resourceIndex: selectedRequestIdx,
      amount,
    });
    setShowConfirm(false);
  };

  const selectedRequest = kitchen.requests[
    selectedRequestIdx
  ] as ResourceRequest;

  const day = getFactionWeekday(now);
  const fulfilled = selectedRequest.dailyFulfilled[day] ?? 0;
  const selectedRequestReward = (amount = 1) =>
    calculatePoints(fulfilled, BASE_POINTS, amount);

  const canFulfillRequest = (amount = 1) =>
    (inventory[selectedRequest.item] ?? new Decimal(0)).gte(
      selectedRequest.amount * amount,
    );

  const boost = (amount = 1) =>
    getKingdomKitchenBoost(game, selectedRequestReward(amount))[0];
  const boostedMarks = (amount = 1) =>
    selectedRequestReward(amount) + boost(amount);

  const singularReward = selectedRequestReward();
  const singularBoost = boost();
  const singularBoostedMarks = singularReward + singularBoost;
  const singularCanFulfillRequest = canFulfillRequest();

  return (
    <>
      <Label
        type="info"
        icon={SUNNYSIDE.icons.stopwatch}
        className="absolute right-0 -top-7 shadow-md"
      >
        {t("faction.kitchen.newRequests", {
          time: secondsToString(secondsTillWeekEnd, {
            length: "medium",
            removeTrailingZeros: true,
          }),
        })}
      </Label>
      <CloseButtonPanel bumpkinParts={bumpkinParts}>
        <>
          {!showConfirm && (
            <>
              <p className="block sm:hidden text-xs p-2 mb-1">
                {t("faction.kitchen.gatherResources")}
              </p>
              <SplitScreenView
                mobileReversePanelOrder
                content={
                  <div className="flex flex-col space-y-2 w-full">
                    <p className="hidden sm:block text-xs p-1 pb-2">
                      {t("faction.kitchen.gatherResources")}
                    </p>
                    <div className="flex w-full justify-between gap-2 pl-0.5 pb-2">
                      {kitchen.requests.map((request, idx) => {
                        const fulfilled = request.dailyFulfilled[day] ?? 0;
                        const points = calculatePoints(fulfilled, BASE_POINTS);

                        const boost = getKingdomKitchenBoost(
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
                                icon={ITEM_DETAILS[request.item].image}
                              />
                              <Label
                                icon={ITEM_DETAILS["Mark"].image}
                                type="warning"
                                className="absolute h-6"
                                iconWidth={10}
                                secondaryIcon={boost ? lightning : null}
                                style={{
                                  width: isMobile ? "113%" : "117%",
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
                              <div id="select-box" className="block">
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
                  </div>
                }
                panel={
                  <div className="flex flex-col justify-between h-full sm:items-center">
                    <div className="flex flex-col space-y-1 px-1.5 mb-1">
                      <div className="relative">
                        <BoostInfoPanel
                          feature="kitchen"
                          show={showBoostInfo}
                          baseAmount={singularReward}
                          onClick={() => setShowBoostInfo(false)}
                        />
                        <Label
                          icon={ITEM_DETAILS["Mark"].image}
                          secondaryIcon={singularBoost ? lightning : null}
                          type="warning"
                          className="m-1"
                          onClick={() => setShowBoostInfo(!showBoostInfo)}
                        >
                          <span className={singularBoost ? "pl-1.5" : ""}>
                            {`${formatNumber(singularBoostedMarks)} ${t("marks")}`}
                          </span>
                        </Label>
                      </div>
                      <div className="hidden sm:flex flex-col space-y-1 w-full justify-center items-center">
                        <p className="text-sm">{selectedRequest.item}</p>
                        <SquareIcon
                          icon={ITEM_DETAILS[selectedRequest.item].image}
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
                        item={selectedRequest.item}
                        balance={
                          inventory[selectedRequest.item] ?? new Decimal(0)
                        }
                        requirement={new Decimal(selectedRequest.amount)}
                      />
                    </div>
                    <div className="flex flex-row sm:flex-col gap-1 w-full">
                      <Button
                        disabled={!singularCanFulfillRequest}
                        onClick={() => handleDeliver()}
                      >
                        {`${t("deliver")} ${selectedRequest.amount}`}
                      </Button>
                      <Button
                        disabled={!canFulfillRequest(10)}
                        onClick={() => setShowConfirm(true)}
                      >
                        {`${t("deliver")} ${selectedRequest.amount * 10}`}
                      </Button>
                    </div>
                  </div>
                }
              />
            </>
          )}
          {showConfirm && (
            <>
              <div className="space-y-3 p-1">
                <span className="text-xs sm:text-sm">
                  {t("faction.donation.confirm", {
                    factionPoints: formatNumber(boostedMarks(10)),
                  })}
                </span>
                <div className="flex flex-col space-y-1">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <SquareIcon
                        icon={ITEM_DETAILS[selectedRequest.item].image}
                        width={7}
                      />
                      <span className="text-xs sm:text-sm ml-1">
                        {selectedRequest.item}
                      </span>
                    </div>
                    <span className="text-xs">{`${selectedRequest.amount * 10}`}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-1 mt-2">
                <Button onClick={() => setShowConfirm(false)}>
                  {t("cancel")}
                </Button>
                <Button onClick={() => handleDeliver(10)}>
                  {t("confirm")}
                </Button>
              </div>
            </>
          )}
        </>
      </CloseButtonPanel>
    </>
  );
};
