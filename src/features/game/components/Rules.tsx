import React, { useContext } from "react";

import heart from "assets/icons/heart.png";
import player from "assets/icons/player.png";
import suspicious from "assets/icons/suspicious.png";
import { Context } from "../GameProvider";
import { Button } from "components/ui/Button";
import { acknowledgeGameRules } from "features/announcements/announcementsStorage";

export const Rules: React.FC = () => {
  const { gameService } = useContext(Context);

  function onAcknowledge() {
    acknowledgeGameRules();
    gameService.send("ACKNOWLEDGE");
  }

  return (
    <div className=" p-2">
      <p className="text-lg text-center">Game Rules</p>
      <div className="flex mt-4">
        <div className="w-16 flex justify-center">
          <img src={player} className="h-8" />
        </div>
        <div className="flex-1">
          <p>1 account per player</p>
        </div>
      </div>
      <div className="flex mt-4">
        <div className="w-16 flex justify-center">
          <img src={suspicious} className="h-8" />
        </div>
        <div className="flex-1">
          <p>No botting or automation</p>
        </div>
      </div>
      <div className="flex mt-4">
        <div className="w-16 flex justify-center">
          <img src={heart} className="h-8" />
        </div>
        <div className="flex-1">
          <p>This is a game. Not a financial product.</p>
        </div>
      </div>
      <Button onClick={onAcknowledge} className="mt-4">
        Continue
      </Button>
      <p className="text-xs underline mt-2 text-center">
        <a
          href="https://docs.sunflower-land.com/support/terms-of-service"
          target="_blank"
          rel="noreferrer"
          className="text-center"
        >
          Terms of Service
        </a>
      </p>
    </div>
  );
};
