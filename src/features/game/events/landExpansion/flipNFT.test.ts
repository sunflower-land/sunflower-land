import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import type { Bud } from "features/game/types/buds";
import type { PetNFT } from "features/game/types/pets";
import { FLIP_NFT_ERRORS, flipNFT } from "./flipNFT";

const BUD: Bud = {
  aura: "Basic",
  colour: "Beige",
  ears: "Ears",
  stem: "3 Leaf Clover",
  type: "Beach",
  coordinates: { x: 4, y: 4 },
  location: "farm",
};

const PET: PetNFT = {
  id: 1,
  name: "Pet #1",
  requests: { food: [], fedAt: 0 },
  energy: 100,
  experience: 0,
  pettedAt: 0,
  coordinates: { x: 2, y: 2 },
  location: "petHouse",
};

const GAME_STATE: GameState = {
  ...TEST_FARM,
  buds: { 1: BUD },
  pets: { ...TEST_FARM.pets, nfts: { 1: PET } },
};

describe("flipNFT", () => {
  it("throws if the bud does not exist", () => {
    expect(() =>
      flipNFT({
        state: GAME_STATE,
        action: { type: "nft.flipped", id: "2", nft: "Bud", location: "farm" },
      }),
    ).toThrow(FLIP_NFT_ERRORS.NO_NFT);
  });

  it("throws if the bud is not placed", () => {
    expect(() =>
      flipNFT({
        state: {
          ...GAME_STATE,
          buds: { 1: { ...BUD, coordinates: undefined } },
        },
        action: { type: "nft.flipped", id: "1", nft: "Bud", location: "farm" },
      }),
    ).toThrow(FLIP_NFT_ERRORS.NFT_NOT_PLACED);
  });

  it("throws if the NFT is placed on another surface", () => {
    expect(() =>
      flipNFT({
        state: GAME_STATE,
        action: { type: "nft.flipped", id: "1", nft: "Pet", location: "farm" },
      }),
    ).toThrow(FLIP_NFT_ERRORS.NFT_NOT_PLACED);
  });

  it("flips a bud", () => {
    const result = flipNFT({
      state: GAME_STATE,
      action: { type: "nft.flipped", id: "1", nft: "Bud", location: "farm" },
    });

    expect(result.buds?.[1].flipped).toBe(true);
  });

  it("unflips a bud", () => {
    const result = flipNFT({
      state: { ...GAME_STATE, buds: { 1: { ...BUD, flipped: true } } },
      action: { type: "nft.flipped", id: "1", nft: "Bud", location: "farm" },
    });

    expect(result.buds?.[1].flipped).toBe(false);
  });

  it("flips a pet NFT in the pet house", () => {
    const result = flipNFT({
      state: GAME_STATE,
      action: {
        type: "nft.flipped",
        id: "1",
        nft: "Pet",
        location: "petHouse",
      },
    });

    expect(result.pets?.nfts?.[1].flipped).toBe(true);
  });
});
