import classNames from "classnames";
import { GameState } from "features/game/types/game";
import React from "react";
import { ReactionName, REACTIONS } from "./lib/reactions";

import lock from "assets/skills/lock.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Box } from "components/ui/Box";

interface Props {
  game: GameState;
  onReact: (reaction: ReactionName) => void;
}

export const ChatReactions: React.FC<Props> = ({ game, onReact }) => {
  return (
    <div className="flex flex-wrap">
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
