import { FactionName } from "features/game/types/game";

import sunflorianPointIcon from "public/assets/icons/sunflorians_point.webp";
import goblinsPointIcon from "public/assets/icons/goblins_point.webp";
import nightshadesPointIcon from "public/assets/icons/nightshades_point.webp";
import bumpkinsPointIcon from "public/assets/icons/bumpkins_point.webp";

export const FACTION_POINT_ICONS: Record<FactionName, string> = {
  sunflorians: sunflorianPointIcon,
  goblins: goblinsPointIcon,
  nightshades: nightshadesPointIcon,
  bumpkins: bumpkinsPointIcon,
};
