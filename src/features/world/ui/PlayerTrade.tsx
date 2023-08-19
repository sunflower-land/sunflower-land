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
import { OuterPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import * as AuthProvider from "features/auth/lib/Provider";

interface Props {
  farmId: number;
  onClose: () => void;
}
export const PlayerTrade: React.FC<Props> = ({ farmId, onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [isLoading, setIsLoading] = useState(true);
  const [listing, setListing] = useState<{ id: string; trade: TradeListing }>();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const farm = await loadGameStateForVisit(
        farmId,
        authState.context.user.rawToken
      );

      const trades = farm.state.trades?.listings;
      if (trades && getKeys(trades).length > 0) {
        const firstTrade = getKeys(trades)[0];

        const trade = trades[firstTrade];

        setListing({ id: firstTrade, trade });
      }

      setIsLoading(false);
    };

    load();
  }, []);

  if (isLoading) {
    return <p className="loading">Loading</p>;
  }

  if (!listing)
    return (
      <div className="p-2">
        <img src={SUNNYSIDE.icons.sad} className="mx-auto w-1/5 my-2" />
        <p className="text-sm mb-2 text-center">No trades available.</p>
      </div>
    );

  const trade = listing.trade;

  const Action = () => {
    if (trade.boughtAt) {
      return (
        <div className="flex items-center">
          <img src={SUNNYSIDE.icons.neutral} className="h-4 mr-1"></img>

          <span className="text-xs">Already sold</span>
        </div>
      );
    }

    if (showConfirm) {
      return (
        <Button
          onClick={() => {
            gameService.send("TRADE", {
              sellerId: farmId,
              tradeId: listing.id,
            });
            onClose();
          }}
        >
          <div className="flex items-center">
            <img src={SUNNYSIDE.icons.confirm} className="h-4 mr-1" />
            <span className="text-xs">Confirm</span>
          </div>
        </Button>
      );
    }

    return (
      <Button
        onClick={() => {
          setShowConfirm(true);
        }}
      >
        Buy
      </Button>
    );
  };
  return (
    <div>
      <p className="text-xs mb-1">For sale:</p>
      <OuterPanel>
        <div className="flex justify-between">
          <div className="flex flex-wrap">
            {getKeys(trade.items).map((name) => (
              <Box
                image={ITEM_DETAILS[name].image}
                count={new Decimal(trade.items[name] ?? 0)}
                disabled
                key={name}
              />
            ))}
          </div>
          <div className="">
            {Action()}

            <div className="flex items-center mt-1  justify-end mr-0.5">
              <img src={token} className="h-6 mr-2" />
              <p className="text-xs">{`${trade.sfl} SFL`}</p>
            </div>
          </div>
        </div>
      </OuterPanel>
    </div>
  );
};
