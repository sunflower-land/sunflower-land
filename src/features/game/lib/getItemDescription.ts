import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { BumpkinRevampSkillName } from "features/game/types/bumpkinSkills";
import { CollectibleName } from "features/game/types/craftables";
import { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";

export function getItemDescription({
  item,
  game,
}: {
  item: InventoryItemName;
  game: GameState;
}) {
  const details = ITEM_DETAILS[item];
  let description = details.description;

  if (details.boostedDescriptions) {
    for (const boostedDescription of details.boostedDescriptions) {
      if (
        isCollectibleBuilt({
          name: boostedDescription.name as CollectibleName,
          game,
        }) ||
        game.bumpkin?.skills[boostedDescription.name as BumpkinRevampSkillName]
      ) {
        description = boostedDescription.description;
      }
    }
  }

  return description;
}
