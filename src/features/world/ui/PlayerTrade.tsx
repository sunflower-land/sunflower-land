import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import { loadGameStateForVisit } from "features/game/actions/loadGameStateForVisit";
import { getKeys } from "features/game/types/craftables";
import { TradeListing } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useEffect, useState } from "react";
import token from "assets/icons/token_2.png";
import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";

interface Props {
  farmId: number;
}
export const PlayerTrade: React.FC<Props> = ({ farmId }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [isLoading, setIsLoading] = useState(true);
  const [listing, setListing] = useState<{ id: string; trade: TradeListing }>();

  useEffect(() => {
    const load = async () => {
      const farm = await loadGameStateForVisit(farmId);

      const trades = farm.state.trades?.listings;
      if (trades) {
        const firstTrade = getKeys(trades)[0];

        const trade = trades[firstTrade];

        if (!trade.boughtAt) {
          setListing({ id: firstTrade, trade });
        }
      }

      setIsLoading(false);
    };

    load();
  }, []);

  if (isLoading) {
    return <p className="loading">Loading</p>;
  }

  if (gameState.matches("trading")) {
    return <p className="loading">Trading</p>;
  }

  if (!listing) return <div>No trades available</div>;

  const trade = listing.trade;
  return (
    <div>
      <div className="flex flex-wrap">
        {getKeys(trade.items).map((name) => (
          <Box
            image={ITEM_DETAILS[name].image}
            count={new Decimal(trade.items[name] ?? 0)}
            disabled
          />
        ))}
        <Box
          image={ITEM_DETAILS["Block Buck"].image}
          count={new Decimal(1)}
          disabled
        />
        <div className="flex items-center">
          <img src={token} className="h-8 mr-2" />
          <p>{`${trade.sfl} SFL`}</p>
        </div>
      </div>
      <Button
        onClick={() =>
          gameService.send("TRADE", { sellerId: farmId, tradeId: listing.id })
        }
      >
        Trade
      </Button>
    </div>
  );
};
