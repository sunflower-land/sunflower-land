import {
  BumpkinBody,
  BumpkinHat,
  BumpkinNecklace,
  BumpkinPant,
  BumpkinSecondaryTool,
  BumpkinShirt,
  BumpkinShoe,
  BumpkinTool,
  BumpkinHair,
  BumpkinBackground,
  BumpkinCoat,
  ITEM_IDS,
  BumpkinSuit,
  BumpkinOnesie,
  BumpkinWings,
  BumpkinDress,
} from "features/game/types/bumpkin";

export type BumpkinParts = {
  background?: BumpkinBackground;
  hair?: BumpkinHair;
  body?: BumpkinBody;
  shirt?: BumpkinShirt;
  pants?: BumpkinPant;
  shoes?: BumpkinShoe;
  tool?: BumpkinTool;
  necklace?: BumpkinNecklace;
  coat?: BumpkinCoat;
  hat?: BumpkinHat;
  secondaryTool?: BumpkinSecondaryTool;
  suit?: BumpkinSuit;
  onesie?: BumpkinOnesie;
  wings?: BumpkinWings;
  dress?: BumpkinDress;
};

enum Slots {
  Background = 0,
  Body = 1,
  Hair = 2,
  Shirt = 3,
  Pants = 4,
  Shoes = 5,
  Tool = 6,
  Hat = 7,
  Necklace = 8,
  SecondaryTool = 9,
  Coat = 10,
  Onesie = 11,
  Suit = 12,
  Wings = 13,
  Dress = 14,
}

export function tokenUriBuilder(parts: BumpkinParts) {
  const ids = [];

  ids[Slots.Background] = parts.background ? ITEM_IDS[parts.background] : 0;
  ids[Slots.Body] = parts.body ? ITEM_IDS[parts.body] : 0;
  ids[Slots.Hair] = parts.hair ? ITEM_IDS[parts.hair] : 0;
  ids[Slots.Shirt] = parts.shirt ? ITEM_IDS[parts.shirt] : 0;
  ids[Slots.Pants] = parts.pants ? ITEM_IDS[parts.pants] : 0;
  ids[Slots.Dress] = parts.dress ? ITEM_IDS[parts.dress] : 0;
  ids[Slots.Shoes] = parts.shoes ? ITEM_IDS[parts.shoes] : 0;
  ids[Slots.Tool] = parts.tool ? ITEM_IDS[parts.tool] : 0;
  ids[Slots.Hat] = parts.hat ? ITEM_IDS[parts.hat] : 0;
  ids[Slots.Coat] = parts.coat ? ITEM_IDS[parts.coat] : 0;
  ids[Slots.Necklace] = parts.necklace ? ITEM_IDS[parts.necklace] : 0;
  ids[Slots.Suit] = parts.suit ? ITEM_IDS[parts.suit] : 0;
  ids[Slots.Wings] = parts.wings ? ITEM_IDS[parts.wings] : 0;
  ids[Slots.Onesie] = parts.onesie ? ITEM_IDS[parts.onesie] : 0;
  ids[Slots.SecondaryTool] = parts.secondaryTool
    ? ITEM_IDS[parts.secondaryTool]
    : 0;

  // Trim off trailing 0s
  const lastPartIndex = [...ids].reverse().findIndex(Boolean);
  const validIds = lastPartIndex > 0 ? ids.slice(0, -lastPartIndex) : ids;

  const uriFormat = validIds.join("_");

  return uriFormat;
}
