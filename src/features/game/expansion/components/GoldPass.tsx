import { Button } from "components/ui/Button";
import React, { useContext } from "react";

import { NPC_WEARABLES } from "lib/npcs";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";

interface Props {
  onClose: () => void;
}

export const GoldPassModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);

  const Content = () => {
    return (
      <>
        <div className="flex flex-col p-2">
          <div className="flex items-center">
            <img
              src={ITEM_DETAILS["Gold Pass"].image}
              className="rounded-md my-2 img-highlight mr-2"
              style={{
                height: `${PIXEL_SCALE * 16}px`,
              }}
            />
            <p className="text-sm">1 x Gold Pass</p>
          </div>
          <p className="text-sm">Includes:</p>
          <ul className="list-disc">
            <li className="text-xs ml-4">Craft rare NFTs</li>
            <li className="text-xs ml-4">Trade with other players</li>
            <li className="text-xs ml-4">Participate in Auction Drops.</li>
            <li className="text-xs ml-4">Withdraw & Transfer NFTs</li>
            <li className="text-xs ml-4">Access to restricted areas</li>
          </ul>

          <a
            href="https://docs.sunflower-land.com/player-guides/X"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500"
          >
            Read more
          </a>
        </div>
        <div className="flex">
          <Button className="mr-1" onClick={onClose}>
            No thanks
          </Button>
          <Button
            onClick={() => {
              gameService.send("PURCHASE_ITEM", {
                name: "Gold Pass",
              });
              onClose();
            }}
          >
            {`Buy now $4.99`}
          </Button>
        </div>
      </>
    );
  };
  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.grubnuk} onClose={onClose}>
      <Content />
    </CloseButtonPanel>
  );
};
