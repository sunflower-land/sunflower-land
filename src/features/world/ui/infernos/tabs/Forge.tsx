import confetti from "canvas-confetti";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { ConfirmButton } from "components/ui/ConfirmButton";
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
import { UpgradeTreeAction } from "features/game/events/landExpansion/upgradeTree";
import { UpgradeRockAction } from "features/game/events/landExpansion/upgradeRock";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";

export const Forge: React.FC = () => {
  const { gameService, showAnimations } = useContext(Context);
  const { t } = useAppTranslation();
  const [selectedResource, setSelectedResource] =
    useState<UpgradedResourceName>("Ancient Tree");
  const [showSuccess, setShowSuccess] = useState(false);

  const state = useSelector(gameService, (state) => state.context.state);
  const skills = useSelector(
    gameService,
    (state) => state.context.state.bumpkin.skills,
  );
  const selected = ADVANCED_RESOURCES[selectedResource];
  const season = state.season.season;
  const biome = getCurrentBiome(state.island);

  const forge = () => {
    if (selectedResource.includes("Tree")) {
      gameService.send({
        type: "tree.upgraded",
        upgradeTo: selectedResource as UpgradeTreeAction["upgradeTo"],
        id: uuidv4().slice(0, 8),
      });
    } else {
      gameService.send({
        type: "rock.upgraded",
        upgradeTo: selectedResource as UpgradeRockAction["upgradeTo"],
        id: uuidv4().slice(0, 8),
      });
    }

    if (showAnimations) confetti();
    setShowSuccess(true);
  };

  const forgingSoon = selected.price === 0;
  const selectedResourceImage =
    ITEM_ICONS(season, biome)[selectedResource] ??
    ITEM_DETAILS[selectedResource].image;

  const lessIngredients = () =>
    getKeys(selected.ingredients()).some((name) =>
      selected
        .ingredients()
        [name]?.mul(1)
        .greaterThan(state.inventory[name] || 0),
    );

  const lessFunds = () => state.coins < selected.price;

  return (
    <>
      <SplitScreenView
        panel={
          <CraftingRequirements
            gameState={state}
            details={{
              item: selectedResource,
            }}
            boost={COLLECTIBLE_BUFF_LABELS[selectedResource]?.({
              skills: state.bumpkin.skills,
              collectibles: state.collectibles,
            })}
            requirements={
              forgingSoon
                ? undefined
                : {
                    coins: selected.price,
                    resources: selected.ingredients(skills),
                  }
            }
            hideDescription={true}
            actionView={
              <ConfirmButton
                onConfirm={forge}
                confirmLabel={t("forge")}
                disabled={
                  forgingSoon ||
                  !canUpgrade(state, selectedResource) ||
                  lessIngredients() ||
                  lessFunds()
                }
                divClassName="flex-row sm:flex-col"
              >
                {t("forge")}
              </ConfirmButton>
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
                  action: selectedResource.includes("Tree") ? "chop" : "mine",
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
