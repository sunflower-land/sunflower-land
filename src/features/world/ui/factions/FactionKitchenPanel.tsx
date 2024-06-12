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
  FACTION_KITCHEN_START_TIME,
} from "features/game/events/landExpansion/deliverFactionKitchen";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import { isMobile } from "mobile-device-detect";
import Decimal from "decimal.js-light";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import classNames from "classnames";
import { secondsToString } from "lib/utils/time";
import { factionKitchenWeekEndTime } from "./lib/utils";
import { SUNNYSIDE } from "assets/sunnyside";
import { TypingMessage } from "../TypingMessage";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  bumpkinParts: Equipped;
}

const _faction = (state: MachineState) =>
  state.context.state.faction as Faction;
const _inventory = (state: MachineState) => state.context.state.inventory;

export const FactionKitchenPanel: React.FC<Props> = ({ bumpkinParts }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const inventory = useSelector(gameService, _inventory);
  const faction = useSelector(gameService, _faction);
  const kitchen = faction.kitchen;
  const [selectedRequestIdx, setSelectedRequestIdx] = useState<number>(0);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const now = Date.now();

  if (now < FACTION_KITCHEN_START_TIME) {
    return (
      <CloseButtonPanel bumpkinParts={bumpkinParts}>
        <div className="p-1 space-y-2 mb-1">
          <div className="flex justify-between">
            <Label type="default">{`Kitchen`}</Label>
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {t("faction.kitchen.opensIn", {
                time: secondsToString(
                  (FACTION_KITCHEN_START_TIME - now) / 1000,
                  { length: "medium", removeTrailingZeros: true }
                ),
              })}
            </Label>
          </div>
          <TypingMessage
            message={t("faction.kitchen.notReady")}
            onMessageEnd={() => undefined}
          />
        </div>
      </CloseButtonPanel>
    );
  }

  if (!kitchen) {
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

  const handleDeliver = () => {
    gameService.send({
      type: "factionKitchen.delivered",
      resourceIndex: selectedRequestIdx,
    });
    setShowConfirm(false);
  };

  const selectedRequest = kitchen.requests[
    selectedRequestIdx
  ] as ResourceRequest;

  const secondsTillWeekEnd = (factionKitchenWeekEndTime({ now }) - now) / 1000;
  const selectedRequestReward = Math.max(
    BASE_POINTS - selectedRequest.deliveryCount * 2,
    1
  );

  const canFulfillRequest = (
    inventory[selectedRequest.item] ?? new Decimal(0)
  ).gte(selectedRequest.amount);

  return (
    <CloseButtonPanel bumpkinParts={bumpkinParts}>
      <div className="p-1 space-y-2">
        <div className="flex justify-between">
          <Label type="default">{`Kitchen`}</Label>
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            {t("faction.kitchen.newRequests", {
              time: secondsToString(secondsTillWeekEnd, {
                length: "medium",
                removeTrailingZeros: true,
              }),
            })}
          </Label>
        </div>
        {!showConfirm && (
          <>
            <p className="block sm:hidden text-xs pb-1">
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
                    {kitchen.requests.map((request, idx) => (
                      <OuterPanel
                        key={JSON.stringify(request)}
                        className={classNames(
                          "flex relative flex-col flex-1 items-center p-2 cursor-pointer hover:bg-brown-300",
                          {
                            "img-highlight": selectedRequestIdx === idx,
                          }
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
                            style={{
                              width: isMobile ? "113%" : "117%",
                              bottom: "-24px",
                              left: "-4px",
                            }}
                          >
                            {Math.max(
                              BASE_POINTS - request.deliveryCount * 2,
                              1
                            )}
                          </Label>
                        </div>
                        {selectedRequestIdx === idx && (
                          <div id="select-box">
                            <img
                              className="absolute pointer-events-none"
                              src={selectBoxTL}
                              style={{
                                top: `${PIXEL_SCALE * -3}px`,
                                left: `${PIXEL_SCALE * -3}px`,
                                width: `${PIXEL_SCALE * 8}px`,
                              }}
                            />
                            <img
                              className="absolute pointer-events-none"
                              src={selectBoxTR}
                              style={{
                                top: `${PIXEL_SCALE * -3}px`,
                                right: `${PIXEL_SCALE * -3}px`,
                                width: `${PIXEL_SCALE * 8}px`,
                              }}
                            />
                          </div>
                        )}
                      </OuterPanel>
                    ))}
                  </div>
                </div>
              }
              panel={
                <div className="flex flex-col justify-between h-full sm:items-center">
                  <div className="flex flex-col space-y-1 px-1.5 mb-1">
                    <Label
                      icon={ITEM_DETAILS["Mark"].image}
                      type="warning"
                      className="m-1"
                    >
                      {`${selectedRequestReward} marks`}
                    </Label>
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
                        {
                          "-mt-1": isMobile,
                        }
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
                  <Button
                    disabled={!canFulfillRequest}
                    onClick={() => setShowConfirm(true)}
                  >{`${t("deliver")} ${selectedRequest.amount}`}</Button>
                </div>
              }
            />
          </>
        )}
        {showConfirm && (
          <>
            <div className="space-y-3">
              <span className="text-xs sm:text-sm">
                {t("faction.donation.confirm", {
                  factionPoints: selectedRequestReward,
                  reward: selectedRequestReward > 1 ? "marks" : "mark",
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
                  <span className="text-xs">{`${selectedRequest.amount}`}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-1 mt-2">
              <Button onClick={() => setShowConfirm(false)}>
                {t("cancel")}
              </Button>
              <Button onClick={handleDeliver}>{t("confirm")}</Button>
            </div>
          </>
        )}
      </div>
    </CloseButtonPanel>
  );
};
