import React, { useContext, useState } from "react";

import sandHill from "assets/land/sand_hill.png";
import sandDug from "assets/land/sand_dug.png";
import warningIcon from "assets/icons/cancel.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

type Hill = {
  x: number;
  y: number;
  id: string;
};

// Each day there are different positions for the 5 plots to show
const firstArrangement = [
  {
    x: 2,
    y: 4,
  },
  {
    x: 4,
    y: -1,
  },
  {
    x: -3,
    y: 1,
  },
  {
    x: -2,
    y: 6,
  },
  {
    x: 1,
    y: 9,
  },
];

const secondArrangement = [
  {
    x: -3,
    y: 10,
  },
  {
    x: -4,
    y: 6,
  },
  {
    x: 3,
    y: 6,
  },
  {
    x: 1,
    y: 1,
  },
  {
    x: 2,
    y: -3,
  },
];

const thirdArrangement = [
  {
    x: -1,
    y: 4,
  },
  {
    x: -4,
    y: 2,
  },
  {
    x: 1,
    y: 7,
  },
  {
    x: 2,
    y: -2,
  },
  {
    x: -5,
    y: 3,
  },
];

const arrangements = [firstArrangement, secondArrangement, thirdArrangement];

/**
 * Generate the 5 random sand hills for the day
 */
function generateSandHills() {
  const today = new Date();
  const arrangement = arrangements[today.getDay() % arrangements.length];

  // Create positions with an ID based on the date
  const date = new Date().toISOString().slice(0, 10);
  return arrangement.map((coords, index) => ({
    ...coords,
    id: `${date}-${index}`,
  }));
}
export const SandHill: React.FC<Hill> = ({ x, y, id }) => {
  const { gameService, selectedItem } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [warning, setWarning] = useState<"idle" | "warned" | "warning">("idle");
  const [showMissingShovel, setShowMissingShovel] = useState(false);
  const [showRecoveryWarning, setShowRecoveryWarning] = useState(false);

  const warn = async () => {
    setWarning("warning");

    await new Promise((res) => setTimeout(res, 500));

    setWarning("warned");
  };

  const digs = gameState.context.state.mysteryPrizes?.["Sand Shovel"] ?? [];
  const isDug = digs.find((dig) => dig.id === id);

  const dig = (id: string) => {
    // Come back tomorrow
    if (isDug) {
      if (warning === "warned") {
        setShowRecoveryWarning(true);
        return;
      }

      warn();
      return;
    }

    // Missing shovel
    if (
      selectedItem !== "Sand Shovel" ||
      !gameState.context.state.inventory["Sand Shovel"]?.gte(1)
    ) {
      if (warning === "warned") {
        setShowMissingShovel(true);
        return;
      }

      warn();

      return;
    }

    gameService.send("REVEAL", {
      event: {
        type: "treasure.dug",
        id,
        createdAt: new Date(),
      },
    });
  };

  return (
    <div
      className="absolute"
      style={{
        top: `calc(50% - ${GRID_WIDTH_PX * y}px)`,
        left: `calc(50% + ${GRID_WIDTH_PX * x}px)`,
        width: `${PIXEL_SCALE * 16}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
      }}
    >
      <Modal
        centered
        show={showMissingShovel}
        onHide={() => setShowMissingShovel(false)}
      >
        <Panel>
          <p>You must equip a Sand Shovel first</p>
        </Panel>
      </Modal>
      <Modal
        centered
        show={showRecoveryWarning}
        onHide={() => setShowRecoveryWarning(false)}
      >
        <Panel>
          <p>This spot has already been dug up. Please come back tomorrow</p>
        </Panel>
      </Modal>

      <img
        src={warningIcon}
        className="absolute top-0 left-0 w-full z-10 pointer-events-none transition-opacity"
        style={{
          width: `${PIXEL_SCALE * 11}px`,
          left: `${PIXEL_SCALE * 2.5}px`,
          bottom: `${PIXEL_SCALE * 2.5}px`,
          opacity: warning === "warning" ? 1 : 0,
        }}
      />
      <img
        src={isDug ? sandDug : sandHill}
        className="absolute cursor-pointer hover:img-highlight w-full"
        key={id}
        onClick={() => dig(id)}
      />
    </div>
  );
};

export const SandHills: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  // TODO generate daily hills and positions
  const hills = generateSandHills();

  console.log({ hills });
  return (
    <>
      {hills.map((hill) => (
        <SandHill key={hill.id} x={hill.x} y={hill.y} id={hill.id} />
      ))}
    </>
  );
};
