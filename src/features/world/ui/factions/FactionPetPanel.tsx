import { useSelector } from "@xstate/react";
import { Label } from "components/ui/Label";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { SquareIcon } from "components/ui/SquareIcon";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { MachineState } from "features/game/lib/gameMachine";
import {
  Faction,
  FactionName,
  FactionPetRequest,
  InventoryItemName,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { capitalize } from "lib/utils/capitalize";
import React, { useContext, useEffect, useState } from "react";
import { TypingMessage } from "../TypingMessage";
import {
  calculatePoints,
  getFactionWeek,
  getFactionWeekEndTime,
  getFactionWeekday,
} from "features/game/lib/factions";
import { OuterPanel } from "components/ui/Panel";
import classNames from "classnames";
import { isMobile } from "mobile-device-detect";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import {
  DifficultyIndex,
  PET_FED_REWARDS_KEY,
  getTotalXPForRequest,
} from "features/game/events/landExpansion/feedFactionPet";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { getFactionPetUpdate } from "./actions/getFactionPetUpdate";

import powerup from "assets/icons/level_up.png";

interface Props {
  onClose: () => void;
}

type PetName = "sable" | "snaggle" | "tater" | "blaze";

const REFRESH_INTERVAL = 10 * 1000;

const FACTION_PET_NAMES: Record<FactionName, PetName> = {
  bumpkins: "tater",
  goblins: "snaggle",
  sunflorians: "blaze",
  nightshades: "sable",
};
const _autosaving = (state: MachineState) => state.matches("autosaving");
const _farmId = (state: MachineState) => state.context.farmId;
const _faction = (state: MachineState) =>
  state.context.state.faction as Faction;
const _inventory = (state: MachineState) => state.context.state.inventory;

export const FactionPetPanel: React.FC<Props> = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const faction = useSelector(gameService, _faction);
  const farmId = useSelector(gameService, _farmId);
  const inventory = useSelector(gameService, _inventory);
  const autosaving = useSelector(gameService, _autosaving);

  const week = getFactionWeek({ date: new Date() });
  const pet = faction.pet;
  const collectivePet = faction.history[week].collectivePet;
  const now = Date.now();
  const day = getFactionWeekday(now);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRequestIdx, setSelectedRequestIdx] = useState(0);
  const [fedXP, setFedXP] = useState(collectivePet?.totalXP ?? 0);
  const [streak, setStreak] = useState(collectivePet?.streak ?? 0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (refreshing || autosaving) return;

      handleRefresh();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  });

  if (!pet || !collectivePet) {
    return (
      <CloseButtonPanel>
        <div className="p-1 space-y-2">
          <Label type="default">
            {capitalize(FACTION_PET_NAMES[faction.name])}
          </Label>
          <TypingMessage
            message={t("faction.kitchen.preparing")}
            onMessageEnd={() => undefined}
          />
        </div>
      </CloseButtonPanel>
    );
  }

  const selectedRequest = pet.requests[selectedRequestIdx] as FactionPetRequest;

  const handleFeed = () => {
    gameService.send({
      type: "factionPet.fed",
      requestIndex: selectedRequestIdx,
    });
    if (!autosaving) gameService.send("SAVE");

    const totalXP = getTotalXPForRequest(pet.requests[selectedRequestIdx]);
    setFedXP((prev) => prev + totalXP);
    setShowConfirm(false);
  };

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

      setRefreshing(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error fetching updated pet data: ", e);
    }
  };

  const secondsTillWeekEnd =
    (getFactionWeekEndTime({ date: new Date() }) - now) / 1000;
  const fulfilled = selectedRequest.dailyFulfilled?.[day] ?? 0;
  const selectedRequestReward = calculatePoints(
    fulfilled,
    PET_FED_REWARDS_KEY[selectedRequestIdx as DifficultyIndex],
  );
  const { goalXP } = collectivePet;

  const canFulfillRequest = (
    inventory[selectedRequest.food] ?? new Decimal(0)
  ).gte(selectedRequest.quantity);

  return (
    <>
      <Label
        icon={SUNNYSIDE.icons.stopwatch}
        type="info"
        className="absolute right-0 -top-7 shadow-md"
        style={{
          wordSpacing: 0,
        }}
      >
        {`${t("faction.pet.newRequests", {
          time: secondsToString(secondsTillWeekEnd, {
            length: "medium",
            removeTrailingZeros: true,
          }),
        })}`}
      </Label>
      <CloseButtonPanel>
        <div className="p-1 space-y-2">
          <div className="flex justify-between items-center">
            <Label
              type="default"
              className={classNames({
                pulse: refreshing || autosaving,
              })}
            >
              {t("faction.pet.weeklyGoal", { goalXP, totalXP: fedXP })}
            </Label>
            {streak > 0 && (
              <Label
                type={streak >= 3 ? "success" : "default"}
                icon={streak >= 3 ? powerup : ""}
              >
                {t("faction.pet.streak", { streak })}
              </Label>
            )}
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
                      {pet.requests.map((request, idx) => {
                        const fulfilled = request.dailyFulfilled[day] ?? 0;
                        const points = calculatePoints(
                          fulfilled,
                          PET_FED_REWARDS_KEY[idx as DifficultyIndex],
                        );

                        return (
                          <OuterPanel
                            key={JSON.stringify(request)}
                            className={classNames(
                              "flex relative flex-col flex-1 items-center p-2 cursor-pointer hover:bg-brown-300",
                              {
                                "img-highlight": selectedRequestIdx === idx,
                              },
                            )}
                            onClick={() => setSelectedRequestIdx(idx)}
                          >
                            <div className="flex flex-1 justify-center items-center mb-4 w-full relative">
                              <SquareIcon
                                width={24}
                                icon={
                                  ITEM_DETAILS[
                                    request.food as InventoryItemName
                                  ].image
                                }
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
                                {points}
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
                        );
                      })}
                    </div>
                  </div>
                }
                panel={
                  <div className="flex flex-col justify-between h-full sm:items-center">
                    <div className="flex flex-col items-center space-y-1 px-1.5 mb-1">
                      <Label
                        icon={ITEM_DETAILS["Mark"].image}
                        type="warning"
                        className="m-1"
                      >
                        {`${selectedRequestReward} marks`}
                      </Label>
                      <div className="hidden sm:flex flex-col space-y-1 w-full justify-center items-center">
                        <p className="text-sm">{selectedRequest.food}</p>
                        <SquareIcon
                          icon={
                            ITEM_DETAILS[
                              selectedRequest.food as InventoryItemName
                            ].image
                          }
                          width={12}
                        />
                      </div>
                      <RequirementLabel
                        className={classNames(
                          "flex justify-between items-center sm:justify-center",
                          {
                            "-mt-1": isMobile,
                          },
                        )}
                        showLabel={isMobile}
                        hideIcon={!isMobile}
                        type="item"
                        item={selectedRequest.food}
                        balance={
                          inventory[selectedRequest.food] ?? new Decimal(0)
                        }
                        requirement={new Decimal(selectedRequest.quantity)}
                      />
                    </div>
                    <Button
                      disabled={!canFulfillRequest}
                      onClick={() => setShowConfirm(true)}
                    >{`${t("deliver")} ${selectedRequest.quantity}`}</Button>
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
                        icon={ITEM_DETAILS[selectedRequest.food].image}
                        width={7}
                      />
                      <span className="text-xs sm:text-sm ml-1">
                        {selectedRequest.food}
                      </span>
                    </div>
                    <span className="text-xs">{`${selectedRequest.quantity}`}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-1 mt-2">
                <Button onClick={() => setShowConfirm(false)}>
                  {t("cancel")}
                </Button>
                <Button onClick={handleFeed}>{t("confirm")}</Button>
              </div>
            </>
          )}
        </div>
      </CloseButtonPanel>
    </>
  );
};
