import { SUNNYSIDE } from "assets/sunnyside";
import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { Modal } from "components/ui/Modal";
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
import { Collectibles, Inventory, Skills } from "../types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { COLLECTIBLE_BUFF_LABELS } from "../types/collectibleItemBuffs";
import { EXPIRY_COOLDOWNS } from "../lib/collectibleBuilt";
import { secondsToString } from "lib/utils/time";
import { CloseButtonPanel } from "./CloseablePanel";

type Props = {
  show: boolean;
  onHide: () => void;
  name: PetShrineName | "Obsidian Shrine";
  id: string;
  location: PlaceableLocation;
};

const _inventory = (state: MachineState) => state.context.state.inventory;
const _coinBalance = (state: MachineState) => state.context.state.coins;
const _skills = (state: MachineState) => state.context.state.bumpkin.skills;
const _collectibles = (state: MachineState) => state.context.state.collectibles;

export const RenewPetShrine: React.FC<Props> = ({
  show,
  onHide,
  name,
  id,
  location,
}) => {
  const { gameService } = useContext(Context);

  const inventory = useSelector(gameService, _inventory);
  const coinBalance = useSelector(gameService, _coinBalance);
  const skills = useSelector(gameService, _skills);
  const collectibles = useSelector(gameService, _collectibles);

  const handleRenew = () => {
    gameService.send({ type: "petShrine.renewed", name, location, id });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <CloseButtonPanel onClose={onHide}>
        <RenewPetShrineContent
          handleRenew={handleRenew}
          name={name}
          inventory={inventory}
          coinBalance={coinBalance}
          skills={skills}
          collectibles={collectibles}
        />
      </CloseButtonPanel>
    </Modal>
  );
};

const RenewPetShrineContent: React.FC<{
  handleRenew: () => void;
  name: PetShrineName | "Obsidian Shrine";
  inventory: Inventory;
  coinBalance: number;
  skills: Skills;
  collectibles: Collectibles;
}> = ({ handleRenew, name, inventory, coinBalance, skills, collectibles }) => {
  const { t } = useAppTranslation();
  const [showIngredients, setShowIngredients] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const isRenewable = canRenew();

  const shrineBoostLabel = COLLECTIBLE_BUFF_LABELS[name]?.({
    skills,
    collectibles,
  });

  const shrineCooldown = EXPIRY_COOLDOWNS[name];

  return (
    <>
      <div className="flex flex-col gap-2 p-1">
        {showConfirmation && (
          <>
            <Label type="warning">{t("confirm.renew")}</Label>
            <p className="text-xs">{t("confirm.renew.message", { name })}</p>
          </>
        )}
        {!showConfirmation && (
          <>
            <Label type="danger" icon={SUNNYSIDE.icons.stopwatch}>
              {t("shrine.expired", { name })}
            </Label>
            <p className="text-xs">{t("renew.expired.message", { name })}</p>
          </>
        )}
        {shrineBoostLabel && (
          <div className="flex flex-wrap gap-2">
            {shrineBoostLabel.map(
              ({
                labelType,
                boostTypeIcon,
                boostedItemIcon,
                shortDescription,
              }) => {
                return (
                  <Label
                    key={`${shortDescription}-${labelType}-${boostTypeIcon}-${boostedItemIcon}`}
                    type={labelType}
                    icon={boostTypeIcon}
                    secondaryIcon={boostedItemIcon}
                  >
                    {shortDescription}
                  </Label>
                );
              },
            )}
          </div>
        )}
        <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
          {t("shrine.expiryLabel", {
            time: secondsToString(shrineCooldown / 1000, { length: "short" }),
          })}
        </Label>
        <div
          className="flex flex-wrap p-2 gap-2 cursor-pointer"
          onClick={() => setShowIngredients(!showIngredients)}
        >
          <IngredientsPopover
            show={showIngredients}
            ingredients={getKeys(requirements)}
            onClick={() => setShowIngredients(false)}
          />
          {coinCost > 0 && (
            <RequirementLabel
              type="coins"
              balance={coinBalance}
              requirement={coinCost}
            />
          )}
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
      {showConfirmation && (
        <div className="flex justify-between gap-1">
          <Button onClick={() => setShowConfirmation(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleRenew}>{t("renew")}</Button>
        </div>
      )}
      {!showConfirmation && (
        <div className="flex justify-between gap-1">
          <Button
            onClick={() => setShowConfirmation(true)}
            disabled={!isRenewable}
          >
            {t("renew")}
          </Button>
        </div>
      )}
    </>
  );
};
