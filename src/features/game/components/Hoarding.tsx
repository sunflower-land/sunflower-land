import React, { useContext, useState } from "react";

import close from "assets/icons/close.png";
import token from "assets/icons/token_2.png";

import { Context } from "../GameProvider";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "../types/images";
import { InventoryItemName } from "../types/game";
import { CloudFlareCaptcha } from "components/ui/CloudFlareCaptcha";

export const Hoarding: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const maxedItem = gameState.context.maxedItem as InventoryItemName | "SFL";
  const maxedItemImage =
    maxedItem === "SFL" ? token : ITEM_DETAILS[maxedItem].image;
  const itemName = maxedItem === "SFL" ? maxedItem : maxedItem.toLowerCase();

  const onCaptchaSolved = async (captcha: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));

    gameService.send("SYNC", { captcha });
  };

  const sync = () => {
    gameService.send("SYNC", { captcha: "" });
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
      {!showCaptcha ? (
        <>
          <img
            src={close}
            className="h-6 top-4 right-4 absolute cursor-pointer"
            alt="Close Hoarding Modal"
            onClick={onAcknowledge}
          />
          <div className="flex flex-col items-center p-1">
            <span className="text-center text-sm sm:text-base">
              {makeTitle()}
            </span>
            <img src={maxedItemImage} className="h-12 mt-2 mb-3" />
            <p className="text-xs sm:text-sm mb-3">
              {`Word is that Goblins are known to raid farms that have an abundance of resources.`}
            </p>
            <p className="text-xs sm:text-sm mb-1">
              {`To protect yourself and keep those precious resources safe, please sync them on chain before gathering any more ${itemName}.`}
            </p>
            <div className="text-xs underline my-2 w-full">
              <a
                href="https://docs.sunflower-land.com/fundamentals/syncing-on-chain"
                target="_blank"
                rel="noreferrer"
              >
                Read more
              </a>
            </div>
          </div>
          <Button onClick={sync}>Sync</Button>
        </>
      ) : (
        <div>
          <img
            src={close}
            className="h-6 top-3 right-4 absolute cursor-pointer"
            alt="Close Captcha Modal"
            onClick={() => setShowCaptcha(false)}
          />
          <CloudFlareCaptcha
            action="hoarding-sync"
            onDone={onCaptchaSolved}
            onExpire={() => setShowCaptcha(false)}
            onError={() => setShowCaptcha(false)}
          />
        </div>
      )}
    </>
  );
};
