import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import townHall from "assets/buildings/townhall.png";
import heart from "assets/icons/heart.png";
import close from "assets/icons/close.png";
import discord from "assets/skills/discord.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { Panel } from "components/ui/Panel";
import { Contributors } from "./components/Contributors";
import { Tab } from "components/ui/Tab";
import { Discord } from "./components/Discord";

export const TownHall: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tab, setTab] = useState<"contributors" | "discord">("contributors");

  const open = () => {
    setIsOpen(true);
  };

  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 5}px`,
        left: `${GRID_WIDTH_PX * 8.8}px`,
        top: `${GRID_WIDTH_PX * -4.6}px`,
      }}
    >
      <div className={"cursor-pointer hover:img-highlight"}>
        <img src={townHall} alt="market" onClick={open} className="w-full" />
        <Action
          className="absolute bottom-24 left-8"
          text="Town Hall"
          icon={heart}
          onClick={open}
        />
      </div>

      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Panel className="relative" hasTabs>
          <div
            className="absolute flex"
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              left: `${PIXEL_SCALE * 1}px`,
              right: `${PIXEL_SCALE * 1}px`,
            }}
          >
            <Tab
              isActive={tab === "contributors"}
              onClick={() => setTab("contributors")}
            >
              <img src={heart} className="h-5 mr-2" />
              <span className="text-sm">Contributors</span>
            </Tab>
            <Tab isActive={tab === "discord"} onClick={() => setTab("discord")}>
              <img src={discord} className="h-5 mr-2" />
              <span className="text-sm">Discord</span>
            </Tab>
            <img
              src={close}
              className="absolute cursor-pointer z-20"
              onClick={() => setIsOpen(false)}
              style={{
                top: `${PIXEL_SCALE * 1}px`,
                right: `${PIXEL_SCALE * 1}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </div>

          {tab === "contributors" && (
            <Contributors onClose={() => setIsOpen(false)} />
          )}
          {tab === "discord" && (
            <div className="p-2">
              <Discord />
            </div>
          )}
        </Panel>
      </Modal>
    </div>
  );
};
