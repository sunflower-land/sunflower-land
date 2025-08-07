import { produce } from "immer";
import { GameState } from "features/game/types/game";
import { MonumentName } from "features/game/types/monuments";

export type HelpProjectAction = {
  type: "project.helped";
  project: MonumentName;
};

type Options = {
  state: Readonly<GameState>;
  action: HelpProjectAction;
  createdAt?: number;
  visitorState?: GameState;
};

/**
 * Local only event to check when helped
 */
export function helpProject({
  state,
  action,
  visitorState,
  createdAt = Date.now(),
}: Options): [GameState, GameState] {
  return produce([state, visitorState!], ([game, visitorGame]) => {
    if (!visitorGame) {
      throw new Error("No visitor game");
    }
    const project = game.socialFarming.villageProjects[action.project];

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.helpedAt) {
      throw new Error("Already helped");
    }

    project.helpedAt = createdAt;
    project.cheers += 1;
  });
}
