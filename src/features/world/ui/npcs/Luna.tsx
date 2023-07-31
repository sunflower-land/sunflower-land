import { Context } from "features/game/GameProvider";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES, acknowledgeNPC } from "lib/npcs";
import React, { useContext, useEffect } from "react";

interface Props {
  onClose: () => void;
  onNavigate: () => void;
}
export const Luna: React.FC<Props> = ({ onClose, onNavigate }) => {
  const { gameService } = useContext(Context);
  useEffect(() => {
    acknowledgeNPC("luna");
  }, []);

  const handleStartMaze = () => {
    gameService.send("maze.started");
    onNavigate();
    onClose();
  };

  return (
    <SpeakingModal
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.luna}
      message={[
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
          text: "I wish I could wave my wand and make it so, but maintaining that mystical power takes a bit of coin, you know? So, it'll cost you just 5 SFL, a small price to pay for the adventure that awaits you!",
          actions: [
            {
              text: "No thanks",
              cb: onClose,
            },
            {
              text: "Let's do it! (Pay 5 SFL)",
              cb: handleStartMaze,
            },
          ],
        },
      ]}
    />
  );
};
