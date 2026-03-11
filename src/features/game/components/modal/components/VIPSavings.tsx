import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ITEM_DETAILS } from "features/game/types/images";
import { getChapterTicket } from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";
import vipIcon from "assets/icons/vip.webp";
import giftIcon from "assets/icons/gift.png";
import xpIcon from "assets/icons/xp.png";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import { Button } from "components/ui/Button";
import { ModalContext } from "../ModalProvider";

const _farmActivity = (state: MachineState) => state.context.state.farmActivity;

const VIP_SAVINGS_ROWS: {
  activityKey:
    | "VIP Coins Saved"
    | "VIP FLOWER Saved"
    | "VIP Ticket Earned"
    | "VIP Gift Claimed"
    | "Recipe Queued"
    | "VIP XP Earned";
  translationKey: TranslationKeys;
  icon: string;
}[] = [
  {
    activityKey: "VIP Coins Saved",
    translationKey: "vip.savings.coinsSaved",
    icon: SUNNYSIDE.ui.coins,
  },
  {
    activityKey: "VIP FLOWER Saved",
    translationKey: "vip.savings.flowerSaved",
    icon: ITEM_DETAILS["Flower Coin"].image,
  },
  {
    activityKey: "VIP Ticket Earned",
    translationKey: "vip.savings.ticketEarned",
    icon: ITEM_DETAILS["Mark"].image,
  },
  {
    activityKey: "VIP Gift Claimed",
    translationKey: "vip.savings.giftClaimed",
    icon: giftIcon,
  },
  {
    activityKey: "Recipe Queued",
    translationKey: "vip.savings.recipeQueued",
    icon: ITEM_DETAILS["Crafting Box"].image,
  },
  {
    activityKey: "VIP XP Earned",
    translationKey: "vip.savings.xpEarned",
    icon: xpIcon,
  },
];

export const VIPSavings: React.FC<{ showBuyButton?: boolean }> = ({
  showBuyButton,
}) => {
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const farmActivity = useSelector(gameService, _farmActivity);
  const { t } = useAppTranslation();
  const now = useNow();
  const chapterTicket = getChapterTicket(now);

  // Update ticket row icon to current chapter ticket
  const rows = VIP_SAVINGS_ROWS.map((row) =>
    row.activityKey === "VIP Ticket Earned"
      ? { ...row, icon: ITEM_DETAILS[chapterTicket].image }
      : row,
  );

  return (
    <div className="flex flex-col space-y-2">
      <div className="p-1">
        <Label type="default" icon={vipIcon} className="mb-2">
          {t("vip.savings.title")}
        </Label>
        <p className="text-xs mb-2">{t("vip.savings.description")}</p>
        {rows.map(({ activityKey, translationKey, icon }) => (
          <div
            key={activityKey}
            className="flex items-center justify-between px-1 py-1.5"
          >
            <div className="flex items-center gap-2">
              <img src={icon} className="h-5 w-5 object-contain" alt="" />
              <span className="text-sm">{t(translationKey)}</span>
            </div>
            <span className="text-sm tabular-nums">
              {Math.floor(farmActivity?.[activityKey] ?? 0).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      {showBuyButton && (
        <Button onClick={() => openModal("BUY_BANNER")}>
          {t("vip.savings.buyBanner")}
        </Button>
      )}
    </div>
  );
};
