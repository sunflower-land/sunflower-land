import React, { useContext } from "react";

import token from "assets/icons/sfl.webp";

import { Context } from "../GameProvider";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "../types/images";
import { InventoryItemName } from "../types/game";
import { PIXEL_SCALE } from "../lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { ModalContext } from "./modal/ModalProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Hoarding: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { openModal } = useContext(ModalContext);

  const maxedItem = gameState.context.maxedItem as InventoryItemName | "SFL";
  const maxedItemImage =
    maxedItem === "SFL" ? token : ITEM_DETAILS[maxedItem].image;
  const itemName = maxedItem === "SFL" ? maxedItem : maxedItem.toLowerCase();

  const sync = () => {
    gameService.send("ACKNOWLEDGE");

    openModal("STORE_ON_CHAIN");
  };

  const onAcknowledge = () => {
    gameService.send("ACKNOWLEDGE");
  };

  const makeTitle = () => {
    const regex = new RegExp(/^[aeiou]/gi);
    const startsWithVowel = regex.test(maxedItem);
    const indefiniteArticle = startsWithVowel ? "an" : "a";

    return `Are you ${indefiniteArticle} ${itemName} hoarder?!`;
  };

  return (
    <>
      <img
        src={SUNNYSIDE.icons.close}
        className="absolute cursor-pointer z-20"
        alt="Close Hoarding Modal"
        onClick={onAcknowledge}
        style={{
          top: `${PIXEL_SCALE * 6}px`,
          right: `${PIXEL_SCALE * 6}px`,
          width: `${PIXEL_SCALE * 11}px`,
        }}
      />
      <div className="flex flex-col items-center p-1">
        <span className="text-center text-sm sm:text-base">{makeTitle()}</span>
        <img src={maxedItemImage} className="h-12 mt-2 mb-3" />
        <p className="text-xs sm:text-sm mb-3">{t("warning.hoarding.one")}</p>
        <p className="text-xs sm:text-sm mb-1">
          {t("warning.hoarding.two")} {itemName}
        </p>
        <div className="text-xs underline my-2 w-full">
          <a
            href="https://docs.sunflower-land.com/fundamentals/syncing-on-chain"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("read.more")}
          </a>
        </div>
      </div>
      <Button onClick={sync}>{t("transaction.storeProgress.chain")}</Button>
    </>
  );
};
