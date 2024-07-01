import { TEST_FARM } from "features/game/lib/constants";
import { readMessage } from "./readMessage";

describe("readMessage", () => {
  it("ensures message has not been read", () => {
    expect(() =>
      readMessage({
        action: {
          type: "message.read",
          id: "1",
        },
        createdAt: Date.now(),
        state: {
          ...TEST_FARM,
          mailbox: {
            read: [{ id: "1", createdAt: 0 }],
          },
        },
      }),
    ).toThrow("Message already read");
  });
});
