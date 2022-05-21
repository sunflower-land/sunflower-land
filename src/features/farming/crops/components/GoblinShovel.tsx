import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import goblin from "assets/npcs/goblin_jump_shovel.gif";
import shovel from "assets/tools/shovel.png";

import { isShovelStolen } from "features/game/events/harvest";

import { Button } from "components/ui/Button";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { recoverShovel } from "features/game/lib/goblinShovelStorage";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

type Position = {
  top: number;
  left: number;
};

const positions: Position[] = [
  { top: 9.5, left: 6 },
  { top: 17.5, left: 19 },
  { top: 25, left: 3 },
  { top: 40, left: 5 },
  { top: 50, left: 5 },
  { top: 4, left: 36 },
  { top: 50, left: 93 },
  { top: 30, left: 90 },
  { top: 42, left: 87 },
  { top: 14, left: 95 },
  { top: 6, left: 91 },
  { top: 6, left: 65 },
  { top: 4, left: 67 },
  { top: 6, left: 38 },
  { top: 12, left: 49 },
  { top: 15, left: 61 },
  { top: 54.3, left: 67 },
  { top: 9, left: 68 },
  { top: 9, left: 81 },
  { top: 24, left: 94 },
];

export const GoblinShovel: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showRecoveredShovelModal, setShowRecoveredShovelModal] =
    useState(false);
  const [showGoblin, setShowGoblin] = useState(false);
  const [goblinPosition, setGoblinPosition] = useState<Position>();
  const { gameService } = useContext(Context);
  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    const detectGoblins = () => {
      const randomPosition = Math.floor(Math.random() * 19);
      setGoblinPosition(positions[randomPosition]);

      const isStolen = isShovelStolen();
      setShowModal(isStolen);
      setShowGoblin(isStolen);
    };

    gameService.onEvent((event) => {
      if (event.type == "item.harvested") {
        detectGoblins();
      }
    });

    detectGoblins();
  }, [gameService]);

  const onClickGoblin = () => {
    setShowRecoveredShovelModal(true);
    recoverShovel();
    setShowGoblin(false);
  };

  const onContinue = () => {
    scrollIntoView(Section.Crops);
    setShowRecoveredShovelModal(false);
  };

  return (
    <>
      <Modal centered show={showModal}>
        <Panel>
          <div className="p-2">
            <h1 className="text-xl text-center">Unable to harvest? </h1>
            <div className="flex my-4 justify-center">
              <img src={shovel} style={{ width: "50px" }} />
            </div>
            <p className="text-sm mb-4">
              A cheeky goblin has stolen your shovel that you need to harvest
              crops.
            </p>
            <p className="text-sm mb-3">
              Find the goblin and get your shovel back.
            </p>
          </div>

          <div className="flex">
            <Button className="text-sm" onClick={() => setShowModal(false)}>
              Find Goblin
            </Button>
          </div>
        </Panel>
      </Modal>

      {showGoblin && (
        <img
          src={goblin}
          onClick={onClickGoblin}
          className="absolute z-10 hover:img-highlight cursor-pointer"
          style={{
            width: `${GRID_WIDTH_PX * 1.38}px`,
            left: `${goblinPosition?.left}%`,
            top: `${goblinPosition?.top}%`,
          }}
        />
      )}

      <Modal
        centered
        show={showRecoveredShovelModal}
        onHide={() => setShowRecoveredShovelModal(false)}
      >
        <Panel>
          <div className="p-2">
            <h1 className="text-xl text-center">Well done!</h1>
            <div className="flex my-4 justify-center">
              <img src={shovel} style={{ width: "50px" }} />
            </div>
            <p className="text-sm mb-4">
              You recovered your shovel, now you can get back to harvesting!
            </p>
          </div>

          <div className="flex">
            <Button className="text-sm" onClick={onContinue}>
              Continue
            </Button>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
