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
  const availableReactions = REACTIONS.filter((reaction) => {
    const access = reaction.hasAccess(game);
    console.log({ reaction, access, game });
    return access;
  });
  const lockedReactions = REACTIONS.filter(
    (reaction) => !reaction.hasAccess(game)
  );
  return (
    <div
      className="scrollable overflow-y-scroll"
      style={{
        height: "90px",
      }}
    >
      <div className="flex flex-wrap">
        {availableReactions.map((reaction) => {
          return (
            <Box
              key={reaction.name}
              onClick={() => onReact(reaction.name)}
              image={reaction.icon}
            />
          );
        })}
      </div>
      <div className="flex items-center pl-1 mt-2">
        <p className="underline text-xs">Locked</p>
        <img src={lock} className="h-5 ml-2" />
      </div>
      <div className="flex flex-wrap">
        {lockedReactions.map((reaction) => {
          return (
            <div className="flex items-center w-1/2" key={reaction.name}>
              <Box
                key={reaction.name}
                onClick={() => onReact(reaction.name)}
                image={reaction.icon}
                disabled
              />
              <p className="text-xs">{reaction.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
