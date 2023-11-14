import React, { useContext } from "react";

import plaza from "assets/tutorials/plaza_screenshot1.png";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import lockIcon from "assets/skills/lock.png";
import { Button } from "components/ui/Button";
import { MachineState } from "features/game/lib/gameMachine";
import { getBumpkinLevel } from "features/game/lib/level";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { useNavigate } from "react-router-dom";

const isLocked = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0) < 3;

export const PeteHelp: React.FC = () => {
  const { gameService } = useContext(Context);
  const locked = useSelector(gameService, isLocked);
  const navigate = useNavigate();

  return (
    <div className="p-2">
      <p className="text-sm mb-2">
        As you level up, you will unlock new areas to explore. First up is the
        Pumpkin Plaza....my home!
      </p>
      <p className="text-sm">
        Here you can complete deliveries for rewards, craft magical items &
        trade with other players.
      </p>

      <img src={plaza} className="w-full mx-auto rounded-lg my-2" />
      {locked && (
        <>
          <p className="text-xs mb-2">
            Visit the fire pit, cook food and eat to level up.
          </p>
          <Label type="danger" className="mb-2 ml-1" icon={lockIcon}>
            Level 3 Required
          </Label>
        </>
      )}

      <Button
        disabled={locked}
        onClick={() => {
          navigate(`/world/plaza`);
        }}
      >
        Let's go!
      </Button>
    </div>
  );
};
