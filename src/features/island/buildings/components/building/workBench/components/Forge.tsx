import confetti from "canvas-confetti";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/lib/crafting";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  ADVANCED_RESOURCES,
  UpgradedResourceName,
} from "features/game/types/resources";
import React, { useContext, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { canUpgrade } from "features/game/lib/resourceNodes";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { ITEM_ICONS } from "features/island/hud/components/inventory/Chest";

const UPGRADE_EVENTS: Record<
  UpgradedResourceName,
  "stone.upgraded" | "tree.upgraded"
> = {
  "Fused Stone Rock": "stone.upgraded",
  "Reinforced Stone Rock": "stone.upgraded",
  "Ancient Tree": "tree.upgraded",
  "Sacred Tree": "tree.upgraded",
  "Refined Iron Rock": "stone.upgraded",
  "Tempered Iron Rock": "stone.upgraded",
  "Pure Gold Rock": "stone.upgraded",
  "Prime Gold Rock": "stone.upgraded",
};

export const Forge: React.FC = () => {
  const { gameService, showAnimations } = useContext(Context);
  const { t } = useAppTranslation();
  const [selectedResource, setSelectedResource] =
    useState<UpgradedResourceName>("Fused Stone Rock");
  const [showSuccess, setShowSuccess] = useState(false);

  const state = useSelector(gameService, (state) => state.context.state);
  const selected = ADVANCED_RESOURCES[selectedResource];
  const season = state.season.season;
  const biome = getCurrentBiome(state.island);

  const forge = () => {
    if (!UPGRADE_EVENTS[selectedResource]) {
      throw new Error("Invalid upgrade event");
    }

    gameService.send({
      type: UPGRADE_EVENTS[selectedResource],
      // @ts-expect-error TODO: Remove when all nodes are implemented
      upgradeTo: selectedResource,
      id: uuidv4().slice(0, 8),
    });

    if (showAnimations) confetti();
    setShowSuccess(true);
  };

  const forgingSoon = selected.price === 0;
  const selectedResourceImage =
    ITEM_ICONS(season, biome)[selectedResource] ??
    ITEM_DETAILS[selectedResource].image;

  return (
    <>
      <SplitScreenView
        panel={
          <CraftingRequirements
            gameState={state}
            details={{
              item: selectedResource,
            }}
            requirements={
              forgingSoon
                ? undefined
                : {
                    coins: selected.price,
                    resources: selected.ingredients,
                  }
            }
            hideDescription={true}
            actionView={
              <Button
                onClick={forge}
                disabled={forgingSoon || !canUpgrade(state, selectedResource)}
              >
                {t("forge")}
              </Button>
            }
          />
        }
        content={
          <>
            {getKeys(ADVANCED_RESOURCES).map((resourceName) => {
              return (
                <Box
                  isSelected={selectedResource === resourceName}
                  key={resourceName}
                  onClick={() => setSelectedResource(resourceName)}
                  image={
                    ITEM_ICONS(season, biome)[resourceName] ??
                    ITEM_DETAILS[resourceName]?.image
                  }
                  className={
                    ADVANCED_RESOURCES[resourceName].price === 0
                      ? "opacity-75"
                      : "opacity-100"
                  }
                />
              );
            })}
          </>
        }
      />

      {showSuccess && (
        <Modal show={showSuccess} onHide={() => setShowSuccess(false)}>
          <Panel className="m-auto flex flex-col gap-2">
            <Label type="success">
              {t("upgrade.success", {
                resource: selectedResource,
              })}
            </Label>
            <div className="flex flex-col gap-2 my-2 items-center">
              <img src={selectedResourceImage} width={50} />
              <span>
                {t("upgrade.success.description", {
                  resource: selectedResource,
                })}
              </span>
              <Button onClick={() => setShowSuccess(false)}>
                {t("continue")}
              </Button>
            </div>
          </Panel>
        </Modal>
      )}
    </>
  );
};
