import fs from "fs";
// import i18n from "lib/i18n";

// import { getKeys } from "../src/features/game/types/decorations";
import { ITEM_DETAILS } from "../src/features/game/types/images";
import { LanguageCode } from "../src/lib/i18n/dictionaries/dictionary";
// import { InventoryItemName } from "../src/features/game/types/game";
// import { translate } from "lib/i18n/translate";

interface ItemDetails {
  description: Partial<Record<LanguageCode, string>>;
  image: any;
  secondaryImage?: any;
  howToGetItem?: string[];
}

// const obj = getKeys(ITEM_DETAILS).reduce((acc, itemName) => {
//   const item = ITEM_DETAILS[itemName as InventoryItemName];
//   i18n.changeLanguage("en");
//   const en = translate(item.description as any);

//   i18n.changeLanguage("pt");

//   const pt = translate(item.description as any);

//   i18n.changeLanguage("fr");

//   const fr = translate(item.description as any);

//   i18n.changeLanguage("tk");

//   const tk = translate(item.description as any);

//   i18n.changeLanguage("zh-CN");

//   const ch = translate(item.description as any);

//   return {
//     ...acc,
//     [itemName]: {
//       boostedDescriptions: item.boostedDescriptions,
//       image: item.image,
//       secondaryImage: item.secondaryImage,
//       section: item.secondaryImage,
//       howToGetItem: item.howToGetItem?.map((string) => {
//         i18n.changeLanguage("en");
//         const en = translate(string as any);
//         i18n.changeLanguage("pt");
//         const pt = translate(string as any);
//         i18n.changeLanguage("fr");
//         const fr = translate(string as any);
//         i18n.changeLanguage("tk");
//         const tk = translate(string as any);
//         i18n.changeLanguage("zh-CN");

//         const ch = translate(string as any);
//         return { en, pt, fr, tk, ["zh-CN"]: ch };
//       }),
//       itemType: item.itemType,
//       description: {
//         en,
//         pt,
//         ["zh-CN"]: ch,
//         ["fr"]: fr,
//         ["tk"]: tk,
//       },
//     },
//   };
// }, {});

fs.writeFileSync("translations.json", JSON.stringify(ITEM_DETAILS, null, 2));
