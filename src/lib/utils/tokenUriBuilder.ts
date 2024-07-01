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
  ITEM_NAMES,
  BumpkinBeard,
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
  beard?: BumpkinBeard;
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
  Beard = 15,
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
  ids[Slots.Beard] = parts.beard ? ITEM_IDS[parts.beard] : 0;
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

function getItemName<T>(id: number | string): T {
  return ITEM_NAMES[id] as unknown as T;
}

function getOrderedIds(parts: BumpkinParts) {
  const {
    background,
    hair,
    body,
    shirt,
    pants,
    shoes,
    tool,
    necklace,
    coat,
    hat,
    secondaryTool,
    onesie,
    suit,
    wings,
    dress,
  } = parts;

  const bgId = background ? ITEM_IDS[background] : 0;
  const bodyId = body ? ITEM_IDS[body] : 0;
  const hairId = hair ? ITEM_IDS[hair] : 0;
  const shirtId = shirt ? ITEM_IDS[shirt] : 0;
  const pantsId = pants ? ITEM_IDS[pants] : 0;
  const shoesId = shoes ? ITEM_IDS[shoes] : 0;
  const coatId = coat ? ITEM_IDS[coat] : 0;
  const toolId = tool ? ITEM_IDS[tool] : 0;
  const hatId = hat ? ITEM_IDS[hat] : 0;
  const neckId = necklace ? ITEM_IDS[necklace] : 0;
  const sToolId = secondaryTool ? ITEM_IDS[secondaryTool] : 0;
  const onesieId = onesie ? ITEM_IDS[onesie] : 0;
  const suitId = suit ? ITEM_IDS[suit] : 0;
  const wingsId = wings ? ITEM_IDS[wings] : 0;
  const dressId = dress ? ITEM_IDS[dress] : 0;

  return [
    bgId, // 0
    bodyId, // 1
    hairId, // 2
    shirtId, // 3
    pantsId, // 4
    shoesId, // 5
    toolId, // 6
    hatId, // 7
    neckId, // 8
    sToolId, // 9
    coatId, // 10
    onesieId, // 11
    suitId, // 12
    wingsId, // 13
    dressId, // 14
  ];
}

export function interpretTokenUri(tokenUri: string) {
  // Remove the baseUri (sunflower-land.com/testnet/)
  const urlParts = tokenUri.split("/");
  const tokenPart = urlParts[urlParts.length - 1];

  const parts = tokenPart.split("_");
  // Bug with web2 farm metadata
  if (!parts[1].startsWith("v")) {
    parts.splice(1, 1);
  }
  const [tokenId, version, ...ids] = parts.map((val) =>
    !val.startsWith("v") ? Number(val) : val,
  );

  const equipped: BumpkinParts = {
    background: getItemName<BumpkinBackground>(ids[Slots.Background]),
    body: getItemName<BumpkinBody>(ids[Slots.Body]),
    hair: getItemName<BumpkinHair>(ids[Slots.Hair]),
    shoes: getItemName<BumpkinShoe>(ids[Slots.Shoes]),
    tool: getItemName<BumpkinTool>(ids[Slots.Tool]),

    ...(ids[Slots.Shirt] && {
      shirt: getItemName<BumpkinShirt>(ids[Slots.Shirt]),
    }),
    ...(ids[Slots.Pants] && {
      pants: getItemName<BumpkinPant>(ids[Slots.Pants]),
    }),
    ...(ids[Slots.Hat] && { hat: getItemName<BumpkinHat>(ids[Slots.Hat]) }),
    ...(ids[Slots.Coat] && { coat: getItemName<BumpkinCoat>(ids[Slots.Coat]) }),
    ...(ids[Slots.Necklace] && {
      necklace: getItemName<BumpkinNecklace>(ids[Slots.Necklace]),
    }),
    ...(ids[Slots.SecondaryTool] && {
      secondaryTool: getItemName<BumpkinSecondaryTool>(
        ids[Slots.SecondaryTool],
      ),
    }),
    ...(ids[Slots.Onesie] && {
      onesie: getItemName<BumpkinOnesie>(ids[Slots.Onesie]),
    }),
    ...(ids[Slots.Suit] && {
      suit: getItemName<BumpkinSuit>(ids[Slots.Suit]),
    }),
    ...(ids[Slots.Wings] && {
      wings: getItemName<BumpkinWings>(ids[Slots.Wings]),
    }),
    ...(ids[Slots.Dress] && {
      dress: getItemName<BumpkinDress>(ids[Slots.Dress]),
    }),
  };

  const orderedIds = getOrderedIds(equipped);

  // Trim trailing empty slots
  const fileName = `${orderedIds.join("_").replace(/(_0)+$/, "")}`;

  return { tokenId: Number(tokenId), version, equipped, fileName, orderedIds };
}
