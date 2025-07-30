import { useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SplitScreenView } from "components/ui/SplitScreenView";
import {
  LANDSCAPING_DECORATIONS,
  getKeys,
  Decoration,
} from "features/game/types/decorations";
import { ITEM_DETAILS } from "features/game/types/images";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { Context } from "features/game/GameProvider";
import { ITEM_ICONS } from "../inventory/Chest";
import { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { Label } from "components/ui/Label";
import {
  LANDSCAPING_MONUMENTS,
  LOVE_CHARM_MONUMENTS,
  Monument,
  MonumentName,
} from "features/game/types/monuments";
import { SUNNYSIDE } from "assets/sunnyside";
import { GameState } from "features/game/types/game";
import { secondsToString } from "lib/utils/time";
import { hasFeatureAccess } from "lib/flags";

interface Props {
  onClose: () => void;
}

const DecorationLabel = ({
  gameState,
  selected,
}: {
  gameState: GameState;
  selected: Monument | Decoration;
}) => {
  const { t } = useAppTranslation();

  const monumentCreatedAt =
    gameState.monuments?.[selected.name as MonumentName]?.createdAt ?? 0;

  const isMonument = selected.name in LANDSCAPING_MONUMENTS;
  const isLoveCharmMonument = selected.name in LOVE_CHARM_MONUMENTS;
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
      0,
    ),
  );

  const hasBuiltLoveCharmMonument = () => {
    return (
      isLoveCharmMonument &&
      !!gameState.monuments?.[selected.name as MonumentName]
    );
  };

  const isCoolingDown = () => {
    return (
      !isLoveCharmMonument &&
      Math.floor(monumentCreatedAt / (1000 * 60 * 60 * 24)) >=
        Math.floor(Date.now() / (1000 * 60 * 60 * 24))
    );
  };

  if (hasBuiltLoveCharmMonument()) {
    return (
      <div className="flex justify-center">
        <Label type="success" icon={SUNNYSIDE.icons.confirm}>
          {t("already.built")}
        </Label>
      </div>
    );
  }

  if (isCoolingDown()) {
    return (
      <div className="flex justify-center">
        <Label type="danger" className="font-secondary">
          {`${t("megastore.limit", {
            time: secondsToString((tomorrow.getTime() - Date.now()) / 1000, {
              length: "short",
            }),
          })}`}
        </Label>
      </div>
    );
  }

  if (isLoveCharmMonument) {
    return (
      <div className="flex justify-center">
        <Label type="default">
          {t("season.megastore.crafting.limit", {
            limit: 0,
          })}
        </Label>
      </div>
    );
  }

  if (isMonument) {
    return (
      <div className="flex justify-center">
        <Label type="default">{t("megastore.limit", { time: "1day" })}</Label>
      </div>
    );
  }

  return null;
};

export const LandscapingDecorations: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const [selected, setSelected] = useState<Decoration | Monument>(
    Object.values(LANDSCAPING_DECORATIONS)[0],
  );

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const inventory = useSelector(
    gameService,
    (state) => state.context.state.inventory,
  );
  const coins = useSelector(gameService, (state) => state.context.state.coins);
  const islandType = useSelector(
    gameService,
    (state) => state.context.state.island.type,
  );
  const season = useSelector(
    gameService,
    (state) => state.context.state.season.season,
  );
  const monumentCreatedAt = useSelector(
    gameService,
    (state) =>
      state.context.state.monuments?.[selected.name as MonumentName]
        ?.createdAt ?? 0,
  );

  const price = selected.coins ?? 0;

  const landscapingMachine = gameService.getSnapshot().children
    .landscaping as MachineInterpreter;

  const buy = () => {
    const isDecoration = selected.name in LANDSCAPING_DECORATIONS;

    const action = isDecoration
      ? "decoration.bought"
      : ("monument.bought" as const);

    const multiple = isDecoration ? true : false;

    landscapingMachine.send("SELECT", {
      action,
      placeable: selected.name,
      requirements: { coins: price, ingredients: selected.ingredients },
      multiple,
    });

    if (selected.ingredients["Gem"]) {
      gameAnalytics.trackSink({
        currency: "Gem",
        amount: selected.ingredients["Gem"].toNumber() ?? 1,
        item: selected.name,
        type: "Collectible",
      });
    }

    onClose();
  };

  const lessFunds = () => {
    if (!price) return false;

    return coins < price;
  };

  const lessIngredients = () =>
    getKeys(selected.ingredients).some((name) =>
      selected.ingredients[name]?.greaterThan(inventory[name] || 0),
    );

  const isLoveCharmMonument = selected.name in LOVE_CHARM_MONUMENTS;

  const hasBuiltLoveCharmMonument = () => {
    return (
      isLoveCharmMonument &&
      !!gameService.state.context.state.monuments?.[
        selected.name as MonumentName
      ]
    );
  };

  const isCoolingDown = () => {
    return (
      !isLoveCharmMonument &&
      Math.floor(monumentCreatedAt / (1000 * 60 * 60 * 24)) >=
        Math.floor(Date.now() / (1000 * 60 * 60 * 24))
    );
  };

  const biome = getCurrentBiome(state.island);

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{ item: selected.name }}
          requirements={{ resources: selected.ingredients, coins: price }}
          actionView={
            <div className="flex flex-col gap-2">
              <div className="flex justify-left sm:justify-center ml-1">
                <DecorationLabel gameState={state} selected={selected} />
              </div>
              <div>
                <Button
                  disabled={
                    lessFunds() ||
                    lessIngredients() ||
                    hasBuiltLoveCharmMonument() ||
                    isCoolingDown()
                  }
                  onClick={buy}
                >
                  {t("buy")}
                </Button>
              </div>
            </div>
          }
        />
      }
      content={
        <>
          <div className="flex flex-col gap-2">
            <div>
              <div>
                <Label type="default">{t("decorations")}</Label>
              </div>
              <div className="flex flex-wrap">
                {getKeys(LANDSCAPING_DECORATIONS).map((name) => (
                  <Box
                    isSelected={selected.name === name}
                    key={name}
                    onClick={() => setSelected(LANDSCAPING_DECORATIONS[name])}
                    image={
                      ITEM_ICONS(state.season.season, biome)[name] ??
                      ITEM_DETAILS[name].image
                    }
                  />
                ))}
              </div>
            </div>
            {hasFeatureAccess(state, "MONUMENTS") && (
              <div>
                <div>
                  <Label type="default">{t("monuments")}</Label>
                </div>
                <div className="flex flex-wrap">
                  {getKeys(LANDSCAPING_MONUMENTS).map((name) => (
                    <Box
                      isSelected={selected.name === name}
                      key={name}
                      onClick={() => setSelected(LANDSCAPING_MONUMENTS[name])}
                      image={
                        ITEM_ICONS(state.season.season, biome)[name] ??
                        ITEM_DETAILS[name].image
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      }
    />
  );
};
