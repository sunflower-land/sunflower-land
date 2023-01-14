import React, { useContext, useLayoutEffect, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import * as Auth from "features/auth/lib/Provider";

import { useParams } from "react-router-dom";
import { WorldNavigation } from "./WorldNavigation";
import { Context, GameProvider } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import background from "assets/land/world.png";
import { useActor } from "@xstate/react";

export const World: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);

  // catching and passing scroll container to keyboard listeners
  const [container, setContainer] = useState<HTMLElement>();
  const { id } = useParams();

  useLayoutEffect(() => {
    container?.scrollTo(400, container.scrollHeight);
  }, [container]);

  // Load data
  return (
    <div
      className="relative"
      style={{
        width: `${60 * GRID_WIDTH_PX}px`,
        height: `${40 * GRID_WIDTH_PX}px`,
      }}
      // TODO dynamic game board size based on tile dimensions
    >
      <img
        src={background}
        className="h-auto absolute"
        style={{
          width: `${60 * GRID_WIDTH_PX}px`,
          height: `${40 * GRID_WIDTH_PX}px`,
        }}
      />

      <WorldNavigation />
    </div>
  );
};
