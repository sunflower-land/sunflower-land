import { GameState } from "features/game/types/game";
import React from "react";

import lock from "assets/skills/lock.png";
import { Box } from "components/ui/Box";
import { ReactionName, REACTIONS } from "../lib/reactions";

interface Props {
  game: GameState;
  onReact: (reaction: ReactionName) => void;
}

export const ChatReactions: React.FC<Props> = ({ game, onReact }) => {
  return (
    <div
      className="flex flex-wrap scrollable overflow-y-scroll"
      style={{
        height: "90px",
      }}
    >
      {REACTIONS.map((reaction) => {
        const isLocked = !reaction.hasAccess(game);
        return (
          <Box
            key={reaction.name}
            onClick={() => onReact(reaction.name)}
            image={reaction.icon}
            disabled={isLocked}
            secondaryImage={isLocked && lock}
          />
        );
      })}
    </div>
  );
};
