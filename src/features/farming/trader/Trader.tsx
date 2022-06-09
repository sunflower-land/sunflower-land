import React from "react";
import { Button, Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import test from "assets/npcs/bald_man.gif";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const Trader: React.FC = () => {
  const [isOfferOpen, setIsOfferOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleOpenOffer = () => {
    setIsDialogOpen(false);
    setIsOfferOpen(true);
  };

  return (
    <div
      className="z-100 absolute"
      id="trader"
      style={{
        width: `${GRID_WIDTH_PX * 1}px`,
        left: `${GRID_WIDTH_PX * 12}px`,
        top: `${GRID_WIDTH_PX * 1}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img
          src={test}
          alt="trader"
          onClick={() => setIsDialogOpen(true)}
          className="w-full"
        />
      </div>

      <Modal centered show={isDialogOpen} onHide={() => setIsDialogOpen(false)}>
        <Panel>
          <div className="px-2 mb-2">
            <p className="mb-4">
              Hi I am a trader, and will bring you offer every week
            </p>
            <p>Have a look at my offers for this week </p>
          </div>
          <Button
            onClick={handleOpenOffer}
            className="flex flex-col items-center mx-2"
          >
            Check Offer
          </Button>
        </Panel>
      </Modal>

      <Modal centered show={isOfferOpen} onHide={() => setIsOfferOpen(false)}>
        <Panel>
          <div className="px-2 mb-2">
            <p className="mb-4">CHICKENS</p>
          </div>
        </Panel>
      </Modal>
    </div>
  );
};
