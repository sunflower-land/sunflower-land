import { FactionName } from "features/game/types/game";

import sunflorianPointIcon from "assets/icons/sunflorians_point.webp";
import goblinsPointIcon from "assets/icons/goblins_point.webp";
import nightshadesPointIcon from "assets/icons/nightshades_point.webp";
import bumpkinsPointIcon from "assets/icons/bumpkins_point.webp";

export const FACTION_POINT_ICONS: Record<FactionName, string> = {
  sunflorians: sunflorianPointIcon,
  goblins: goblinsPointIcon,
  nightshades: nightshadesPointIcon,
  bumpkins: bumpkinsPointIcon,
};
