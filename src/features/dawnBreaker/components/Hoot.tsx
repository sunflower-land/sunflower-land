import React, { useCallback, useContext, useEffect, useState } from "react";
import hootImg from "assets/npcs/hoot.png";
import hootGif from "assets/npcs/hoot_hooting.gif";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Riddle } from "features/game/types/riddles";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Revealed } from "features/game/components/Revealed";
import { Panel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";

export const HootRiddle = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [riddle, setRiddle] = useState<Riddle | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const riddle = gameState.context.state.dawnBreaker?.riddle;

    setRiddle(riddle);
  }, [isOpen]);

  const open = () => {
    setIsOpen(true);
  };

  const close = useCallback(() => {
    // Only close when not revealing
    if (!gameState.matches("revealing")) {
      setIsOpen(false);
    }

    if (gameState.matches("revealed")) {
      setTimeout(() => gameService.send("CONTINUE"), 500);
    }
  }, [gameState.value]);

  const solve = () => {
    gameService.send("REVEAL", {
      event: {
        type: "riddle.solved",
        id: riddle?.id,
        createdAt: new Date(),
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

    if (gameState.matches("revealing")) {
      return (
        <div className="p-2">
          <p className="loading">Loading</p>
        </div>
      );
    }

    const solved =
      gameState.context.state.dawnBreaker?.answeredRiddleIds.includes(
        riddle.id
      );

    if (gameState.matches("revealed") && solved) {
      return <Revealed />;
    }

    if (solved) {
      return (
        <div className="p-2">
          <p className="mb-2">Congratulations, clever Bumpkin!</p>
          <p>{`You've solved my riddle and unlocked the prize.`}</p>
        </div>
      );
    }

    if (gameState.matches("revealed") && !solved) {
      return (
        <div className="p-2">
          <p className="mb-2">
            {`Hoot hoot! You're close, but you haven't quite cracked the code.`}
          </p>
          <a
            href="https://docs.sunflower-land.com/player-guides/seasons/dawn-breaker#hoots-cryptic-riddles"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-white text-xs"
          >
            Read more
          </a>
        </div>
      );
    }

    return (
      <>
        <div className="p-2">
          <p className="mb-2">Listen closely...</p>
          <p className="mb-2 text-sm">{riddle.hint}</p>
        </div>
        <Button onClick={solve}>Continue</Button>
      </>
    );
  };

  return (
    <>
      <Modal centered show={isOpen} onHide={close}>
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
        <Panel className="z-10">
          <img
            src={SUNNYSIDE.icons.close}
            className="absolute top-4 right-4 cursor-pointer"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
            }}
            onClick={close}
          />
          <Riddle />
        </Panel>
      </Modal>
      <img
        className="brightness-[0.6] absolute z-10 cursor-pointer hover:img-highlight"
        src={hootGif}
        onClick={open}
        style={{
          left: `${GRID_WIDTH_PX * 13}px`,
          bottom: `${GRID_WIDTH_PX * 10}px`,
          width: `${PIXEL_SCALE * 16}px`,
          transform: `scaleX(-1)`,
        }}
      />
    </>
  );
};
