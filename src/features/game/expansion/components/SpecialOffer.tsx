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
import { acknowledgeSeasonPass } from "features/announcements/announcementsStorage";
import {
  SEASON_TICKET_NAME,
  getSeasonalBanner,
} from "features/game/types/seasons";

const isPromoting = (state: MachineState) => state.matches("specialOffer");
const _inventory = (state: MachineState) => state.context.state.inventory;

export const SpecialOffer: React.FC = () => {
  const { gameService } = useContext(Context);
  const specialOffer = useSelector(gameService, isPromoting);
  const inventory = useSelector(gameService, _inventory);

  const hasPreviousSeasonBanner = !!inventory[getSeasonalBanner()];

  return (
    <PromotingModal
      isOpen={specialOffer}
      hasDiscount={hasPreviousSeasonBanner}
      hasPurchased={!!inventory["Catch the Kraken Banner"]}
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

  const isPreSeason = Date.now() < new Date("2023-11-01").getTime();
  const expiresOn = isPreSeason
    ? new Date("2023-11-01")
    : new Date("2023-12-01");

  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);
  const hasPreviousSeasonBanner = !!inventory["Witches' Eve Banner"];

  const price = hasPreviousSeasonBanner ? "4.99" : "6.99";

  const Content = () => {
    if (hasPurchased) {
      return (
        <>
          <div className="flex flex-col p-2">
            <div className="flex items-center">
              <img
                src={ITEM_DETAILS["Catch the Kraken Banner"].image}
                className="rounded-md my-2 img-highlight mr-2"
                style={{
                  height: `${PIXEL_SCALE * 16}px`,
                }}
              />
              <p className="text-sm">Good luck in the season!</p>
            </div>
            <p className="text-sm">You have access to:</p>
            <ul className="list-disc">
              <li className="text-xs ml-4">
                25% SFL discount on seasonal items
              </li>
              <li className="text-xs ml-4">Free Seasonal Banner</li>
              <li className="text-xs ml-4">Seasonal Wearable Airdrop</li>
              <li className="text-xs ml-4">Bonus Seasonal Tickets</li>
              <li className="text-xs ml-4">+10% EXP from food</li>
            </ul>

            <a
              href="https://docs.sunflower-land.com/player-guides/seasons/catch-the-kraken#catch-the-kraken-banner"
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

    const msLeft = new Date("2023-11-01").getTime() - Date.now();
    const secondsLeft = msLeft / 1000;

    return (
      <>
        <div className="flex flex-col p-2">
          <p className="text-base">Exclusive offer!</p>

          <div className="flex items-center">
            <img
              src={ITEM_DETAILS["Catch the Kraken Banner"].image}
              className="rounded-md my-2 img-highlight mr-2"
              style={{
                height: `${PIXEL_SCALE * 32}px`,
              }}
            />
            <div>
              <p className="text-sm">{`1 x Catch the Kraken Banner`}</p>
              {secondsLeft > 0 ? (
                <>
                  <div className="flex my-1">
                    <p className="line-through">$8.99</p>
                    <p className="ml-2">{`$${price}`}</p>
                  </div>
                  <Label type="danger">
                    {`${secondsToString(secondsLeft, {
                      length: "medium",
                    })} left!`}
                  </Label>
                </>
              ) : (
                <div className="flex my-1">
                  <p>$8.99</p>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm">Includes:</p>
          <ul className="list-disc">
            <li className="text-sm ml-4">Decorative Banner</li>
            <li className="text-sm ml-4">Mystery Airdrop</li>
            <li className="text-sm ml-4">25% SFL discount on seasonal items</li>
            <li className="text-sm ml-4">+10% EXP from food</li>
            <li className="text-sm ml-4">
              Bonus {SEASON_TICKET_NAME["Catch the Kraken"]}s
            </li>
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

          <a
            href="https://docs.sunflower-land.com/player-guides/seasons/catch-the-kraken#catch-the-kraken-banner"
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
                name: "Catch the Kraken Banner",
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
