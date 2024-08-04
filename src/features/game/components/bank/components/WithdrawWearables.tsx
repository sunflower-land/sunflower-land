import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
import Decimal from "decimal.js-light";

import { GameState, Wardrobe } from "features/game/types/game";
import { shortAddress } from "lib/utils/shortAddress";

import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";

import { wallet } from "lib/blockchain/wallet";

import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { BUMPKIN_WITHDRAWABLES } from "features/game/types/withdrawables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { getImageUrl } from "lib/utils/getImageURLS";

export const isCurrentObsession = (itemName: BumpkinItem, game: GameState) => {
  const obsessionCompletedAt = game.npcs?.bert?.questCompletedAt;
  const currentObsession = game.bertObsession;

  if (!obsessionCompletedAt || !currentObsession) return false;
  if (currentObsession.name !== itemName) return false;

  return (
    obsessionCompletedAt >= currentObsession.startDate &&
    obsessionCompletedAt <= currentObsession.endDate
  );
};

interface Props {
  onWithdraw: (ids: number[], amounts: number[]) => void;
}

export const WithdrawWearables: React.FC<Props> = ({ onWithdraw }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t } = useAppTranslation();
  const [wardrobe, setWardrobe] = useState<Wardrobe>({});
  const [selected, setSelected] = useState<Wardrobe>({});

  useEffect(() => {
    let available = availableWardrobe(gameState.context.state);

    available = getKeys(available).reduce((acc, key) => {
      const currentAmount = available[key] ?? 0;
      const onChainAMount = gameState.context.state.previousWardrobe[key] ?? 0;

      return {
        ...acc,
        [key]: Math.min(currentAmount, onChainAMount),
      };
    }, {} as Wardrobe);

    setWardrobe(available);
  }, [gameState.context.state]);

  const withdraw = () => {
    const ids = getKeys(selected).map((item) => ITEM_IDS[item]);
    const amounts = getKeys(selected).map((item) => selected[item]) as number[];

    onWithdraw(ids, amounts);
  };

  const onAdd = (itemName: BumpkinItem) => {
    setWardrobe((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) - 1,
    }));

    setSelected((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) + 1,
    }));
  };

  const onRemove = (itemName: BumpkinItem) => {
    setWardrobe((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) + 1,
    }));

    setSelected((prev) => {
      const newSelected = { ...prev };
      if (newSelected[itemName] === 1) {
        delete newSelected[itemName];
      } else {
        newSelected[itemName] = (newSelected[itemName] ?? 0) - 1;
      }
      return newSelected;
    });
  };

  const withdrawableItems = [...new Set([...getKeys(wardrobe)])]
    .filter(
      (item) =>
        wardrobe[item] && !isCurrentObsession(item, gameState.context.state),
    )
    .sort((a, b) => ITEM_IDS[a] - ITEM_IDS[b]);

  const selectedItems = getKeys(selected)
    .filter((item) => !!selected[item])
    .sort((a, b) => ITEM_IDS[a] - ITEM_IDS[b]);

  return (
    <>
      <div className="p-2 mt-3">
        <div className="flex items-center border-2 rounded-md border-black p-2 bg-green-background mb-3">
          <span className="text-xs">{t("withdraw.restricted")}</span>
        </div>
        <h2 className="mb-3">{t("withdraw.select.item")}</h2>
        <div className="flex flex-wrap h-fit -ml-1.5">
          {withdrawableItems.map((itemName) => {
            const wardrobeCount = wardrobe[itemName];

            return (
              <Box
                count={new Decimal(wardrobeCount ?? 0)}
                key={itemName}
                onClick={() => onAdd(itemName)}
                disabled={
                  !BUMPKIN_WITHDRAWABLES[itemName](gameState.context.state) ||
                  selected[itemName] !== undefined
                }
                image={getImageUrl(ITEM_IDS[itemName])}
              />
            );
          })}
          {/* Pad with empty boxes */}
          {withdrawableItems.length < 4 &&
            new Array(4 - withdrawableItems.length)
              .fill(null)
              .map((_, index) => <Box disabled key={index} />)}
        </div>

        <div className="mt-2">
          <h2 className="">{t("selected")}</h2>
          <div className="flex flex-wrap h-fit mt-2 -ml-1.5">
            {selectedItems.map((itemName) => {
              return (
                <Box
                  count={new Decimal(selected[itemName] ?? 0)}
                  key={itemName}
                  onClick={() => onRemove(itemName)}
                  image={getImageUrl(ITEM_IDS[itemName])}
                />
              );
            })}
            {/* Pad with empty boxes */}
            {selectedItems.length < 4 &&
              new Array(4 - selectedItems.length)
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
          {t("withdraw.opensea")}
          {"."}{" "}
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
        onClick={withdraw}
        disabled={selectedItems.length <= 0}
      >
        {t("withdraw")}
      </Button>
    </>
  );
};
