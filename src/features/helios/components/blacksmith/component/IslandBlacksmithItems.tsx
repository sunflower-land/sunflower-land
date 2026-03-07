import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";

import { Button } from "components/ui/Button";
import {
  CraftableCollectible,
  HELIOS_BLACKSMITH_ITEMS,
  HeliosBlacksmithItem,
} from "features/game/types/collectibles";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { gameAnalytics } from "lib/gameAnalytics";
import { getChapterTicket } from "features/game/types/chapters";
import Decimal from "decimal.js-light";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import {
  MonumentName,
  REQUIRED_CHEERS,
  REWARD_ITEMS,
  VillageProjectName,
  WORKBENCH_MONUMENTS,
  WorkbenchMonumentName,
} from "features/game/types/monuments";
import { GameState } from "features/game/types/game";
import { Label } from "components/ui/Label";
import helpIcon from "assets/icons/help.webp";
import { getBumpkinLevel } from "features/game/lib/level";
import { useNow } from "lib/utils/hooks/useNow";
import { MachineState } from "features/game/lib/gameMachine";
import { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";

const PROJECTS: WorkbenchMonumentName[] = [
  "Basic Cooking Pot",
  "Expert Cooking Pot",
  "Advanced Cooking Pot",
  "Big Orange",
  "Big Apple",
  "Big Banana",
  "Farmer's Monument",
  "Woodcutter's Monument",
  "Miner's Monument",
];

const DecorationLabel = ({
  gameState,
  selectedName,
}: {
  gameState: GameState;
  selectedName: HeliosBlacksmithItem | WorkbenchMonumentName;
}) => {
  const { t } = useAppTranslation();

  const isMonument = selectedName in WORKBENCH_MONUMENTS;

  const hasBuiltMonument = () => {
    return !!gameState.inventory[selectedName as MonumentName]?.gt(0);
  };

  if (hasBuiltMonument()) {
    return (
      <div className="flex justify-center">
        <Label type="transparent" icon={helpIcon} className="mb-0.5">
          {t("monument.requiredHelp", {
            amount: REQUIRED_CHEERS[selectedName as MonumentName],
          })}
        </Label>

        <Label type="success" icon={SUNNYSIDE.icons.confirm}>
          {t("already.built")}
        </Label>
      </div>
    );
  }

  if (isMonument) {
    const reward = REWARD_ITEMS[selectedName as VillageProjectName];

    return (
      <div className="flex items-center flex-col space-y-1">
        <Label type="transparent" icon={helpIcon} className="mb-1">
          {t("monument.requiredHelp", {
            amount: REQUIRED_CHEERS[selectedName as MonumentName],
          })}
        </Label>
        {reward && (
          <Label type="warning" icon={ITEM_DETAILS[reward.item].image}>
            {reward.amount > 1 && `${reward.amount} `}
            {reward.item}
          </Label>
        )}
      </div>
    );
  }

  return null;
};

const BLACKSMITH_ITEMS: Record<
  HeliosBlacksmithItem | WorkbenchMonumentName,
  CraftableCollectible
> = {
  ...HELIOS_BLACKSMITH_ITEMS,
  ...WORKBENCH_MONUMENTS,
};

const _state = (state: MachineState) => state.context.state;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _coins = (state: MachineState) => state.context.state.coins;
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _landscapingMachine = (state: MachineState) =>
  state.children.landscaping as MachineInterpreter;

export const IslandBlacksmithItems: React.FC = () => {
  const { t } = useAppTranslation();
  const [selectedName, setSelectedName] = useState<
    HeliosBlacksmithItem | WorkbenchMonumentName
  >("Basic Scarecrow");
  const { gameService, shortcutItem } = useContext(Context);
  const state = useSelector(gameService, _state);
  const now = useNow();
  const ticket = getChapterTicket(now);
  const inventory = useSelector(gameService, _inventory);
  const coins = useSelector(gameService, _coins);
  const bumpkin = useSelector(gameService, _bumpkin);
  const landscapingMachine = useSelector(gameService, _landscapingMachine);

  const { ...selectedItem } = BLACKSMITH_ITEMS[selectedName];

  // Change boost if skill is active
  if (selectedItem) {
    if (
      selectedName === "Immortal Pear" &&
      bumpkin.skills["Pear Turbocharge"]
    ) {
      selectedItem.boost = t("description.immortal.pear.boosted.boost");
    }
    if (selectedName === "Macaw" && bumpkin.skills["Loyal Macaw"]) {
      selectedItem.boost = t("description.macaw.boosted.boost");
    }
  }

  const isAlreadyCrafted = inventory[selectedName]?.greaterThanOrEqualTo(1);

  const lessIngredients = () =>
    getKeys(selectedItem?.ingredients ?? {}).some((name) =>
      (selectedItem?.ingredients ?? {})[name]?.greaterThan(
        inventory[name] || 0,
      ),
    );

  const lessCoins = () => coins < (selectedItem?.coins ?? 0);

  const hasLevel =
    !selectedItem?.level ||
    getBumpkinLevel(bumpkin?.experience ?? 0) >= selectedItem?.level;

  const craft = () => {
    if (selectedName in WORKBENCH_MONUMENTS) {
      landscapingMachine.send("SELECT", {
        placeable: { name: selectedName },
        action: "monument.bought",
        requirements: {
          coins: selectedItem?.coins ?? 0,
          ingredients: selectedItem?.ingredients ?? {},
        },
        multiple: false,
      });
    } else {
      landscapingMachine.send("SELECT", {
        placeable: { name: selectedName },
        action: "collectible.crafted",
        // Not used yet
        requirements: {
          sfl: new Decimal(0),
          ingredients: {},
        },
      });
    }

    const count = inventory[selectedName]?.toNumber() ?? 1;
    gameAnalytics.trackMilestone({
      event: `Crafting:Collectible:${selectedName}${count}`,
    });

    if ((selectedItem?.ingredients ?? {})[ticket]) {
      gameAnalytics.trackSink({
        currency: "Seasonal Ticket",
        amount: (selectedItem?.ingredients ?? {})[ticket]?.toNumber() ?? 1,
        item: selectedName,
        type: "Collectible",
      });
    }

    shortcutItem(selectedName);
  };

  const hasBuiltMonument = () => {
    return !!inventory[selectedName as MonumentName]?.gt(0);
  };

  const VALID_EQUIPMENT: HeliosBlacksmithItem[] = [
    "Basic Scarecrow",
    "Scary Mike",
    "Laurie the Chuckle Crow",
    "Immortal Pear",
    "Bale",
    "Stone Beetle",
    "Iron Beetle",
    "Gold Beetle",
    "Fairy Circle",
    "Macaw",
    "Squirrel",
    "Butterfly",
  ];

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            item: selectedName,
            from: selectedItem?.from,
            to: selectedItem?.to,
          }}
          boost={COLLECTIBLE_BUFF_LABELS[selectedName]?.({
            skills: state.bumpkin.skills,
            collectibles: state.collectibles,
          })}
          requirements={{
            resources: selectedItem?.ingredients ?? {},
            coins: selectedItem?.coins ?? 0,
            level: selectedItem?.level ?? 0,
          }}
          actionView={
            isAlreadyCrafted ? (
              <p className="text-xxs text-center mb-1 font-secondary">
                {t("alr.crafted")}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex justify-left sm:justify-center ml-1">
                  <DecorationLabel
                    gameState={state}
                    selectedName={selectedName}
                  />
                </div>
                <div>
                  <Button
                    disabled={
                      lessIngredients() ||
                      lessCoins() ||
                      hasBuiltMonument() ||
                      !hasLevel
                    }
                    onClick={craft}
                  >
                    {t("craft")}
                  </Button>
                </div>
              </div>
            )
          }
        />
      }
      content={
        <div className="flex flex-col">
          <div className="flex flex-wrap">
            {VALID_EQUIPMENT.map((name: HeliosBlacksmithItem) => {
              return (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  onClick={() => setSelectedName(name)}
                  image={ITEM_DETAILS[name].image}
                  count={inventory[name]}
                  overlayIcon={
                    <img
                      src={SUNNYSIDE.icons.stopwatch}
                      id="confirm"
                      alt="confirm"
                      className="object-contain absolute"
                      style={{
                        width: `${PIXEL_SCALE * 8}px`,
                        top: `${PIXEL_SCALE * -4}px`,
                        right: `${PIXEL_SCALE * -4}px`,
                      }}
                    />
                  }
                />
              );
            })}
          </div>

          <div className="flex justify-between items-center my-2">
            <Label type="default">{t("craft.with.friends")}</Label>
            <img src={helpIcon} alt="help" className=" h-6 mr-2" />
          </div>

          <p className="text-xs mb-1 font-secondary mx-1">
            {t("workbench.helpRequired")}
          </p>

          <div className="flex flex-wrap">
            {PROJECTS.map((name) => {
              return (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  onClick={() => setSelectedName(name)}
                  image={ITEM_DETAILS[name].image}
                  count={inventory[name]}
                  overlayIcon={
                    <img
                      src={SUNNYSIDE.icons.stopwatch}
                      id="confirm"
                      alt="confirm"
                      className="object-contain absolute"
                      style={{
                        width: `${PIXEL_SCALE * 8}px`,
                        top: `${PIXEL_SCALE * -4}px`,
                        right: `${PIXEL_SCALE * -4}px`,
                      }}
                    />
                  }
                />
              );
            })}
          </div>
        </div>
      }
    />
  );
};
