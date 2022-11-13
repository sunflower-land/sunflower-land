import React, { useContext, useState } from "react";
import { Context } from "features/game/GoblinProvider";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import token from "assets/icons/token_2.png";
import questionMark from "assets/icons/expression_confused.png";
import {
  AuctioneerItem,
  getValidAuctionItems,
} from "./actions/auctioneerItems";
import { useActor } from "@xstate/react";
import { Countdown } from "../Countdown";

const TAB_CONTENT_HEIGHT = 364;

export type Release = {
  releaseDate: number;
  endDate?: number;
  supply: number;
  price: string;
};

export const AuctioneerContent = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const { auctioneerItems } = goblinState.context;
  const upcoming = getValidAuctionItems(auctioneerItems);

  const [selected, setSelected] = useState<AuctioneerItem | undefined>(
    upcoming[0]
  );

  if (selected === undefined) {
    return (
      <div className="flex flex-col">
        <span>Currently Unavailable!</span>
        <span>Please try again later.</span>
      </div>
    );
  }

  const PanelDetail = () => {
    const now = Date.now();
    const releaseDate = selected.currentRelease?.releaseDate as number;
    const releaseEndDate = selected.currentRelease?.endDate as number;
    const mintIsLive = releaseDate < now && releaseEndDate > now;

    return (
      <div className="mt-3 md:mt-0">
        <p>{selected.name}</p>
        <p className="flex items-center my-2 md:my-3">
          <img src={token} className="h-4 mr-1" />
          <span className="text-xs sm:text-sm text-shadow text-center">
            {`$${selected.currentRelease?.price}`}
          </span>
        </p>
        <div className="text-xs mt-4">
          {mintIsLive ? (
            <Button>Mint</Button>
          ) : (
            <div className="p-1 text-center border border-brown-200">
              <Countdown time={{}} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <OuterPanel className="flex-1 w-full flex flex-col justify-between items-center">
        <div
          className={
            "flex justify-around items-center p-2 relative w-full my-2 flex-col md:flex-row"
          }
        >
          <div>
            <img
              src={questionMark}
              className="h-24 rounded-md my-2"
              alt={selected.name}
            />
          </div>
          {PanelDetail()}
        </div>
      </OuterPanel>
      <div
        style={{
          maxHeight: TAB_CONTENT_HEIGHT,
        }}
        className="overflow-y-auto w-full pt-1 mr-1 scrollable"
      >
        <div className="flex flex-wrap h-fit justify-center">
          {upcoming.map((item) => (
            <Box
              isSelected={selected === item}
              key={item.name}
              onClick={() => setSelected(item)}
              image={questionMark}
              count={new Decimal(0)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
