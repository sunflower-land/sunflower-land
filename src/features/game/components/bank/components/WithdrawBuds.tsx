import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";

import { shortAddress } from "lib/utils/shortAddress";

import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";

import { wallet } from "lib/blockchain/wallet";

import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";

import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";

const imageDomain = CONFIG.NETWORK === "mainnet" ? "buds" : "testnet-buds";

interface Props {
  onWithdraw: (ids: number[]) => void;
}

export const WithdrawBuds: React.FC<Props> = ({ onWithdraw }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  const buds = gameState.context.state.buds ?? {};

  const [unselected, setUnselected] = useState<number[]>(
    getKeys(buds).filter((budId) => !buds[budId].coordinates),
  );
  const [selected, setSelected] = useState<number[]>([]);

  const onAdd = (budId: number) => {
    setUnselected((prev) => prev.filter((bud) => bud !== budId));
    setSelected((prev) => [...prev, budId]);
  };

  const onRemove = (budId: number) => {
    setUnselected((prev) => [...prev, budId]);
    setSelected((prev) => prev.filter((bud) => bud !== budId));
  };

  return (
    <>
      <div className="p-2 mt-3">
        <h2 className="mb-3">{t("withdraw.buds")}</h2>
        <div className="flex flex-wrap h-fit -ml-1.5">
          {unselected.map((budId) => (
            <Box
              key={`bud-${budId}`}
              onClick={() => onAdd(budId)}
              image={`https://${imageDomain}.sunflower-land.com/images/${budId}.webp`}
              iconClassName="scale-[1.8] origin-bottom absolute"
            />
          ))}
          {/* Pad with empty boxes */}
          {unselected.length < 4 &&
            new Array(4 - unselected.length)
              .fill(null)
              .map((_, index) => <Box disabled key={index} />)}
        </div>

        <div className="mt-2">
          <h2 className="">{t("selected")}</h2>
          <div className="flex flex-wrap h-fit mt-2 -ml-1.5">
            {selected.map((budId) => (
              <Box
                key={`bud-${budId}`}
                onClick={() => onRemove(budId)}
                image={`https://${imageDomain}.sunflower-land.com/images/${budId}.webp`}
                iconClassName="scale-[1.8] origin-bottom absolute"
              />
            ))}
            {/* Pad with empty boxes */}
            {selected.length < 4 &&
              new Array(4 - selected.length)
                .fill(null)
                .map((_, index) => <Box disabled key={index} />)}
          </div>
        </div>

        <div className="border-white border-t-2 w-full my-3" />
        <div className="flex items-center mt-2 mb-2  border-white">
          <img src={SUNNYSIDE.icons.player} className="h-8 mr-2" />
          <div>
            <p className="text-sm">{t("withdraw.send.wallet")}</p>
            <p className="text-sm font-secondary">
              {shortAddress(wallet.myAccount || "XXXX")}
            </p>
          </div>
        </div>

        <span className="text-sm mb-4">
          {t("withdraw.opensea")}{" "}
          <a
            className="underline hover:text-blue-500"
            href="https://docs.sunflower-land.com/fundamentals/withdrawing"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("read.more")}
          </a>
          {"."}
        </span>
      </div>

      <Button
        className="mt-3"
        onClick={() => onWithdraw(selected)}
        disabled={selected.length <= 0}
      >
        {t("withdraw")}
      </Button>
    </>
  );
};
