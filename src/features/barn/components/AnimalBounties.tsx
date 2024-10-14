import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import confetti from "canvas-confetti";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { HudContainer } from "components/ui/HudContainer";
import { Label } from "components/ui/Label";
import { ButtonPanel, InnerPanel, Panel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import {
  getAnimalLevel,
  isValidDeal,
} from "features/game/events/landExpansion/sellAnimal";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { secondsTillWeekReset, weekResetsAt } from "features/game/lib/factions";
import { MachineState } from "features/game/lib/gameMachine";
import { AnimalType } from "features/game/types/animals";
import { getKeys } from "features/game/types/decorations";
import { Animal, BountyRequest } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getSeasonalTicket } from "features/game/types/seasons";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { NPC_WEARABLES } from "lib/npcs";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import React, { useContext, useState } from "react";

const _exchange = (state: MachineState) => state.context.state.bounties;

interface Props {
  type: AnimalType;
  onExchanging: (deal: BountyRequest) => void;
}

function acknowledgeIntro() {
  localStorage.setItem(
    "animal.bounties.acknowledged",
    new Date().toISOString(),
  );
}

function hasReadIntro() {
  return !!localStorage.getItem("animal.bounties.acknowledged");
}
export const AnimalBounties: React.FC<Props> = ({ type, onExchanging }) => {
  const { gameService } = useContext(Context);
  const exchange = useSelector(gameService, _exchange);

  const [showIntro, setShowIntro] = useState(!hasReadIntro());

  const state = gameService.getSnapshot().context.state;

  const deals = exchange.requests.filter((deal) => deal.name === type);

  const expiresAt = useCountdown(weekResetsAt());

  console.log({ expiresAt, reset: secondsTillWeekReset() });

  if (showIntro) {
    return (
      <SpeakingModal
        message={[
          {
            text: "Howdy Bumpkin. Mmmmmmm, it smells great in here!",
          },
          {
            text: "The Goblins are on the lookout for some tasty......eh emmmm I mean friendly farming companions.",
          },
          {
            text: "Each week I will have new deals for you. Bring me fresh animals and I will reward you handsomely.",
          },
        ]}
        bumpkinParts={NPC_WEARABLES.grabnab}
        onClose={() => {
          acknowledgeIntro();
          setShowIntro(false);
        }}
      />
    );
  }

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.grabnab}>
      <div className="p-1">
        <div className="flex justify-between items-center mb-2">
          <Label type="default">Bounty board</Label>
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            <TimerDisplay time={expiresAt} />
          </Label>
        </div>

        <p className="text-xs mb-2">
          Trade this week's bounties before time runs out.
        </p>
        <div className="flex flex-wrap">
          {deals.length === 0 && (
            <p className="text-sm">There are no deals available right now.</p>
          )}
          {deals.map((deal) => {
            const animals =
              type === "Chicken" ? state.henHouse.animals : state.barn.animals;

            const isDisabled = getKeys(animals).every(
              (id) => !isValidDeal({ deal, animal: animals[id] }),
            );

            const isSold = !!state.bounties.completed.find(
              (request) => request.id === deal.id,
            );

            return (
              <div
                key={deal.id}
                className={classNames("w-1/3 sm:w-1/4 pr-1.5 pb-1.5", {
                  "pointer-events-none": isSold,
                })}
              >
                <ButtonPanel
                  // disabled={isDisabled}
                  onClick={() => onExchanging(deal)}
                >
                  <div className="flex justify-center items-center my-2 mb-6">
                    <div className="relative">
                      <img
                        src={ITEM_DETAILS[deal.name].image}
                        className="w-8 z-20"
                      />
                    </div>
                  </div>

                  <div className="absolute top-0 -left-0.5">
                    <img src={SUNNYSIDE.icons.heart} className="h-6" />
                    <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                      <p
                        className="text-white text-xs Teeny"
                        style={{ fontSize: "18px" }}
                      >
                        {deal.level}
                      </p>
                    </div>
                  </div>

                  {!!isSold && (
                    <Label
                      type="success"
                      className={"absolute -top-3.5 text-center p-1 "}
                      style={{
                        right: `${PIXEL_SCALE * -3}px`,
                        // width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                        height: "25px",
                      }}
                    >
                      Sold
                    </Label>
                  )}

                  {!!deal.coins && (
                    <Label
                      type="warning"
                      icon={SUNNYSIDE.ui.coinsImg}
                      className={"absolute -bottom-2 text-center p-1 "}
                      style={{
                        left: `${PIXEL_SCALE * -3}px`,
                        right: `${PIXEL_SCALE * -3}px`,
                        width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                        height: "25px",
                      }}
                    >
                      {deal.coins}
                    </Label>
                  )}

                  {getKeys(deal.items ?? {}).map((name) => {
                    return (
                      <Label
                        key={name}
                        type="warning"
                        icon={ITEM_DETAILS[name].image}
                        className={"absolute -bottom-2 text-center p-1 "}
                        style={{
                          left: `${PIXEL_SCALE * -3}px`,
                          right: `${PIXEL_SCALE * -3}px`,
                          width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                          height: "25px",
                        }}
                      >
                        {deal.items?.[name]}
                      </Label>
                    );
                  })}
                </ButtonPanel>
              </div>
            );
          })}
        </div>
      </div>
    </CloseButtonPanel>
  );
};

