import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  getTranslatedItemName,
  ITEM_DETAILS,
} from "features/game/types/images";
import {
  CRUSTACEAN_CHUM_AMOUNTS,
  CRUSTACEANS_LOOKUP,
  WATER_TRAP,
  type CrustaceanChum,
  type CrustaceanName,
  type WaterTrapName,
} from "features/game/types/crustaceans";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { SimpleBox } from "features/island/hud/components/codex/SimpleBox";
import {
  getBasketItems,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { getKeys } from "lib/object";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type Recipe = { trap: WaterTrapName; chum?: CrustaceanChum };

// Every pot + chum combination, keyed by what it catches. Built once from the
// lookup so the grid order follows the lookup's order.
const CRUSTACEANS_BY_TRAP = {} as Record<WaterTrapName, CrustaceanName[]>;
const RECIPES = {} as Partial<Record<CrustaceanName, Recipe[]>>;

getKeys(CRUSTACEANS_LOOKUP).forEach((trap) => {
  CRUSTACEANS_BY_TRAP[trap] = [];
  getKeys(CRUSTACEANS_LOOKUP[trap]).forEach((key) => {
    const name = CRUSTACEANS_LOOKUP[trap][key];
    if (!name) return;
    if (!CRUSTACEANS_BY_TRAP[trap].includes(name)) {
      CRUSTACEANS_BY_TRAP[trap].push(name);
    }
    RECIPES[name] = [
      ...(RECIPES[name] ?? []),
      { trap, chum: key === "none" ? undefined : key },
    ];
  });
});

const _state = (state: MachineState) => state.context.state;

interface Props {
  onSelect: (trap: WaterTrapName, chum?: CrustaceanChum) => void;
}

/**
 * Lists the pot + chum combinations the player has already caught each
 * crustacean with, so they can set the same trap again in one tap. Only reads
 * the player's catch history, so nothing uncaught is revealed.
 */
export const WaterTrapRecipes: React.FC<Props> = ({ onSelect }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const [crustacean, setCrustacean] = useState<CrustaceanName>();

  const { farmActivity, inventory } = state;

  // A no-chum recipe only ever catches its own crustacean (Isopod, Barnacle),
  // so its plain catch count is enough to know it was found.
  const isFound = (name: CrustaceanName, recipe: Recipe) =>
    (recipe.chum
      ? (farmActivity[`${name} Caught with ${recipe.chum}`] ?? 0)
      : (farmActivity[`${name} Caught`] ?? 0)) > 0;

  const foundRecipes = (name: CrustaceanName) =>
    (RECIPES[name] ?? []).filter((recipe) => isFound(name, recipe));

  const trapName = (trap: WaterTrapName) =>
    t(trap === "Crab Pot" ? "crustaceans.crabPot" : "crustaceans.marinerPot");

  if (!crustacean) {
    return (
      <div className="p-2 max-h-[400px] overflow-y-auto scrollable">
        <p className="text-xs mb-2">{t("waterTrapRecipes.pickCrustacean")}</p>
        {getKeys(CRUSTACEANS_BY_TRAP).map((trap) => (
          <div key={trap} className="mb-2">
            <Label type="default" icon={ITEM_DETAILS[trap].image}>
              {trapName(trap)}
            </Label>
            <div className="flex flex-wrap">
              {CRUSTACEANS_BY_TRAP[trap].map((name) => {
                const found = foundRecipes(name).length > 0;
                return (
                  <SimpleBox
                    key={name}
                    image={ITEM_DETAILS[name].image}
                    silhouette={!found}
                    // `SimpleBox` renders a falsy count as "0", so pass
                    // undefined when the player has none.
                    inventoryCount={
                      inventory[name]?.gt(0)
                        ? inventory[name]?.toNumber()
                        : undefined
                    }
                    onClick={found ? () => setCrustacean(name) : undefined}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const items = { ...getBasketItems(inventory), ...getChestItems(state) };
  const ascension = getAscensionLevel({
    experience: state.bumpkin.experience,
    ascensionLevel: state.island.ascensionLevel ?? 0,
  });
  const hasRoyalCrabPot = isCollectibleBuilt({
    name: "Royal Crab Pot",
    game: state,
  });

  // Sorted by chum amount only (no chum first), so rows don't move as
  // inventory changes.
  const recipes = foundRecipes(crustacean).sort(
    (a, b) =>
      (a.chum ? CRUSTACEAN_CHUM_AMOUNTS[a.chum] : 0) -
      (b.chum ? CRUSTACEAN_CHUM_AMOUNTS[b.chum] : 0),
  );

  // Each crustacean is caught by one pot only.
  const trap = recipes[0]?.trap;
  const hasTrap =
    !!trap && (hasRoyalCrabPot || (inventory[trap]?.gte(1) ?? false));
  const canUseTrap =
    !!trap &&
    meetsLevelRequirement(ascension, WATER_TRAP[trap].requiredBumpkinLevel);

  return (
    <div className="p-2">
      <div className="flex items-center mb-2">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          className="cursor-pointer"
          alt={t("back")}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            marginRight: `${PIXEL_SCALE * 4}px`,
          }}
          onClick={() => setCrustacean(undefined)}
        />
        <Label type="default" icon={ITEM_DETAILS[crustacean].image}>
          {getTranslatedItemName(crustacean)}
        </Label>
      </div>

      {trap && !hasTrap && (
        <Label type="danger" icon={ITEM_DETAILS[trap].image} className="mb-2">
          {t("fishing.dont.have.enough.bait", { bait: trapName(trap) })}
        </Label>
      )}

      <p className="text-xs mb-2">{t("waterTrapRecipes.tapRecipe")}</p>

      <div className="flex flex-col gap-1">
        {recipes.map(({ trap, chum }) => {
          const amount = chum ? CRUSTACEAN_CHUM_AMOUNTS[chum] : 0;
          const balance = chum
            ? (items[chum] ?? new Decimal(0))
            : new Decimal(0);
          const canPlace = canUseTrap && hasTrap && balance.gte(amount);

          return (
            <ButtonPanel
              key={chum ?? "none"}
              disabled={!canPlace}
              onClick={canPlace ? () => onSelect(trap, chum) : undefined}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-1 min-w-0">
                <SquareIcon icon={ITEM_DETAILS[trap].image} width={10} />
                <span className="text-xs">{"+"}</span>
                <SquareIcon
                  icon={
                    chum ? ITEM_DETAILS[chum].image : SUNNYSIDE.icons.cancel
                  }
                  width={10}
                />
                <span className="text-xs ml-1">
                  {chum
                    ? getTranslatedItemName(chum)
                    : t("waterTrap.noChumSelected")}
                </span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {chum && (
                  <RequirementLabel
                    type="item"
                    item={chum}
                    balance={balance}
                    requirement={new Decimal(amount)}
                  />
                )}
                <img
                  src={SUNNYSIDE.icons.chevron_right}
                  alt=""
                  style={{ width: `${PIXEL_SCALE * 5}px` }}
                />
              </div>
            </ButtonPanel>
          );
        })}
      </div>
    </div>
  );
};
