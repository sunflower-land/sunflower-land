import React, { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

import traderImage from "assets/npcs/trader.gif";
import beetroot from "assets/crops/beetroot/crop.png";
import carrot from "assets/crops/carrot/crop.png";
import Decimal from "decimal.js-light";

export const Trader: React.FC = () => {
  const [isOfferOpen, setIsOfferOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isAlreadyTradedOpen, setIsAlreadyTradedOpen] = React.useState(false);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const state = gameState.context.state;
  let hasAvailableOffer = false;

  if (state.tradedAt) {
    // Check if the last time they traded, was for the current offer
    if (state.tradeOffer) {
      hasAvailableOffer =
        new Date(state.tradedAt).getTime() >
          new Date(state.tradeOffer.startAt).getTime() &&
        new Date(state.tradedAt).getTime() <
          new Date(state.tradeOffer.endAt).getTime();
    }
  } else {
    hasAvailableOffer = true;
  }

  const handleOpenOffer = () => {
    setIsDialogOpen(false);
    if (hasAvailableOffer) {
      setIsOfferOpen(true);
    } else {
      setIsAlreadyTradedOpen(true);
    }
  };

  const handleTrade = () => {
    gameService.send("item.traded");
    setIsAlreadyTradedOpen(true);
  };

  // const find = state.tradeOffer?.ingredients.forEach((item) => {
  //   item.amount < state.inventory[item.name];
  // });
  // const isMissingIngredients = count.lessThan();
  const isMissingIngredients = true;

  return (
    <div
      className="z-100 absolute"
      id="trader"
      style={{
        width: `${GRID_WIDTH_PX * 1}px`,
        left: `${GRID_WIDTH_PX * 11}px`,
        top: `${GRID_WIDTH_PX * 1}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img
          src={traderImage}
          alt="trader"
          onClick={() => setIsDialogOpen(true)}
          className="w-full"
        />
      </div>

      {/* show a different modal once the trade is done */}

      <Modal centered show={isDialogOpen} onHide={() => setIsDialogOpen(false)}>
        <Panel>
          <div className="px-2 mb-2">
            {/* Show nomad image */}
            <img src={traderImage}></img>
            {/* this are limited offers... This offer ends on "date".*/}
            <p className="mb-4">
              {`I'm a nomad, and will bring you offer every week`}
            </p>
            <p>Have a look at my offers for this week </p>
          </div>

          <Button
            onClick={handleOpenOffer}
            className="flex flex-row items-center mx-2"
          >
            Check Offer
          </Button>
        </Panel>
      </Modal>

      <Modal centered show={isOfferOpen} onHide={() => setIsOfferOpen(false)}>
        <Panel>
          {/* show resources need as it was done for thr rocket */}

          {/* ADD ANNOUNCEMENT FOR TRADER */}
          <div className="px-2 mb-2">
            <span className="text-lg items-center justify-center">
              {state.tradeOffer?.name}
            </span>
            {state.tradeOffer?.ingredients.map((item, index) => {
              const count = state.inventory[item.name] || new Decimal(0);

              return (
                <div key={index}>
                  <div className="flex flex-row my-3 justify-center">
                    {item.name === "Beetroot" && (
                      <>
                        <img className="w-6" src={beetroot} alt={item.name} />{" "}
                        <span> {item.amount}</span>
                      </>
                    )}
                    {item.name === "Carrot" && (
                      <>
                        <img className="w-6" src={carrot} alt={item.name} />{" "}
                        <span> {item.amount}</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            disabled={isMissingIngredients}
            onClick={() => handleTrade()}
            className="flex flex-row items-center mx-2"
          >
            Trade
          </Button>
        </Panel>
      </Modal>

      <Modal
        centered
        show={isAlreadyTradedOpen}
        onHide={() => setIsAlreadyTradedOpen(false)}
      >
        <Panel>
          <div className="px-2 mb-2">
            <p className="mb-4">
              You have already traded with me for this period, check again soon
              to see if I have something else for you
            </p>
          </div>
        </Panel>
      </Modal>
    </div>
  );
};
