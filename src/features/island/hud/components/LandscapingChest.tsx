import React, { useState } from "react";
import { GameState } from "features/game/types/game";
import chest from "assets/icons/chest.png";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";
import { Chest } from "./inventory/Chest";
import { getKeys } from "features/game/types/craftables";
import { NPC_WEARABLES } from "lib/npcs";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { Biomes } from "./inventory/Biomes";
import { LAND_BIOMES } from "features/island/biomes/biomes";
import Decimal from "decimal.js-light";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  LandscapingPlaceable,
  LandscapingPlaceableType,
} from "features/game/expansion/placeable/landscapingMachine";
import { NFTName } from "features/game/events/landExpansion/placeNFT";

interface Props {
  show: boolean;
  onHide: () => void;
  state: GameState;
  onPlace: (item: LandscapingPlaceable) => void;
  onPlaceNFT: (id: string, nft: NFTName) => void;
}

export const LandscapingChest: React.FC<Props> = ({
  show,
  onHide,
  state,
  onPlace,
  onPlaceNFT,
}) => {
  const { t } = useAppTranslation();

  const [selected, setSelected] = useState<LandscapingPlaceableType>();
  const [currentTab, setCurrentTab] = useState<"Chest" | "Biomes">("Chest");
  const hasBiomes = getKeys(LAND_BIOMES).some((item) =>
    (state.inventory[item] ?? new Decimal(0)).gt(0),
  );
  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[
          { icon: chest, name: t("chest"), id: "Chest" },
          ...(hasBiomes
            ? [
                {
                  icon: ITEM_DETAILS["Basic Biome"].image,
                  name: t("biomes"),
                  id: "Biomes",
                },
              ]
            : []),
        ]}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onClose={onHide}
        bumpkinParts={NPC_WEARABLES.grimtooth}
        container={OuterPanel}
      >
        {currentTab === "Chest" && (
          <Chest
            state={state}
            selected={selected}
            onSelect={setSelected}
            closeModal={onHide}
            onPlace={onPlace}
            onPlaceNFT={onPlaceNFT}
          />
        )}
        {currentTab === "Biomes" && <Biomes state={state} />}
      </CloseButtonPanel>
    </Modal>
  );
};
