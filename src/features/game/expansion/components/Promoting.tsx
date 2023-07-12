import { useSelector } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import React, { useContext } from "react";

import { MachineState } from "features/game/lib/gameMachine";
import { NPC_WEARABLES } from "lib/npcs";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { SquareIcon } from "components/ui/SquareIcon";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { hasFeatureAccess } from "lib/flags";
import { acknowledgeSeasonPass } from "features/announcements/announcementsStorage";

const isPromoting = (state: MachineState) => state.matches("promoting");
const _inventory = (state: MachineState) => state.context.state.inventory;

export const Promoting: React.FC = () => {
  const { gameService } = useContext(Context);
  const promoting = useSelector(gameService, isPromoting);
  const inventory = useSelector(gameService, _inventory);

  const hasPreviousSeasonBanner = !!inventory["Dawn Breaker Banner"];

  return (
    <PromotingModal
      isOpen={promoting}
      hasDiscount={hasPreviousSeasonBanner}
      hasPurchased={!!inventory["Witches' Eve Banner"]}
      onClose={() => {
        acknowledgeSeasonPass();
        gameService.send("ACKNOWLEDGE");
      }}
    />
  );
};

interface Props {
  hasPurchased?: boolean;
  hasDiscount: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const PromotingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  hasPurchased,
  hasDiscount,
}) => {
  // Goes live on 17th of July.
  // $3.99 for Dawn Breaker Holders, otherwise $5.99.
  // Discounts on seasonal items, 1 Mystery Airdrop + Bonus Tickets completing chores.
  // At 1st of August, price changes to $5.99 for everyone and available for 1 month.

  const isPreSeason = Date.now() < new Date("2023-08-01").getTime();
  const expiresOn = isPreSeason
    ? new Date("2023-08-01")
    : new Date("2023-09-01");

  const price = hasDiscount ? 3.99 : 5.99;

  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);

  const Content = () => {
    if (!hasFeatureAccess(inventory, "WITCHES_EVE_BANNER")) {
      return (
        <>
          <div className="p-2">
            <p className="text-sm">
              {`You will need to wait until next season for my exclusive deals.`}
            </p>
          </div>
        </>
      );
    }

    if (hasPurchased) {
      return (
        <>
          <div className="flex flex-col p-2">
            <div className="flex items-center">
              <img
                src={ITEM_DETAILS["Witches' Eve Banner"].image}
                className="rounded-md my-2 img-highlight mr-2"
                style={{
                  height: `${PIXEL_SCALE * 16}px`,
                }}
              />
              <p className="text-sm">Good luck this season!</p>
            </div>
            <p className="text-sm">You have access to:</p>
            <ul className="list-disc">
              <li className="text-xs ml-4">
                25% SFL discount on seasonal items
              </li>
              <li className="text-xs ml-4">Free Seasonal Banner</li>
              <li className="text-xs ml-4">Seasonal Wearable Airdrop</li>
              <li className="text-xs ml-4">Bonus Seasonal Tickets</li>
            </ul>

            <a
              href="https://docs.sunflower-land.com/player-guides/seasons/dawn-breaker#dawn-breaker-banner"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500"
            >
              Read more
            </a>
          </div>
          <div className="flex">
            <Button className="mr-1" onClick={onClose}>
              Close
            </Button>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex flex-col p-2">
          <div className="flex items-center">
            <img
              src={ITEM_DETAILS["Witches' Eve Banner"].image}
              className="rounded-md my-2 img-highlight mr-2"
              style={{
                height: `${PIXEL_SCALE * 16}px`,
              }}
            />
            <p className="text-sm">{`1 x Witches' Eve Banner`}</p>
          </div>
          <p className="text-sm">Includes:</p>
          <ul className="list-disc">
            <li className="text-xs ml-4">25% SFL discount on seasonal items</li>
            <li className="text-xs ml-4">Free Seasonal Banner</li>
            <li className="text-xs ml-4">Seasonal Wearable Airdrop</li>
            <li className="text-xs ml-4">Bonus Seasonal Tickets</li>
          </ul>
          {!isPreSeason && (
            <Label
              type="info"
              className="mt-2"
              style={{
                width: "fit-content",
              }}
            >
              <SquareIcon
                icon={SUNNYSIDE.icons.timer}
                width={5}
                className="-mb-0.5"
              />
              <span className="ml-1">Limited time only!</span>
            </Label>
          )}

          {isPreSeason && hasDiscount && (
            <>
              <div className="flex items-center mt-2">
                <p className="text-sm mr-2">Dawn Breaker Discount</p>
                <img src={SUNNYSIDE.icons.confirm} className="h-6" />
              </div>

              <ul className="list-disc mb-2">
                <li className="text-xs ml-4">
                  On August 1st prices increase to $5.99
                </li>
                <li className="text-xs ml-4 mt-0.5">
                  <Label
                    type="info"
                    style={{
                      width: "fit-content",
                    }}
                  >
                    <SquareIcon
                      icon={SUNNYSIDE.icons.timer}
                      width={5}
                      className="-mb-0.5"
                    />
                    <span className="ml-1">
                      {secondsToString(
                        (expiresOn.getTime() - Date.now()) / 1000,
                        {
                          length: "medium",
                        }
                      )}{" "}
                      left
                    </span>
                  </Label>
                </li>
              </ul>
            </>
          )}

          <a
            href="https://docs.sunflower-land.com/player-guides/seasons/dawn-breaker"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500"
          >
            Read more
          </a>
        </div>
        <div className="flex">
          <Button className="mr-1" onClick={onClose}>
            No thanks
          </Button>
          <Button
            onClick={() => {
              gameService.send("PURCHASE_ITEM", {
                name: "Witches' Eve Banner",
              });
              onClose();
            }}
          >
            {`Buy now $${price}`}
          </Button>
        </div>
      </>
    );
  };
  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <CloseButtonPanel bumpkinParts={NPC_WEARABLES.grubnuk} onClose={onClose}>
        <Content />
      </CloseButtonPanel>
    </Modal>
  );
};
