import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { MachineState } from "features/game/lib/gameMachine";
import { MazeMetadata, WitchesEve } from "features/game/types/game";
import { NPC_WEARABLES, acknowledgeNPC, isNPCAcknowledged } from "lib/npcs";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import React, { useContext, useEffect } from "react";

interface Props {
  onClose: () => void;
  onNavigate: () => void;
}

const _witchesEve = (state: MachineState) =>
  state.context.state.witchesEve as WitchesEve;

export const Luna: React.FC<Props> = ({ onClose, onNavigate }) => {
  const { gameService } = useContext(Context);
  const currentWeek = getSeasonWeek();

  const witchesEve = useSelector(gameService, _witchesEve);
  const { attempts } = witchesEve?.maze[currentWeek] as MazeMetadata;

  useEffect(() => {
    acknowledgeNPC("luna");
  }, []);

  const handleStartMaze = () => {
    gameService.send("maze.started");
    gameService.send("SAVE");
    onNavigate();
    onClose();
  };

  const getMessage = () => {
    if (activeAttempt) {
      return [
        {
          text: "Hey there, looks like you haven't completed your search for my crows from your previous attempt.",
          actions: [
            {
              text: "Send me back!",
              cb: () => {
                onNavigate();
                onClose();
              },
            },
          ],
        },
      ];
    }

    if (isNPCAcknowledged("luna")) {
      return [
        {
          text: "Hey there, can you help me find my crows?",
          actions: [
            {
              text: "No thanks",
              cb: onClose,
            },
            {
              text: "Let's do it! (Pay 0 SFL)",
              cb: handleStartMaze,
            },
          ],
        },
      ];
    }

    return [
      {
        text: "Hey there, fellow adventurer! I'm in a bit of a pickle - seems like my mischievous crows have vanished into this confounding corn maze nearby.",
      },
      {
        text: "But hey, I've got an exciting quest for you! How about you enter the maze, track down my lost crows, and guess what? ",
      },
      {
        text: "As a sweet reward, you'll get your hands on their precious Crow Feathers, perfect for crafting some seriously rare and magical items.",
      },
      {
        text: "Now, before you dash off all gung-ho, I've got to be honest with you – the portal that takes you into the maze isn't free. ",
      },
      {
        text: "I wish I could wave my wand and make it so, but maintaining that mystical power takes a bit of coin, you know? Usually, it'd cost you just 5 SFL, but because i'm feeling nice this week, I'll let you in for free!",
        actions: [
          {
            text: "No thanks",
            cb: onClose,
          },
          {
            text: "Let's do it! (Pay 0 SFL)",
            cb: handleStartMaze,
          },
        ],
      },
    ];
  };

  // Attempt is added to game start when Luna is paid
  const activeAttempt = attempts?.find((attempt) => !attempt.completedAt);

  return (
    <SpeakingModal
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.luna}
      message={getMessage()}
    />
  );
};
