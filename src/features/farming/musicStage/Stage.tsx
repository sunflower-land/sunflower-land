import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import classNames from "classnames";
import "./stage.css";
import { Context } from "features/game/GameProvider";

import { sfl2Audio, fitzeeGhostAudio } from "lib/utils/sfx";
import stage from "assets/buildings/New_Stage_SFL.gif";
import fireworks from "assets/decorations/firework.gif";
import fireworks2 from "assets/decorations/firework2.gif";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import Fitzee from "assets/npcs/Fitzee.gif";
import Romy from "assets/npcs/stage/Romy.gif";
import finalStage from "assets/npcs/stage/FINAL_STAGE_WOOH.gif";
import note from "assets/icons/Note_2.png";
import { Npc } from "./components/Npc";
import { Action } from "components/ui/Action";
import disc from "assets/icons/disc.png";
import cross from "assets/icons/cross.png";
import female from "assets/npcs/stage/Interactable_Female.gif";
import male from "assets/npcs/stage/Interactable_Male.gif";

const fadeOut = "blur-sm opacity-0 duration-300 linear ";
const fadeIn = "blur-sm opacity-100 blur-none duration-300 linear ";

interface Props {
  text?: string;
  icon: any;
  onClick: () => void;
  className: string;
}

const Action2: React.FC<Props> = ({ text, icon, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className={classNames("cursor-pointer", className)}
      data-html2canvas-ignore="false"
    >
      <div className="absolute w-10 h-10 -left-2 -top-1 flex items-center justify-center">
        <img src={disc} className="w-full absolute inset-0" />
        <img src={icon} className="w-2/3 z-10" />
      </div>
    </div>
  );
};

export const Stage: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = useState(false);
  const isNotReadOnly = !gameState.matches("readonly");
  const [modalOpen, setModalOpen] = useState(false);
  const [summoned, setSummoned] = useState(false);

  const fireWorks = () => {
    if (!isOpen) {
      setIsOpen(true);
      sfl2Audio.play();
    } else {
      setIsOpen(false);
      sfl2Audio.stop();
    }
  };

  const summon = () => {
    if (!summoned) {
      setSummoned(true);
      fitzeeGhostAudio.play();
    } else {
      setSummoned(false);
      fitzeeGhostAudio.stop();
    }
  };

  const modal = () => {
    if (isNotReadOnly && !modalOpen) {
      setModalOpen(true);
    }
  };

  return (
    <div>
      <div
        className="z-10 absolute"
        // TODO some sort of coordinate system
        style={{
          width: `${GRID_WIDTH_PX * 5}px`,
          left: `${GRID_WIDTH_PX * 74.75}px`,
          top: `${GRID_WIDTH_PX * 20.5}px`,
        }}
      >
        <div
          className={classNames({
            "cursor-pointer": isNotReadOnly,
            "hover:img-highlight": isNotReadOnly,
          })}
        >
          <Action
            className="relative "
            text="Stage"
            icon={note}
            onClick={fireWorks}
          />

          <div>
            <img
              src={stage}
              alt="stage"
              style={{
                transform: "scale(2.2)",
                position: "relative",
                zIndex: "-1",
                width: "100%",
                opacity: 100,
              }}
              className={isOpen ? fadeOut : fadeIn}
            />

            <img
              src={finalStage}
              alt="stage"
              style={{
                transform: "scale(2.2)",
                position: "relative",
                top: `${GRID_WIDTH_PX * -3.86}px`,
                zIndex: "-1",
                width: "100%",
                opacity: 100,
              }}
              className={isOpen ? fadeIn : fadeOut}
            />
          </div>

          {isOpen && (
            <img
              src={fireworks}
              style={{
                transform: "translate(-96px,-580px)",
              }}
              alt="fireworks"
              className="fireworks1"
            />
          )}
          {isOpen && (
            <img
              src={fireworks2}
              style={{
                transform: "translate(182px,-880px)",
              }}
              alt="fireworks"
              className="fireworks1 "
            />
          )}
          {isOpen && (
            <Npc
              img={female}
              message={'"Nothing better than music and cauliflowers!"'}
              X={0.75}
              Y={3.8}
              scale={"scale(0.58)"}
            />
          )}
          {isOpen && (
            <Npc
              img={male}
              message={'"Thi song is lit!"'}
              X={-3.75}
              Y={3}
              scale={"scale(0.65)"}
            />
          )}
          {isOpen && (
            <div
              style={{
                transform: "translate(80px,-160px)",
                zIndex: "10",
              }}
              className={isOpen ? fadeIn : fadeOut}
            >
              <Npc
                img={Romy}
                message={'"I have potato blood in my veins!" Romy'}
                X={-3.75}
                Y={-18}
                scale={"scale(0.8)"}
              />
            </div>
          )}
        </div>
      </div>
      <div
        className="z-10 absolute"
        // TODO some sort of coordinate system
        style={{
          width: `${GRID_WIDTH_PX * 5}px`,
          left: `${GRID_WIDTH_PX * 30.23}px`,
          top: `${GRID_WIDTH_PX * 36.8}px`,
        }}
      >
        <div>
          <Action2 className="relative" icon={cross} onClick={summon} />
          {summoned && (
            <Npc
              img={Fitzee}
              message={
                "No matter how much time passes, we appreciate everyone who is part in the Making of SunflowerLand"
              }
              scale={"scale(0.6)"}
              X={-3.72}
              Y={-3.3}
            />
          )}
        </div>
      </div>
    </div>
  );
};
