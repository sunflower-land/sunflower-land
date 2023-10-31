import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { FISH } from "features/game/types/fishing";
import { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import React from "react";

interface Props {
  farmActivity: GameState["farmActivity"];
  caught: Partial<Record<InventoryItemName, number>>;
  onClaim: () => void;
}

export const FishCaught: React.FC<Props> = ({
  farmActivity,
  caught,
  onClaim,
}) => {
  if (!caught || getKeys(caught).length === 0) {
    return (
      <>
        <div className="p-2">
          <div className="relative h-14">
            <img
              src={SUNNYSIDE.icons.sad}
              className="w-10 my-2 absolute -top-[12%] left-1/2 -translate-x-1/2"
            />
          </div>
          <p className="text-sm mb-2 text-center">Oh no! It got away</p>
        </div>
        <Button onClick={onClaim}>Ok</Button>
      </>
    );
  }
  return (
    <>
      <div className="p-2">
        {getKeys(caught).map((name) => {
          const isNew = name in FISH && farmActivity[`${name} Caught`] === 1;

          return (
            <div
              className="flex flex-col justify-center items-center"
              key={name}
            >
              {isNew && (
                // TODO - use codex icon
                <Label type="warning" icon={SUNNYSIDE.icons.search}>
                  New fish
                </Label>
              )}
              <span className="text-sm mb-2">{name}</span>
              <img src={ITEM_DETAILS[name]?.image} className="h-12 mb-2" />
              <span className="text-xs mb-2">
                {ITEM_DETAILS[name].description}
              </span>
            </div>
          );
        })}
      </div>
      <Button onClick={onClaim}>Ok</Button>
    </>
  );
};
