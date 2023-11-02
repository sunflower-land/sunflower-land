export {};

jest.doMock("assets/sunnyside", () => ({
  SUNNYSIDE: {
    soil: {},
    animals: {},
    vfx: {},
    icons: {},
    npcs: {},
    resource: {},
    tools: {},
    ui: {},
    decorations: {},
  },
}));
