import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { formatWithdrawableDate } from "features/game/lib/withdrawCooldown";
import { ITEM_IDS } from "features/game/types/bumpkin";
import type { InventoryItemName } from "features/game/types/game";
import {
  getTranslatedItemName,
  ITEM_DETAILS,
} from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getImageUrl } from "lib/utils/getImageURLS";

import vipIcon from "assets/icons/vip.webp";

const _blockedWithdrawal = (state: MachineState) =>
  state.context.blockedWithdrawal;

/**
 * The API names items the way game state does. Collectibles and wearables
 * have artwork we can show; buds and pets come through as `Bud #12` /
 * `Pet #3`, which is already how the withdraw screens label them.
 */
const getBlockedItemDisplay = (name: string) => {
  const collectible = (
    ITEM_DETAILS as Partial<Record<string, { image: string }>>
  )[name];
  if (collectible) {
    return {
      name: getTranslatedItemName(name as InventoryItemName),
      image: collectible.image,
    };
  }

  const wearableId = (ITEM_IDS as Partial<Record<string, number>>)[name];
  if (wearableId) {
    return { name, image: getImageUrl(wearableId) };
  }

  return { name, image: undefined };
};

/**
 * Shown when a withdrawal is refused because a non-VIP player bought one of
 * the items on the marketplace in the last 90 days. The API rejects the whole
 * request, so the player either drops the listed items or gets VIP, which
 * lifts the block on the next attempt.
 */
export const MarketplaceWithdrawCooldown: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);

  const blocked = useSelector(gameService, _blockedWithdrawal) ?? {};
  const items = Object.entries(blocked).sort(([, a], [, b]) => a - b);

  const close = () => gameService.send("CONTINUE");

  // Leave the error state first: the VIP purchase is a game event and the
  // machine only handles those while playing.
  const getVip = () => {
    close();
    openModal("VIP_ITEMS");
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col p-2">
        <Label type="danger" icon={vipIcon} className="mb-2 ml-2">
          {t("withdraw.marketplaceCooldown.title")}
        </Label>

        <p className="text-xs mb-2">
          {t("withdraw.marketplaceCooldown.description")}
        </p>

        <div className="flex flex-col gap-1 mb-2 max-h-48 overflow-y-auto scrollable">
          {items.map(([key, until]) => {
            const { name, image } = getBlockedItemDisplay(key);

            return (
              <div key={key} className="flex items-center gap-1">
                {image && <Box image={image} />}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs truncate">{name}</span>
                  <span className="text-xxs">
                    {t("withdraw.marketplaceCooldown.availableOn", {
                      date: formatWithdrawableDate(until),
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs">{t("withdraw.marketplaceCooldown.retryHint")}</p>
      </div>

      <div className="flex space-x-1">
        <Button onClick={close}>{t("continue")}</Button>
        <Button onClick={getVip}>
          <div className="flex items-center justify-center">
            <img src={vipIcon} className="h-4 mr-1" alt="" />
            {t("withdraw.marketplaceCooldown.getVip")}
          </div>
        </Button>
      </div>
    </div>
  );
};
