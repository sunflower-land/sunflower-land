import React, { useContext, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import close from "assets/icons/close.png";
import token from "assets/icons/token.gif";

import { Context } from "../GameProvider";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { CONFIG } from "lib/config";
import { ITEM_DETAILS } from "../types/images";
import { InventoryItemName } from "../types/game";

export const MaxItems: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const maxedItem = gameState.context.maxedItem as InventoryItemName | "SFL";

  const onCaptchaSolved = async (captcha: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));

    gameService.send("SYNC", { captcha });
  };

  const makeTitle = () => {
    const regex = new RegExp(/^[aeiou]/gi);
    const startsWithVowel = regex.test(maxedItem);
    const indefiniteArticle = startsWithVowel ? "an" : "a";
    const item = maxedItem === "SFL" ? maxedItem : maxedItem.toLowerCase();

    return `Have you become ${indefiniteArticle} ${item} horder?!`;
  };

  const maxedItemImage =
    maxedItem === "SFL" ? token : ITEM_DETAILS[maxedItem].image;

  return (
    <>
      {!showCaptcha ? (
        <div>
          <div className="flex flex-col items-center p-1">
            <span className="text-center text-sm sm:text-base">
              {makeTitle()}
            </span>
            <img src={maxedItemImage} className="h-12 mt-2 mb-3" />
            <p className="text-xs sm:text-sm mb-3">
              {`I don't want to alarm you but we just heard that the Goblins have
              noticed that you are hording a lot of this resource off chain.`}
            </p>
            <p className="text-xs sm:text-sm mb-1">
              {`Word is that they're planning a raid as we speak so we recommend
              you secure your progress on chain before continuing.`}
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
          <Button onClick={() => setShowCaptcha(true)}>Sync</Button>
        </div>
      ) : (
        <div>
          <img
            src={close}
            className="h-6 top-3 right-4 absolute cursor-pointer"
            alt="Close Logout Confirmation Modal"
            onClick={() => setShowCaptcha(false)}
          />
          <ReCAPTCHA
            sitekey={CONFIG.RECAPTCHA_SITEKEY}
            onChange={onCaptchaSolved}
            onExpired={() => setShowCaptcha(false)}
            className="w-full m-4 flex items-center justify-center"
          />
        </div>
      )}
    </>
  );
};
