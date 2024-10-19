import { ChoreName } from "features/game/types/choreBoard";
import { ITEM_DETAILS } from "features/game/types/images";
import { translate } from "lib/i18n/translate";

export const CHORE_DETAILS: Record<
  ChoreName,
  { icon: string; description: string }
> = {
  CHOP_1_TREE: {
    description: translate("chore.chop.1.tree"),
    icon: ITEM_DETAILS.Axe.image,
  },
  CHOP_2_TREE: {
    description: translate("chore.chop.2.trees"),
    icon: ITEM_DETAILS.Axe.image,
  },
};
