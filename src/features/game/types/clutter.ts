import { translate } from "lib/i18n/translate";

export type Garbage = "Trash" | "Dung" | "Weed";
// export type Pest = "Anthill" | "Rat" | "Snail";

export type ClutterName = Garbage;

export const CLUTTER: Record<ClutterName, string> = {
  Trash: translate("description.trash"),
  Dung: translate("description.dung"),
  Weed: translate("description.weed"),
};