export const AnimalDeal: React.FC<{
  deal: BountyRequest;
  animal: Animal;
  onClose: () => void;
  onSold: () => void;
}> = ({ deal, animal, onClose, onSold }) => {
  const { gameService } = useContext(Context);

  const sell = () => {
    gameService.send("animal.sold", {
      requestId: deal.id,
      animalId: animal.id.toString(),
    });

    onSold();
  };

  if (!deal || !animal) {
    return null;
  }

  return (
    <Panel>
      <div className="p-2">
        <div className="mb-2 flex flex-wrap">
          <Label
            type="default"
            icon={ITEM_DETAILS[animal.type].image}
            className="mr-2"
          >
            {`Lvl ${getAnimalLevel({ animal })} ${animal.type}`}
          </Label>
          {!!deal.coins && (
            <Label type="warning" icon={SUNNYSIDE.ui.coinsImg}>
              {deal.coins}
            </Label>
          )}

          {getKeys(deal.items ?? {}).map((name) => {
            <Label key={name} type="warning" icon={ITEM_DETAILS[name].image}>
              {deal.items?.[name]}
            </Label>;
          })}
        </div>

        <p>Are you sure you want to sell this animal for X?</p>
      </div>
      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={sell}>Confirm</Button>
      </div>
    </Panel>
  );
};

export const ExchangeHud: React.FC<{
  deal: BountyRequest;
  onClose: () => void;
}> = ({ deal, onClose }) => {
  return (
    <HudContainer>
      <div className="absolute items-start flex top-3 px-2 cursor-pointer z-10 w-full justify-between">
        <InnerPanel>
          <div className="flex flex-wrap">
            <Label type="default" className="mr-2">{`Lvl ${deal.level}`}</Label>

            {!!deal.coins && (
              <Label type="warning" icon={SUNNYSIDE.ui.coinsImg}>
                {deal.coins}
              </Label>
            )}

            {getKeys(deal.items ?? {}).map((name) => {
              <Label key={name} type="warning" icon={ITEM_DETAILS[name].image}>
                {deal.items?.[name]}
              </Label>;
            })}
          </div>
          <p className="text-xs">Select a {deal.name} to sell?</p>
        </InnerPanel>

        <img
          src={SUNNYSIDE.ui.disc_cancel}
          alt="Cancel"
          className="cursor-pointer z-10"
          style={{
            width: `${PIXEL_SCALE * 18}px`,
          }}
          onClick={onClose}
        />
      </div>
    </HudContainer>
  );
};
