import React, { useContext, useEffect, useState } from "react";
import { MachineInterpreter } from "../mmoMachine";
import { Trade } from "../types/Room";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { getKeys } from "features/game/types/craftables";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import { SUNNYSIDE } from "assets/sunnyside";
import token from "assets/icons/sfl.webp";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber } from "lib/utils/formatNumber";
import { InventoryItemName } from "features/game/types/game";

interface Props {
  farmId: number;
  mmoService: MachineInterpreter;
}

export const TradeCompleted: React.FC<Props> = ({ mmoService, farmId }) => {
  const [trade, setTrade] = useState<Trade>();
  const { t } = useAppTranslation();

  useEffect(() => {
    mmoService?.state?.context?.server?.onMessage("trade:bought", (trade) => {
      if (trade.buyerId && Number(trade.sellerId) === farmId) {
        setTrade(trade);
      }
    });
  }, []);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const sold = trade
    ? gameState.context.state.trades.listings?.[trade?.tradeId]
    : undefined;

  return (
    <Modal show={!!sold} onHide={() => setTrade(undefined)}>
      <CloseButtonPanel
        onClose={() => setTrade(undefined)}
        title={t("playerTrade.title.congrat")}
      >
        {sold && (
          <OuterPanel>
            <div className="flex justify-between">
              <div>
                <div className="flex flex-wrap">
                  {getKeys(sold.items).map((name) => (
                    <Box
                      image={ITEM_DETAILS[name as InventoryItemName].image}
                      count={new Decimal(sold.items[name] ?? 0)}
                      disabled
                      key={name}
                    />
                  ))}
                </div>
                <div className="flex items-center ml-1 mb-1">
                  <img src={SUNNYSIDE.icons.player} className="h-5 mr-1" />
                  <p className="text-xs">{`Bought by #${trade?.buyerId}`}</p>
                </div>
              </div>
              <div className="flex flex-col justify-between h-full">
                <Button
                  className="mb-1"
                  onClick={() => {
                    gameService.send("trade.received", {
                      tradeId: trade?.tradeId,
                    });
                    gameService.send("SAVE");

                    setTrade(undefined);
                  }}
                >
                  {t("claim")}
                </Button>

                <div className="flex items-center mt-3 mr-0.5">
                  <img src={token} className="h-6 mr-1" />
                  <p className="text-xs">
                    {formatNumber(new Decimal(sold.sfl).mul(0.9), {
                      decimalPlaces: 4,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </OuterPanel>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
