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
  visitedFarmId: number;
};

/**
 * Local only event to check when helped
 */
export function helpProject({
  state,
  action,
  visitorState,
  createdAt = Date.now(),
  visitedFarmId,
}: Options): [GameState, GameState] {
  return produce([state, visitorState!], ([game, visitorGame]) => {
    const project = visitorGame.socialFarming.villageProjects[action.project];

    if (!project) {
      throw new Error("Project not found");
    }

    project.helpedAt = createdAt;

    // TODO: remove these once using helpedAt
    project.cheers += 1;
    visitorGame.socialFarming.cheersGiven.projects[action.project] = [
      ...(visitorGame.socialFarming.cheersGiven.projects[action.project] ?? []),
      visitedFarmId,
    ];
  });
}
