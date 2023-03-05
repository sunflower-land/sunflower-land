import React, { useState } from "react";

import adam from "assets/npcs/adam.gif";
import shadow from "assets/npcs/shadow.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "react-bootstrap";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { upcomingParty } from "../lib/streaming";

export const Streamer: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const party = upcomingParty();

  const isPartyActive = Date.now() > party.startAt && Date.now() < party.endAt;

  const Content = () => {
    if (!isPartyActive) {
      return (
        <div className="flex flex-col items-center">
          <img src={SUNNYSIDE.icons.expression_chat} className="w-1/4 mb-4" />
          <div className="flex flex-wrap justify-center">
            <p className="text-sm mr-2 mb-2">Next session:</p>
            <div className="flex mb-2 items-center justify-center bg-blue-600 text-white text-xxs px-1.5 pb-1 pt-0.5 border rounded-md">
              <img
                src={SUNNYSIDE.icons.stopwatch}
                className="w-3 left-0 mr-1"
              />
              <span>{`${new Date(party.startAt).toLocaleString()} - ${new Date(
                party.endAt
              ).toLocaleTimeString()}`}</span>
            </div>
          </div>
        </div>
      );
    }

    if (party.type === "discord") {
      return (
        <div className="flex flex-col items-center">
          <div className="my-4 flex flex-col items-center">
            <img
              src={SUNNYSIDE.icons.heart}
              className="w-1/3 mb-2 animate-pulse"
            />

            <Label type="info" className="mb-2">
              Live now on Discord!
            </Label>
            <Button
              className="w-60"
              onClick={() => {
                window.open(
                  "https://discord.com/invite/sunflowerland",
                  "_blank"
                );
              }}
            >
              Go to Discord
            </Button>
          </div>
        </div>
      );
    }

    if (party.type === "twitch") {
      return (
        <div className="flex flex-col items-center">
          <div className="my-4 flex flex-col items-center">
            <img
              src={SUNNYSIDE.icons.heart}
              className="w-1/3 mb-2  animate-pulse"
            />

            <Label type="info" className="mb-2">
              Live now on Twitch!
            </Label>
            <Button
              className="w-60"
              onClick={() => {
                window.open(
                  "https://www.twitch.tv/0xsunflowerstudios",
                  "_blank"
                );
              }}
            >
              Go to Twitch
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };
  return (
    <>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          title={
            <div className="flex justify-center">
              <p>Meet the team</p>
            </div>
          }
          onClose={() => setShowModal(false)}
        >
          <Content />
        </CloseButtonPanel>
      </Modal>
      <div
        className="absolute"
        style={{
          left: `${GRID_WIDTH_PX * 29}px`,
          top: `${GRID_WIDTH_PX * 36}px`,
          width: `${GRID_WIDTH_PX * 1}px`,
        }}
      >
        <img
          src={adam}
          className="cursor-pointer hover:img-highlight z-20 absolute"
          onClick={() => setShowModal(true)}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: 0,
            left: 0,
          }}
        />
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * -2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
        />
        <img
          src={SUNNYSIDE.icons.expression_chat}
          className="absolute animate-float"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            bottom: `${PIXEL_SCALE * 20}px`,
            left: `${PIXEL_SCALE * 4}px`,
          }}
        />
      </div>
    </>
  );
};
