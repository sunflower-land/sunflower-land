import React, { useContext, useState } from "react";

import { Modal } from "components/ui/Modal";

import chefHat from "assets/icons/chef_hat.png";

import { Recipes } from "../Recipes";
import {
  Cookable,
  CookableName,
  FIRE_PIT_COOKABLES,
  isFishCookable,
  isInstantFishRecipe,
} from "features/game/types/consumables";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel, Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BuildingProduct } from "features/game/types/game";
import { CHAPTERS, getCurrentChapter } from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";
import { hasFeatureAccess } from "lib/flags";
import { Context } from "features/game/GameProvider";

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
  const firePitRecipes = Object.values(FIRE_PIT_COOKABLES)
    .filter((recipe) => {
      if (getCurrentChapter(now) === "Paw Prints") return true;

      return !isFishCookable(recipe.name);
    })
    .filter((recipe) => {
      if (isInstantFishRecipe(recipe.name)) {
        return hasFeatureAccess(
          gameService?.getSnapshot().context.state ?? {},
          "INSTANT_RECIPES",
        );
      }
      return true;
    })
    .sort(
      (a, b) => a.experience - b.experience, // Sorts Foods based on their cooking time
    );

  const [selected, setSelected] = useState<Cookable>(
    firePitRecipes.find((recipe) => recipe.name === itemInProgress) ||
      firePitRecipes[0],
  );

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
          <Recipes
            selected={selected}
            setSelected={setSelected}
            recipes={firePitRecipes}
            onCook={onCook}
            onClose={onClose}
            cooking={cooking}
            buildingName="Fire Pit"
            buildingId={buildingId}
            queue={queue}
            readyRecipes={readyRecipes}
          />
        </CloseButtonPanel>
      )}
    </Modal>
  );
};
