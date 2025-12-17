import { SUNNYSIDE } from "assets/sunnyside";
import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import React, { useContext, useState } from "react";
import { getKeys } from "../lib/crafting";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { PetShrineName } from "../types/pets";
import { Context } from "../GameProvider";
import { PlaceableLocation } from "../types/collectibles";
import { MachineState } from "../lib/gameMachine";
import { useSelector } from "@xstate/react";
import { PET_SHOP_ITEMS } from "../types/petShop";

type Props = {
  show: boolean;
  onHide: () => void;
  name: PetShrineName | "Obsidian Shrine";
  id: string;
  location: PlaceableLocation;
};

const _inventory = (state: MachineState) => state.context.state.inventory;
const _coinBalance = (state: MachineState) => state.context.state.coins;

export const RenewPetShrine: React.FC<Props> = ({
  show,
  onHide,
  name,
  id,
  location,
}) => {
  const { gameService } = useContext(Context);
  const [showIngredients, setShowIngredients] = useState(false);

  const inventory = useSelector(gameService, _inventory);
  const coinBalance = useSelector(gameService, _coinBalance);

  const handleRemove = () => {
    gameService.send("collectible.burned", { name, location, id });
  };

  const handleRenew = () => {
    gameService.send("petShrine.renewed", { name, location, id });
  };

  const petShrineCost = PET_SHOP_ITEMS[name];

  const requirements = petShrineCost.ingredients;
  const coinCost = petShrineCost.coins ?? 0;

  const canRenew = () => {
    if (coinBalance < coinCost) return false;

    const hasIngredients = getKeys(requirements).every((itemName) => {
      const hasAmount =
        inventory[itemName]?.gte(requirements[itemName] ?? new Decimal(0)) ??
        false;

      return hasAmount;
    });

    return hasIngredients;
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Panel>
        <div className="flex flex-col gap-2 p-1">
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            {`${name} Expired`}
          </Label>
          <p className="text-xs">
            {`${name} has expired. You can renew it or burn it.`}
          </p>
          <div
            className="flex flex-wrap p-2 gap-2 cursor-pointer"
            onClick={() => setShowIngredients(!showIngredients)}
          >
            <IngredientsPopover
              show={showIngredients}
              ingredients={getKeys(requirements)}
              onClick={() => setShowIngredients(false)}
            />
            {getKeys(requirements).map((itemName) => {
              return (
                <RequirementLabel
                  key={itemName}
                  type="item"
                  item={itemName}
                  balance={inventory[itemName] ?? new Decimal(0)}
                  requirement={requirements[itemName] ?? new Decimal(0)}
                />
              );
            })}
          </div>
        </div>
        <div className="flex justify-between gap-1">
          <Button onClick={handleRemove}>{`Burn`}</Button>
          <Button onClick={handleRenew} disabled={!canRenew()}>
            {`Renew`}
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
