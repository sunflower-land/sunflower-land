import { Button } from "components/ui/Button";
import React, { useContext } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { wallet } from "lib/blockchain/wallet";
import { shortAddress } from "lib/utils/shortAddress";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context as GameContext } from "../GameProvider";

export const Withdrawn: React.FC = () => {
  const { gameService } = useContext(GameContext);
  const { t } = useAppTranslation();

  const handleAddToken = async () => {
    await wallet.addTokenToMetamask();
  };

  const address = wallet.getConnection() as `0x${string}`;

  return (
    <div className="flex flex-col items-center">
      <div className="p-2 flex flex-col items-center">
        <h1 className="text-center mb-4 mt-1 text-lg">{t("success")}</h1>
        <img src={SUNNYSIDE.npcs.synced} className="w-14 mb-4" />
        <p className="mb-4">
          {t("transaction.withdraw.sent")}{" "}
          <span className="text-center mb-2 ml-2 text-sm font-secondary">
            {shortAddress(address)}
          </span>
        </p>

        <span className="mb-4">
          {t("transaction.withdraw.view")}{" "}
          <a
            className="underline hover:text-white"
            href="https://opensea.io/account?search[resultModel]=ASSETS&search[sortBy]=LAST_TRANSFER_DATE&search[query]=sunflower%20land"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("opensea")}
          </a>
        </span>

        <span className="mb-7">{t("transaction.withdraw.four")}</span>
        <Button className="mb-7 sm:w-3/4 text-xs" onClick={handleAddToken}>
          {t("transaction.withdraw.five")}
        </Button>
        <span className="mb-4">
          {t("transaction.displayItems")}{" "}
          <a
            className="underline hover:text-white"
            href={`https://polygonscan.com/address/${address}#tokentxnsErc1155`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("polygonscan")}
          </a>
          {"."}
        </span>
      </div>
      <Button onClick={() => gameService.send({ type: "REFRESH" })}>
        {t("ok")}
      </Button>
    </div>
  );
};
