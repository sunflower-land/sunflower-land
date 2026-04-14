import React, { useCallback, useContext, useMemo, useState } from "react";

import { Modal } from "components/ui/Modal";

import chefHat from "assets/icons/chef_hat.png";

import { Recipes } from "../Recipes";
import {
  Cookable,
  CookableName,
  FIRE_PIT_COOKABLES,
  isFishCookable,
} from "features/game/types/consumables";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel, Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BuildingProduct } from "features/game/types/game";
import { CHAPTERS, getCurrentChapter } from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";
import { Context } from "features/game/GameProvider";
import { getCookingRequirements } from "features/game/events/landExpansion/cook";
import { InventoryItemName } from "features/game/types/game";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `bruce-read.${host}-${window.location.pathname}`;

function acknowledgeRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

function hasRead() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCook: (name: CookableName) => void;
  cooking?: BuildingProduct;
  itemInProgress?: CookableName;
  buildingId: string;
  readyRecipes: BuildingProduct[];
  queue: BuildingProduct[];
}
export const FirePitModal: React.FC<Props> = ({
  isOpen,
  onCook,
  onClose,
  cooking,
  itemInProgress,
  buildingId,
  queue,
  readyRecipes,
}) => {
  const [showIntro, setShowIntro] = React.useState(!hasRead());
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const now = useNow({
    live: true,
    autoEndAt: CHAPTERS["Paw Prints"].endDate.getTime(),
  });

  const getGame = useCallback(() => {
    return gameService.getSnapshot().context.state;
  }, [gameService]);

  const firePitRecipes = useMemo(() => {
    return Object.values(FIRE_PIT_COOKABLES)
      .filter((recipe) => {
        if (getCurrentChapter(now) === "Paw Prints") return true;

        return !isFishCookable(recipe.name);
      })
      .sort(
        (a, b) => a.experience - b.experience, // "Lowest entry" == first in this order
      );
  }, [now]);

  /**
   * Stored selection is intentionally session-only (component state).
   * If no selection exists yet (first open this session), choose the first recipe
   * the player can currently cook; otherwise default to the first entry.
   */
  const getDefaultSelection = useCallback((): Cookable | undefined => {
    const game = getGame();

    const inProgress = firePitRecipes.find(
      (recipe) => recipe.name === itemInProgress,
    );
    if (inProgress) return inProgress;

    const canCook = (recipe: Cookable) => {
      const requirements = getCookingRequirements({
        state: game,
        item: recipe.name,
      });

      return !Object.entries(requirements).some(([name, amount]) =>
        amount.greaterThan(game.inventory[name as InventoryItemName] ?? 0),
      );
    };

    return firePitRecipes.find(canCook) ?? firePitRecipes[0];
  }, [firePitRecipes, getGame, itemInProgress]);

  const [selected, setSelected] = useState<Cookable | undefined>(undefined);

  const setSelectedCookable = useCallback<
    React.Dispatch<React.SetStateAction<Cookable>>
  >(
    (next) => {
      setSelected((prev) => {
        const fallback = getDefaultSelection() ?? firePitRecipes[0];
        const current = prev ?? fallback;

        return typeof next === "function" ? next(current) : next;
      });
    },
    [firePitRecipes, getDefaultSelection],
  );

  const effectiveSelected = useMemo(() => {
    if (!firePitRecipes.length) return undefined;

    const isValidSelection =
      !!selected && firePitRecipes.some((r) => r.name === selected.name);

    if (isValidSelection) return selected;
    if (!isOpen) return selected; // don't "select" while closed

    return getDefaultSelection();
  }, [firePitRecipes, getDefaultSelection, isOpen, selected]);

  return (
    <Modal show={isOpen} onHide={onClose}>
      {showIntro && (
        <Panel bumpkinParts={NPC_WEARABLES.bruce}>
          <SpeakingText
            message={[
              {
                text: t("bruce-intro.three"),
              },
              {
                text: t("bruce-intro.two"),
              },
            ]}
            onClose={() => {
              acknowledgeRead();
              setShowIntro(false);
            }}
          />
        </Panel>
      )}

      {!showIntro && (
        <CloseButtonPanel
          tabs={[{ id: "firePit", icon: chefHat, name: "Fire Pit" }]}
          onClose={onClose}
          bumpkinParts={NPC_WEARABLES.bruce}
          container={OuterPanel}
        >
          {!!effectiveSelected && (
            <Recipes
              selected={effectiveSelected}
              setSelected={setSelectedCookable}
              recipes={firePitRecipes}
              onCook={onCook}
              onClose={onClose}
              cooking={cooking}
              buildingName="Fire Pit"
              buildingId={buildingId}
              queue={queue}
              readyRecipes={readyRecipes}
            />
          )}
        </CloseButtonPanel>
      )}
    </Modal>
  );
};
