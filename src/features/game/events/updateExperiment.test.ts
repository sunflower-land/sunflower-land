import { TEST_FARM } from "features/game/lib/constants";
import { updateExperiment } from "./updateExperiment";

describe("experiment.toggled", () => {
  it("turns an experiment on", () => {
    const state = updateExperiment({
      state: TEST_FARM,
      action: {
        type: "experiment.toggled",
        experiment: "newLandscaping",
        enabled: true,
      },
    });

    expect(state.settings.experiments).toEqual({ newLandscaping: true });
  });

  it("turns an experiment back off", () => {
    const state = updateExperiment({
      state: {
        ...TEST_FARM,
        settings: {
          ...TEST_FARM.settings,
          experiments: { newLandscaping: true },
        },
      },
      action: {
        type: "experiment.toggled",
        experiment: "newLandscaping",
        enabled: false,
      },
    });

    expect(state.settings.experiments).toEqual({ newLandscaping: false });
  });
});
