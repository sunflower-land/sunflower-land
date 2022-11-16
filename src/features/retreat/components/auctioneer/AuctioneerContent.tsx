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
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { ItemSupply } from "lib/blockchain/Inventory";
import { ITEM_DETAILS } from "features/game/types/images";

const TAB_CONTENT_HEIGHT = 364;

const PanelDetail = ({
  item,
  supply,
  onMint,
}: {
  item: AuctioneerItem;
  supply: ItemSupply;
  onMint: () => void;
}) => {
  const releaseDate = item.currentRelease?.releaseDate as number;
  const releaseEndDate = item.currentRelease?.endDate as number;
  const start = useCountdown(releaseDate);
  const end = useCountdown(releaseEndDate);
  const isMintStarted =
    !start.days && !start.hours && !start.minutes && !start.seconds;
  const isMintComplete =
    !end.days && !end.hours && !end.minutes && !end.seconds;

  return (
    <div className="mt-3 md:mt-0 w-full md:w-1/2 text-center md:text-left">
      <p
        style={{
          marginBottom: "20px",
        }}
      >
        {item.name}
      </p>
      {!!item.currentRelease?.price && (
        <p className="flex items-center my-2 md:my-3 justify-center md:justify-start">
          <img src={token} className="h-4 mr-1" />
          <span className="text-xs sm:text-sm text-shadow text-center">
            {`$${item.currentRelease?.price}`}
          </span>
        </p>
      )}
      {item.currentRelease?.ingredients?.length && (
        <div
          style={{
            margin: "10px 0px 20px",
          }}
        >
          {item.currentRelease.ingredients.map((ingredient) => (
            <p
              className="mb-2 flex justify-center md:justify-start"
              key={ingredient.item}
            >
              <span className="mr-2">{ingredient.amount}</span>
              <img
                src={ITEM_DETAILS[ingredient.item].image}
                className="h-5 me-2"
              />
            </p>
          ))}
        </div>
      )}
      {/* TODO calculate total available supply*/}
      <p
        style={{
          margin: "20px 0",
        }}
      >
        <span className="text-error">{supply[item.name].toNumber()}</span>/
        <span>{item.currentRelease?.supply}</span>
      </p>
      <div className="text-xs mt-4">
        <Button disabled={!isMintStarted || isMintComplete} onClick={onMint}>
          Mint
        </Button>
        {!isMintStarted && (
          <div className="p-1 text-center mt-2">
            <Countdown
              days={start.days}
              hours={start.hours}
              minutes={start.minutes}
              seconds={start.seconds}
            />
          </div>
        )}
        {isMintStarted && !isMintComplete && (
          <div className="p-1 text-center mt-2">
            <Countdown
              days={end.days}
              hours={end.hours}
              minutes={end.minutes}
              seconds={end.seconds}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const AuctioneerContent = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const { auctioneerItems, supply } = goblinState.context;
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
          {/* do not remove this key as react gets confused while rendering*/}
          <PanelDetail
            key={selected.name}
            item={selected}
            supply={supply}
            onMint={() =>
              goblinService.send("MINT", { item: selected.name, captcha: "" })
            }
          />
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
