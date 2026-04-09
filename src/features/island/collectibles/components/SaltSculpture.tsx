import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  SALT_SCULPTURE_MAX_LEVEL,
  SALT_SCULPTURE_UPGRADES,
} from "features/game/types/saltSculpture";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InventoryItemName } from "features/game/types/game";
import { getKeys, getObjectEntries } from "lib/object";

const _state = (state: MachineState) => state.context.state;

export const SaltSculpture: React.FC = () => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { t } = useAppTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);

  const currentLevel = state.sculptures?.["Salt Sculpture"]?.level ?? 1;
  const isMaxLevel = currentLevel >= SALT_SCULPTURE_MAX_LEVEL;
  const nextLevel = currentLevel + 1;
  const upgrade = !isMaxLevel ? SALT_SCULPTURE_UPGRADES[nextLevel] : undefined;

  const canUpgrade = (() => {
    if (!upgrade) return false;
    if (state.coins < upgrade.coins) return false;
    for (const [item, amount] of Object.entries(upgrade.ingredients)) {
      const have = state.inventory[item as InventoryItemName] ?? new Decimal(0);
      if (have.lt(amount as Decimal)) return false;
    }
    return true;
  })();

  const handleUpgrade = () => {
    gameService.send("saltSculpture.upgraded");
    setShowModal(false);
  };

  return (
    <>
      <div
        className="absolute w-full h-full hover:img-highlight cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 24}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 4}px`,
          }}
        >
          <img
            src={ITEM_DETAILS.Salt.image}
            style={{ width: `${PIXEL_SCALE * 24}px` }}
            alt="Salt Sculpture"
          />
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel onClose={() => setShowModal(false)}>
          <div className="flex flex-col gap-2 p-1">
            <div className="flex items-center gap-2">
              <Label type="default" icon={ITEM_DETAILS["Salt Sculpture"].image}>
                {t("saltSculpture.level", { level: currentLevel })}
              </Label>
            </div>

            <InnerPanel>
              <Label type="success" className="mb-1">
                {t("saltSculpture.activeBuffs")}
              </Label>
              <div className="flex flex-col gap-1">
                {Array.from({ length: currentLevel }, (_, i) => i + 1).map(
                  (lvl) => (
                    <div key={lvl} className="flex items-center gap-1">
                      <img
                        src={SUNNYSIDE.icons.confirm}
                        className="h-3"
                        alt=""
                      />
                      <span className="text-xs">
                        {`Lv${lvl}: ${t(`saltSculpture.buff.${lvl}` as "saltSculpture.buff.1")}`}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </InnerPanel>

            {!isMaxLevel && upgrade && (
              <InnerPanel>
                <Label
                  type="info"
                  className="mb-1"
                  icon={SUNNYSIDE.icons.arrow_up}
                >
                  {t("saltSculpture.nextLevel", { level: nextLevel })}
                </Label>
                <p className="text-xs mb-2">
                  {t(
                    `saltSculpture.buff.${nextLevel}` as "saltSculpture.buff.1",
                  )}
                </p>
                <div
                  className="flex flex-wrap gap-2 cursor-pointer relative"
                  onClick={() => setShowIngredients(!showIngredients)}
                >
                  <IngredientsPopover
                    show={showIngredients}
                    ingredients={getKeys(upgrade.ingredients)}
                    onClick={() => setShowIngredients(false)}
                  />
                  {upgrade.coins > 0 && (
                    <RequirementLabel
                      type="coins"
                      balance={state.coins}
                      requirement={upgrade.coins}
                    />
                  )}
                  {getObjectEntries(upgrade.ingredients).map(
                    ([item, amount]) => (
                      <RequirementLabel
                        key={String(item)}
                        type="item"
                        item={item as InventoryItemName}
                        balance={
                          state.inventory[item as InventoryItemName] ??
                          new Decimal(0)
                        }
                        requirement={amount ?? new Decimal(0)}
                      />
                    ),
                  )}
                </div>
              </InnerPanel>
            )}

            {isMaxLevel && (
              <Label type="success">{t("saltSculpture.maxLevel")}</Label>
            )}
          </div>

          {!isMaxLevel && (
            <Button disabled={!canUpgrade} onClick={handleUpgrade}>
              {t("saltSculpture.upgrade", { level: nextLevel })}
            </Button>
          )}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
