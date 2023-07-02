import { chooseRoom } from "./availableRooms";

describe("availableRoom", () => {
  it("chooses the first room", () => {
    const room = chooseRoom("dawn_breaker", [
      {
        clients: 56,
        maxClients: 100,
        name: "dawn_breaker",
        roomId: "asd12&@",
      },
    ]);

    expect(room).toEqual("dawn_breaker");
  });

  it("chooses the second room", () => {
    const room = chooseRoom("dawn_breaker", [
      {
        clients: 100,
        maxClients: 100,
        name: "dawn_breaker",
        roomId: "asd12&@",
      },
    ]);

    expect(room).toEqual("dawn_breaker_2");
  });
  it("chooses the third room", () => {
    const room = chooseRoom("dawn_breaker", [
      {
        clients: 100,
        maxClients: 100,
        name: "dawn_breaker",
        roomId: "asd12&@",
      },
      {
        clients: 100,
        maxClients: 100,
        name: "dawn_breaker_2",
        roomId: "asd12&@",
      },
    ]);

    expect(room).toEqual("dawn_breaker_3");
  });
  it("chooses the fourth room", () => {
    const room = chooseRoom("dawn_breaker", [
      {
        clients: 100,
        maxClients: 100,
        name: "dawn_breaker",
        roomId: "asd12&@",
      },
      {
        clients: 100,
        maxClients: 100,
        name: "dawn_breaker_2",
        roomId: "asd12&@",
      },
      {
        clients: 100,
        maxClients: 100,
        name: "dawn_breaker_3",
        roomId: "asd12&@",
      },
    ]);

    expect(room).toEqual("dawn_breaker_4");
  });
  it("chooses the fifth room", () => {
    const room = chooseRoom("dawn_breaker", [
      {
        clients: 100,
        maxClients: 100,
        name: "dawn_breaker",
        roomId: "asd12&@",
      },
      {
        clients: 100,
        maxClients: 100,
        name: "dawn_breaker_2",
        roomId: "asd12&@",
      },
      {
        clients: 100,
        maxClients: 100,
        name: "dawn_breaker_3",
        roomId: "asd12&@",
      },
      {
        clients: 100,
        maxClients: 100,
        name: "dawn_breaker_4",
        roomId: "asd12&@",
      },
    ]);

    expect(room).toEqual("dawn_breaker_5");
  });
  it("returns undefined if all rooms are full", () => {
    const room = chooseRoom("dawn_breaker", [
      {
        clients: 100,
        maxClients: 100,
        name: "dawn_breaker",
        roomId: "asd12&@",
      },
      {
        clients: 100,
        maxClients: 100,
        name: "dawn_breaker_2",
        roomId: "asd12&@",
      },
      {
        clients: 100,
        maxClients: 100,
        name: "dawn_breaker_3",
        roomId: "asd12&@",
      },
      {
        clients: 100,
        maxClients: 100,
        name: "dawn_breaker_4",
        roomId: "asd12&@",
      },
      {
        clients: 100,
        maxClients: 100,
        name: "dawn_breaker_5",
        roomId: "asd12&@",
      },
    ]);

    expect(room).toBeUndefined();
  });
});
