import React, { useContext, useEffect, useState } from "react";
import hootImg from "assets/npcs/hoot.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Riddle } from "features/game/types/riddles";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

export const HootRiddle = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [riddle, setRiddle] = useState<Riddle | undefined>();
  const [isOpen, setIsOpen] = useState(true);
  const [state, setState] = useState<
    "idle" | "solving" | "solved" | "unsolved"
  >("idle");

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const riddle = gameState.context.state.dawnBreaker?.riddle;
    const isSolved =
      riddle &&
      gameState.context.state.dawnBreaker?.answeredRiddleIds.includes(
        riddle.id
      );

    console.log({ riddle, isSolved });
    if (isSolved) {
      setState("solved");
    }

    setRiddle(riddle);
  }, [isOpen]);

  const open = () => {
    setState("idle");
    setIsOpen(true);
  };

  const solve = () => {
    setState("solving");

    gameService.send("REVEAL", {
      event: {
        type: "riddle.solved",
        id: riddle?.id,
      },
    });
  };

  const Riddle = () => {
    if (!riddle) {
      return (
        <div className="p-2">
          <p>Hoot hoot</p>
        </div>
      );
    }

    if (state === "idle") {
      return (
        <>
          <div className="p-2">
            <p>{riddle.hint}</p>
          </div>
          <Button onClick={solve}>Continue</Button>
        </>
      );
    }

    if (state === "solving") {
      return (
        <div className="p-2">
          <p className="loading">Loading</p>
        </div>
      );
    }

    if (state === "unsolved") {
      return (
        <div className="p-2">
          <p>
            Hoot hoot! You're close, but you haven't quite cracked the code.
          </p>
        </div>
      );
    }

    if (state === "solved") {
      return (
        <div className="p-2">
          <p className="mb-2">Congratulations, clever Bumpkin!</p>
          <p>You've solved my riddle and unlocked the prize.</p>
        </div>
      );
    }

    // Fallback
    return (
      <div className="p-2">
        <p>Oh oh!</p>
      </div>
    );
  };

  return (
    <>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <img
          src={hootImg}
          className="absolute z-0"
          style={{
            width: `${PIXEL_SCALE * 32}px`,
            top: `${PIXEL_SCALE * -32}px`,
            left: `${PIXEL_SCALE * 6}px`,
            transform: `scaleX(-1)`,
          }}
        />
        <CloseButtonPanel
          title="Listen closely..."
          onClose={() => setIsOpen(false)}
        >
          <Riddle />
        </CloseButtonPanel>
      </Modal>
      <img
        className="brightness-[0.6]  absolute z-10 cursor-pointer hover:img-highlight"
        src={hootImg}
        onClick={open}
        style={{
          left: `${GRID_WIDTH_PX * 12}px`,
          bottom: `${GRID_WIDTH_PX * 10}px`,
          width: `${PIXEL_SCALE * 16}px`,
        }}
      />
    </>
  );
};
