import React, { useContext, useState } from "react";
import { Equipped } from "features/game/types/bumpkin";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import {
  Faction,
  FactionKitchen,
  ResourceRequest,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { SquareIcon } from "components/ui/SquareIcon";
import { BASE_POINTS } from "features/game/events/landExpansion/deliverFactionKitchen";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import { isMobile } from "mobile-device-detect";
import Decimal from "decimal.js-light";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import classNames from "classnames";

interface Props {
  bumpkinParts: Equipped;
  onClose: () => void;
}

const _faction = (state: MachineState) =>
  state.context.state.faction as Faction;
const _inventory = (state: MachineState) => state.context.state.inventory;

export const FactionKitchenPanel: React.FC<Props> = ({
  bumpkinParts,
  onClose,
}) => {
  const { gameService } = useContext(Context);

  const inventory = useSelector(gameService, _inventory);
  const faction = useSelector(gameService, _faction);
  const kitchen = faction.kitchen as FactionKitchen;
  const [selectedRequestIdx, setSelectedRequestIdx] = useState<number>(0);

  const handleDeliver = () => {
    gameService.send({
      type: "factionKitchen.delivered",
      resourceIndex: selectedRequestIdx,
    });
  };

  const selectedRequest = kitchen.requests[
    selectedRequestIdx
  ] as ResourceRequest;

  return (
    <CloseButtonPanel bumpkinParts={bumpkinParts}>
      <div className="p-1 space-y-2">
        <div className="flex justify-between">
          <Label type="default">{`Kitchen`}</Label>
          <Label type="info">{`3hrs left`}</Label>
        </div>

        <p className="block sm:hidden text-xs pb-1">{`So many new recruits... how will we feed them all! Can you help me gather some resources?`}</p>
        <SplitScreenView
          content={
            <div className="flex flex-col space-y-2 w-full">
              <p className="hidden sm:block text-xs pb-1">{`So many new recruits... how will we feed them all! Can you help me gather some resources?`}</p>
              <div className="flex w-full justify-between gap-2 pl-0.5">
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
                    <div className="flex flex-1 justify-center items-center mb-6 w-full relative">
                      <SquareIcon
                        width={24}
                        icon={ITEM_DETAILS[request.item].image}
                      />
                      <Label
                        icon={ITEM_DETAILS["Faction Mark"].image}
                        type="warning"
                        className="absolute h-6"
                        iconWidth={10}
                        style={{
                          width: isMobile ? "113%" : "117%",
                          bottom: "-31px",
                          left: "-4px",
                        }}
                      >
                        {BASE_POINTS - selectedRequest.deliveryCount * 2}
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
              <div className="flex flex-col space-y-1 px-1.5 mb-2">
                <Label
                  icon={ITEM_DETAILS["Faction Mark"].image}
                  type="warning"
                  className="m-1"
                >
                  {`${BASE_POINTS - selectedRequest.deliveryCount * 2} marks`}
                </Label>
                <div className="hidden sm:flex flex-col w-full justify-center items-center">
                  <p className="text-sm">{selectedRequest.item}</p>
                  <SquareIcon
                    icon={ITEM_DETAILS[selectedRequest.item].image}
                    width={24}
                  />
                </div>
                <RequirementLabel
                  className="flex justify-between items-end sm:items-center sm:justify-center"
                  showLabel={isMobile}
                  hideIcon={!isMobile}
                  type="item"
                  item={selectedRequest.item}
                  balance={inventory[selectedRequest.item] ?? new Decimal(0)}
                  requirement={new Decimal(selectedRequest.amount)}
                />
              </div>
              <Button
                onClick={handleDeliver}
              >{`Deliver ${selectedRequest.amount}`}</Button>
            </div>
          }
        />
      </div>
    </CloseButtonPanel>
  );
};
