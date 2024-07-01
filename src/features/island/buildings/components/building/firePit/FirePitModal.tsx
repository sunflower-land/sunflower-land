import React, { useState } from "react";

import { Modal } from "components/ui/Modal";

import chefHat from "assets/icons/chef_hat.png";

import { Recipes } from "../../ui/Recipes";
import {
  Cookable,
  CookableName,
  FIRE_PIT_COOKABLES,
} from "features/game/types/consumables";
import { MachineInterpreter } from "features/island/buildings/lib/craftingMachine";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel, Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
  crafting: boolean;
  itemInProgress?: CookableName;
  craftingService?: MachineInterpreter;
  buildingId: string;
}
export const FirePitModal: React.FC<Props> = ({
  isOpen,
  onCook,
  onClose,
  crafting,
  itemInProgress,
  craftingService,
  buildingId,
}) => {
  const [showIntro, setShowIntro] = React.useState(!hasRead());
  const { t } = useAppTranslation();
  const firePitRecipes = Object.values(FIRE_PIT_COOKABLES).sort(
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
          tabs={[{ icon: chefHat, name: "Fire Pit" }]}
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
            crafting={!!crafting}
            craftingService={craftingService}
            buildingName="Fire Pit"
            buildingId={buildingId}
            currentlyCooking={selected.name}
          />
        </CloseButtonPanel>
      )}
    </Modal>
  );
};
