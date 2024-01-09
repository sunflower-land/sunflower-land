import React, { useContext, useEffect, useState } from "react";
import { MachineInterpreter } from "../mmoMachine";
import { Trade } from "../types/Room";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { getKeys } from "features/game/types/craftables";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import { SUNNYSIDE } from "assets/sunnyside";
import token from "assets/icons/token_2.png";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";

interface Props {
  farmId: number;
  mmoService: MachineInterpreter;
}

export const TradeCompleted: React.FC<Props> = ({ mmoService, farmId }) => {
  const [trade, setTrade] = useState<Trade>();

  useEffect(() => {
    mmoService?.state?.context?.server?.state?.trades?.onAdd((trade) => {
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
    <Modal centered show={!!sold} onHide={() => setTrade(undefined)}>
      <CloseButtonPanel
        onClose={() => setTrade(undefined)}
        title={"Congratulations, your listing was purchased"}
      >
        {sold && (
          <OuterPanel>
            <div className="flex justify-between">
              <div>
                <div className="flex flex-wrap">
                  {getKeys(sold.items).map((name) => (
                    <Box
                      image={ITEM_DETAILS[name].image}
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
                  Claim
                </Button>

                <div className="flex items-center mt-3 mr-0.5">
                  <img src={token} className="h-6 mr-1" />
                  <p className="text-xs">{`${sold.sfl} SFL`}</p>
                </div>
              </div>
            </div>
          </OuterPanel>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
