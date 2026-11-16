import { playerModalManager } from "./playerModalManager";

const PLAYER = { farmId: 1, username: "pumpkin' pete" };

describe("playerModalManager", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // The manager is a module singleton, so reset it between cases by taking it
    // through a close and letting the Escape grace window lapse.
    playerModalManager.close();
    jest.advanceTimersByTime(1000);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("notifies open listeners", () => {
    const listener = jest.fn();
    const unsubscribe = playerModalManager.listen(listener);

    playerModalManager.open(PLAYER);

    expect(listener).toHaveBeenCalledWith(PLAYER);

    unsubscribe();
    playerModalManager.open(PLAYER);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("does not block Escape while closed", () => {
    expect(playerModalManager.isBlockingEscape()).toBe(false);
  });

  it("blocks Escape while the modal is open", () => {
    playerModalManager.open(PLAYER);

    expect(playerModalManager.isBlockingEscape()).toBe(true);
  });

  it("keeps blocking Escape immediately after closing", () => {
    // The keypress that closed the modal reaches the page underneath in the
    // same tick, so the block has to outlive the close itself.
    playerModalManager.open(PLAYER);
    playerModalManager.close();

    expect(playerModalManager.isBlockingEscape()).toBe(true);
  });

  it("stops blocking Escape once the grace window lapses", () => {
    playerModalManager.open(PLAYER);
    playerModalManager.close();

    jest.advanceTimersByTime(150);

    expect(playerModalManager.isBlockingEscape()).toBe(false);
  });

  it("ignores a close when it was never opened", () => {
    playerModalManager.open(PLAYER);
    playerModalManager.close();
    jest.advanceTimersByTime(1000);

    // A second close must not restart the grace window.
    playerModalManager.close();

    expect(playerModalManager.isBlockingEscape()).toBe(false);
  });
});
