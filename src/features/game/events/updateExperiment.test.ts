import { TEST_FARM } from "features/game/lib/constants";
import { updateExperiment } from "./updateExperiment";

describe("experiment.toggled", () => {
  it("turns an experiment on", () => {
    const state = updateExperiment({
      state: TEST_FARM,
      action: {
        type: "experiment.toggled",
        experiment: "savedLayouts",
        enabled: true,
      },
    });

    expect(state.settings.experiments).toEqual({ savedLayouts: true });
  });

  it("turns an experiment back off", () => {
    const state = updateExperiment({
      state: {
        ...TEST_FARM,
        settings: {
          ...TEST_FARM.settings,
          experiments: { savedLayouts: true },
        },
      },
      action: {
        type: "experiment.toggled",
        experiment: "savedLayouts",
        enabled: false,
      },
    });

    expect(state.settings.experiments).toEqual({ savedLayouts: false });
  });
});
