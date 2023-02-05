import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";

import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { getKeys } from "features/game/types/craftables";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { OuterPanel } from "components/ui/Panel";

import token from "assets/icons/token_2.png";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ToastContext } from "features/game/toast/ToastQueueProvider";

export type Letter = {
  id: string;
  title: string;
  content: string;
  from: string;
  bumpkin: Partial<BumpkinParts>;
  sentAt: number;
  gift?: {
    sfl: number;
    items: Partial<Record<InventoryItemName, number>>;
  };
};

type Props = {
  onOpen: (letter: Letter) => void;
};

export const Mail: React.FC<Props> = ({ onOpen }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const letters = gameState.context.state.mail?.letters ?? [];

  if (letters.length === 0) {
    return <p>No mail.</p>;
  }

  return (
    <>
      {letters.map((letter) => (
        <OuterPanel>
          <div className="flex cursor-pointer" onClick={() => onOpen(letter)}>
            <div className="h-12 w-12">
              <DynamicNFT bumpkinParts={letter.bumpkin} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-xs mb-2">{letter.from}</p>
                <p className=" text-xs underline">Read</p>
              </div>
              <p className=" text-xs">{letter.title}</p>
            </div>
          </div>
        </OuterPanel>
      ))}
    </>
  );
};

export const FocussedMail: React.FC<{
  letter: Letter;
  onClose: () => void;
}> = ({ letter, onClose }) => {
  const { gameService } = useContext(Context);
  const { setToast } = useContext(ToastContext);

  const read = () => {
    if (letter.gift) {
      getKeys(letter.gift.items).forEach((name) => {
        setToast({
          icon: ITEM_DETAILS[name as InventoryItemName].image,
          content: `+${letter.gift?.items[name]}`,
        });
      });
      if (letter.gift.sfl) {
        setToast({
          icon: token,
          content: `+${letter.gift.sfl}`,
        });
      }
    }

    gameService.send("mail.read", { id: letter.id });

    onClose();
  };
  return (
    <Modal centered show onHide={onClose}>
      <CloseButtonPanel onClose={onClose} bumpkinParts={letter.bumpkin}>
        <div className="p-2">
          <p className="text-sm mb-2 whitespace-pre-wrap">{letter.from}:</p>
          <p className="text-sm mb-2 whitespace-pre-wrap">{letter.content}</p>
          {letter.gift && (
            <div className="flex justify-between items-center mt-2">
              <div className="flex">
                {getKeys(letter.gift.items).map((name) => (
                  <div className="flex mr-3">
                    <img src={ITEM_DETAILS[name].image} className="h-6 mr-1" />
                    <p>{letter.gift?.items[name]}</p>
                  </div>
                ))}
                {!!letter.gift.sfl && (
                  <div className="flex">
                    <img src={token} className="h-6 mr-1" />
                    <p>{letter.gift.sfl}</p>
                  </div>
                )}
              </div>
              <Button onClick={read} className="w-auto text-xs">
                Claim gift
              </Button>
            </div>
          )}
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
